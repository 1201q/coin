import { atom } from 'jotai';
import { atomWithCache } from 'jotai-cache';
import { MarketInfo } from '@/types/upbit';

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
