import { atom } from 'jotai';
import { atomWithCache } from 'jotai-cache';
import { atomWithObservable } from 'jotai/utils';
import { MarketInfo, TickerData } from '@/types/upbit';
import { socketService } from '@/utils/websocket';
import { Observable } from 'rxjs';

export const allMarketAtom = atomWithCache<Promise<MarketInfo[]>>(
  async (_get) => {
    const response = await fetch('https://api.coingosu.live/upbit/market');

    return response.json();
  },
);

export const marketAtom = atom(async (get) => {
  const markets = await get(allMarketAtom);

  return (marketCode: string) =>
    markets.find((item) => item.market === marketCode);
});

export const tickerSocketStatusAtom = atomWithObservable(() =>
  socketService.getTickerStatus(),
);

export const joinedRoomAtom = atomWithObservable(() =>
  socketService.getJoinedRoom(),
);

export const selectedCoinAtom = atom<string>('');

export const tickerDataAtom = atomWithObservable((get) => {
  const code = get(selectedCoinAtom);
  return socketService.getTicker(code);
});
