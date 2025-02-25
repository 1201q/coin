import { atom } from 'jotai';
import { io, Socket } from 'socket.io-client';
import {
  WsJoinResponse,
  WsLeaveResponse,
  WsResponse,
  WsTickerResponse,
} from '@/types/res';
import {
  convertTickerData,
  convertTradeData,
  Orderbook,
  Ticker,
  TickerData,
  TickerSnapshot,
  Trade,
  TradeData,
} from '@/types/upbit';
import { atomWithDefault, atomWithReset } from 'jotai/utils';
import { coinAtom } from './chart';

type SocketEvent = 'connect' | 'disconnect';
type StatusEvent =
  | 'ticker:success'
  | 'ticker:fail'
  | 'join:success'
  | 'join:fail'
  | 'leave:success';
type EmitEvent = 'ticker' | 'ticker:stop' | 'join' | 'leave';
type MessageEvent = 'ticker' | 'trade' | 'orderbook';

type WebsocketAtomOptions =
  | { action: 'socket'; event: SocketEvent; socket: Socket }
  | { action: 'status'; event: StatusEvent; room?: string }
  | { action: 'emit'; event: EmitEvent; room?: string }
  | { action: 'message'; event: MessageEvent; data: any };

const fetchTickersAtom = atomWithDefault(async (get) => {
  const res = await fetch('https://api.coingosu.live/upbit/allticker/KRW');
  const data: TickerSnapshot[] = await res.json();

  const tickerMap = new Map<string, TickerData>();
  data.forEach((item) => {
    const convertedItem = convertTickerData(item);
    tickerMap.set(convertedItem.code, convertedItem);
  });

  return tickerMap;
});

export const tradeAtom = atom<TradeData[]>([]);
export const hydratedTradeAtom = atom<TradeData[]>([]);

export const tickersAtom = atom<Map<string, TickerData>>();

export const selectedTickerAtom = atom((get) => {
  const tickers = get(tickersAtom);

  return (code: string) => tickers?.get(code);
});

export const orderbookAtom = atom<Orderbook>();

export const tickersHandlerAtom = atom(
  (get) => get(tickersAtom),
  async (get, set, update: Ticker) => {
    const initTickers = await get(fetchTickersAtom);
    const prevTickers = get(tickersAtom);

    if (!prevTickers || prevTickers.size === 0) {
      set(tickersAtom, initTickers);
    } else {
      // const newTickers = prevTickers.map((item) => {
      //   if (item.code === update.code) {
      //     return update;
      //   }
      //   return item;
      // });

      // set(tickersAtom, newTickers);

      const newTickers = new Map(prevTickers);
      newTickers.set(update.code, update);
      set(tickersAtom, newTickers);
    }
  },
);

export const orderbookHandlerAtom = atom(
  (get) => get(orderbookAtom),
  (_get, set, update: Orderbook) => {
    set(orderbookAtom, update);
  },
);

export const tradeHandlerAtom = atom(
  (get) => get(tradeAtom),
  (get, set, update: Trade) => {
    const prev = get(tradeAtom);

    if (
      prev.findIndex(
        (item) =>
          item.ask_bid === update.ask_bid &&
          item.sequential_id === update.sequential_id &&
          item.trade_volume === item.trade_volume,
      ) !== -1
    )
      return;

    const newArray = [convertTradeData(update), ...prev];

    const slicedArray = newArray.length > 70 ? newArray.slice(0, 70) : newArray;

    set(tradeAtom, slicedArray);
  },
);

const socketClientAtom = atom(null as unknown as Socket);
export const socketStatusAtom = atom(false);

export const tickerStatusAtom = atom(false);
export const joinedRoomAtom = atom<string | null>(null);

export const initSocketAtom = atom(
  (get) => get(socketClientAtom),
  (get, set, update: WebsocketAtomOptions) => {
    if (update.action === 'emit') {
      const socket = get(socketClientAtom);

      if (socket) {
        switch (update.event) {
          case 'ticker': {
            socket.emit('ticker');
            break;
          }
          case 'ticker:stop': {
            socket.emit('ticker:stop');
            break;
          }
          case 'leave': {
            socket.emit('leave');
            break;
          }
          case 'join': {
            socket.emit('join', update.room);
            break;
          }
        }
      } else {
        console.log('no socket!');
      }
    } else if (update.action === 'status') {
      switch (update.event) {
        case 'ticker:success': {
          set(tickerStatusAtom, true);
          console.log('ticker:success');
          break;
        }
        case 'ticker:fail': {
          set(tickerStatusAtom, false);
          console.log('ticker:fail');
          break;
        }
        case 'join:success': {
          if (update.room) {
            console.log('join', update.room);
            set(joinedRoomAtom, update.room);
          } else {
            set(joinedRoomAtom, null);
          }
          break;
        }
        case 'join:fail': {
          set(joinedRoomAtom, null);
          break;
        }
        case 'leave:success': {
          console.log('leave:success');
          set(joinedRoomAtom, null);
          break;
        }
      }
    } else if (update.action === 'socket') {
      switch (update.event) {
        case 'connect': {
          set(socketClientAtom, update.socket);
          set(socketStatusAtom, true);

          console.log('connect');
          break;
        }
        case 'disconnect': {
          set(socketClientAtom, update.socket);
          set(socketStatusAtom, false);

          console.log('disconnect');
          break;
        }
      }
    } else if (update.action === 'message') {
      switch (update.event) {
        case 'orderbook': {
          set(orderbookHandlerAtom, update.data);
          break;
        }
        case 'trade': {
          set(tradeHandlerAtom, update.data);
          break;
        }
        case 'ticker': {
          set(tickersHandlerAtom, update.data);
          break;
        }
      }
    }
  },
);

initSocketAtom.onMount = (set) => {
  const socket = io('https://api.coingosu.live/ws', {
    transports: ['websocket'],
  });

  // 연결
  socket.on('connect', () => {
    set({ action: 'socket', event: 'connect', socket: socket });
  });

  socket.on('disconnect', () =>
    set({ action: 'socket', event: 'disconnect', socket: socket }),
  );

  // ticker 수신 성공 여부
  socket.on('ticker:start', (msg: WsTickerResponse) => {
    if (msg.status === 'success') {
      set({ action: 'status', event: 'ticker:success' });
    } else if (msg.status !== 'already') {
      set({ action: 'status', event: 'ticker:fail' });
    }
  });

  // ticker 중지 여부
  socket.on('ticker:stop', (msg: WsResponse) => {
    if (msg.status === 'success') {
      set({ action: 'status', event: 'ticker:fail' });
    }
  });

  // join 데이터 수신 여부
  socket.on('join', (msg: WsJoinResponse) => {
    if (msg.status === 'success') {
      set({ action: 'status', event: 'join:success', room: msg.submitCode });
    } else if (msg.status === 'fail') {
      set({ action: 'status', event: 'join:fail' });
    }
  });

  // join room에서 나감 여부
  socket.on('leave', (msg: WsLeaveResponse) => {
    if (msg.status === 'success') {
      set({ action: 'status', event: 'leave:success' });
    }
  });

  // ticker 데이터 수신
  socket.on('ticker', (msg: Ticker) => {
    set({ action: 'message', event: 'ticker', data: msg });
  });

  socket.on('trade', (msg: Trade) => {
    set({ action: 'message', event: 'trade', data: msg });
  });

  socket.on('orderbook', (msg: any) => {
    set({ action: 'message', event: 'orderbook', data: msg });
  });

  return () => {
    set({ action: 'status', event: 'leave:success' });
    set({ action: 'status', event: 'ticker:fail' });

    socket.disconnect();
  };
};
