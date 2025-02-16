import { atom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { tickersAtom } from './websocket';

export const useCoin = (coin: string) => {
  const data = useAtomValue(
    useMemo(
      () =>
        atom((get) => {
          const tickers = get(tickersAtom);
          return tickers?.get(coin);
        }),
      [coin],
    ),
  );
  return data;
};
