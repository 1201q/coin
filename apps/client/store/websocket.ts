import { atom } from 'jotai';
import { io, Socket } from 'socket.io-client';
import * as WebSocket from 'ws';
import type { Getter, Setter } from 'jotai';
import { WsTickerResponse } from '@/types/res';

// export const socketAtom = atom(null as unknown as Socket);
export const socketStatusAtom = atom(false);
export const tickerStatusAtom = atom(false);

export const socketAtom = atom(null as unknown as Socket);

export const initAtom = atom(
  (get) => get(socketAtom),
  (get, set, update: { type: string; client: Socket }) => {
    if (update.type === 'connect') {
      set(socketStatusAtom, true);
      set(socketAtom, update.client);
      console.log('zzzzzzzzzzzzzz');
    } else if (update.type === 'ticker') {
      const client = get(socketAtom);
      client.emit('ticker');
    }
  },
);
initAtom.onMount = (set) => {
  const client = io('https://api.coingosu.live/ws', {
    transports: ['websocket'],
  });

  client.on('connect', () => {
    set({ type: 'connect', client });
  });

  client.on('ticker:start', (msg: WsTickerResponse) => {
    if (msg.count && msg.count > 0 && msg.status === 'success') {
      set({ type: 'ticker:success', client });
      console.log('ticker:start', msg);
    } else {
      set({ type: 'ticker:fail', client });
      console.log('ticker:fail', msg);
    }
  });

  setInterval(() => {
    set({ type: 'ticker', client });
  }, 5000);

  return () => {
    console.log('disconnect');
    client.disconnect();
  };
};
