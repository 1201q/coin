import { CandleType, CandleUnit } from '@/types/upbit';
import { fetchCandleData } from '@/utils/chart';
import { parseTime } from '@/utils/parse';
import dayjs from 'dayjs';
import { atom } from 'jotai';
import { atomWithSuspenseInfiniteQuery } from 'jotai-tanstack-query';

export interface PriceChartOption {
  type: CandleType;
  minutes?: CandleUnit;
  code?: string | undefined;
}

export const hydratedCoinAtom = atom<string>();
export const coinAtom = atom<string>();

export const priceChartOptionAtom = atom<CandleType>('days');
export const minutesOptionAtom = atom<CandleUnit>(5);

export const setPriceChartOptionAtom = atom(
  null,
  (_get, set, update: PriceChartOption) => {
    if (update.type === 'minutes') {
      if (update.minutes !== undefined) {
        set(priceChartOptionAtom, 'minutes');
        set(minutesOptionAtom, update.minutes);
        set(isChartOptionDropDownOpenAtom, false);
      }
    } else {
      set(priceChartOptionAtom, update.type);
      set(isSelectedMinuteOptionAtom, false);
    }
  },
);

export const selectedPriceChartOptionAtom = atom<PriceChartOption>((get) => {
  const isMinutes = get(isSelectedMinuteOptionAtom);
  const code = get(coinAtom);

  if (isMinutes) {
    return {
      type: 'minutes',
      minutes: get(minutesOptionAtom),
      code: code,
    };
  } else {
    return {
      type: get(priceChartOptionAtom),
      code: code,
    };
  }
});

export const candleToAtom = atom<string | null>(null);

export const isSelectedMinuteOptionAtom = atom(false);
export const isChartOptionDropDownOpenAtom = atom(false);

export const candleQueryAtom = atomWithSuspenseInfiniteQuery((get) => {
  const options = get(selectedPriceChartOptionAtom);

  return {
    queryKey: ['candle', options.code, options.type, options.minutes],
    queryFn: async ({ pageParam }) => {
      if (options.code === undefined) return;

      const res = await fetchCandleData({
        market: options.code,
        type: options.type,
        unit: options.minutes,
        to: typeof pageParam === 'string' ? pageParam : undefined,
      });

      const sortedData = res.convertedData.sort(
        (a, b) => parseTime(a.time) - parseTime(b.time),
      );

      console.log(sortedData);
      return sortedData;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.length === 200) {
        const firstData = lastPage[0];
        const to = dayjs
          .unix(parseTime(firstData.time) - 1)
          .format('YYYY-MM-DDTHH:mm:ss');

        return to;
      }

      return undefined;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    initialPageParam: undefined,
  };
});
