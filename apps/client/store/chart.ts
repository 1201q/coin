import { CandleType, CandleUnit } from '@/types/upbit';
import { atom } from 'jotai';

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

export const isSelectedMinuteOptionAtom = atom(false);
export const isChartOptionDropDownOpenAtom = atom(false);
