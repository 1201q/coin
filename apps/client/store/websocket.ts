import { atom, useAtom } from 'jotai';
import { io, Socket } from 'socket.io-client';
import {
  WsJoinResponse,
  WsLeaveResponse,
  WsResponse,
  WsTickerResponse,
} from '@/types/res';
import {
  convertTickerData,
  Orderbook,
  Ticker,
  TickerSnapshot,
  Trade,
} from '@/types/upbit';
import { atomWithDefault } from 'jotai/utils';

export const asyncTickersAtom = atomWithDefault(async (get) => {
  const res = await fetch('https://api.coingosu.live/upbit/allticker/KRW');
  const data: TickerSnapshot[] = await res.json();
  return data.map((item) => convertTickerData(item));
});

const orderbookAtom = atom<Orderbook>();
const tradeAtom = atom<Trade>();

const orderbookHandlerAtom = atom(
  (get) => get(orderbookAtom),
  (_get, set, update: Orderbook) => {
    set(orderbookAtom, update);
  },
);

const tradeHandlerAtom = atom(
  (get) => get(tradeAtom),
  (_get, set, update: Trade) => {
    set(tradeAtom, update);
  },
);

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

export function atomWithWebsocket() {
  const socketClientAtom = atom(null as unknown as Socket);
  const socketStatusAtom = atom(false);
  const tickerStatusAtom = atom(false);
  const joinedRoomAtom = atom<string | null>(null);

  const initSocketAtom = atom(
    (get) => get(socketClientAtom),
    (get, set, update: WebsocketAtomOptions) => {
      if (update.action === 'emit') {
        const socket = get(socketClientAtom);

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
      } else if (update.action === 'status') {
        switch (update.event) {
          case 'ticker:success': {
            set(tickerStatusAtom, true);
            break;
          }
          case 'ticker:fail': {
            set(tickerStatusAtom, false);
            break;
          }
          case 'join:success': {
            if (update.room) {
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
            set(joinedRoomAtom, null);
            break;
          }
        }
      } else if (update.action === 'socket') {
        switch (update.event) {
          case 'connect': {
            set(socketClientAtom, update.socket);
            break;
          }
          case 'disconnect': {
            set(socketClientAtom, update.socket);
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
        }
      }
    },
  );

  initSocketAtom.onMount = (set) => {
    const socket = io('https://api.coingosu.live/ws', {
      transports: ['websocket'],
    });

    // 연결
    socket.on('connect', () =>
      set({ action: 'socket', event: 'connect', socket: socket }),
    );

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
      console.log(msg);
      set({ action: 'message', event: 'ticker', data: msg });
    });

    socket.on('trade', (msg: Trade) => {
      console.log(msg);
      set({ action: 'message', event: 'trade', data: msg });
    });

    socket.on('orderbook', (msg: any) => {
      console.log(msg);
      set({ action: 'message', event: 'orderbook', data: msg });
    });

    return () => {
      socket.disconnect();
    };
  };

  return atom(
    (get) => ({
      client: get(socketClientAtom),
      status: {
        socket: get(socketStatusAtom),
        ticker: get(tickerStatusAtom),
        join: get(joinedRoomAtom),
      },
    }),
    (_get, set, update: WebsocketAtomOptions) => set(initSocketAtom, update),
  );
}

const [value, set] = useAtom(atomWithWebsocket());
set({ action: 'emit', event: 'ticker' });
