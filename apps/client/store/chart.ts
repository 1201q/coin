import { atom } from 'jotai';

const priceChartOptions = [
  'minutes',
  'days',
  'weeks',
  'months',
  'years',
] as const;
const priceChartMinuteOptions = [1, 3, 5, 10, 15, 30, 60] as const;

export type ChartOptions = (typeof priceChartOptions)[number];
export type ChartMinutesOptions = (typeof priceChartMinuteOptions)[number];

interface PriceChartOption {
  type: ChartOptions;
  minutes?: ChartMinutesOptions;
}

export const priceChartOptionAtom = atom<ChartOptions>('days');
export const minutesOptionAtom = atom<ChartMinutesOptions>(5);

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

  if (isMinutes) {
    return {
      type: 'minutes',
      minutes: get(minutesOptionAtom),
    };
  } else {
    return {
      type: get(priceChartOptionAtom),
    };
  }
});

export const isSelectedMinuteOptionAtom = atom(false);
export const isChartOptionDropDownOpenAtom = atom(false);

const chartOption = atom<ChartOptions>('days');
const minutesOption = atom<ChartMinutesOptions>(5);

const isSelectedMinute = atom(false);
const isOpenDropdownMenu = atom(false);

const selectedChartOptionAtom = atom<ChartOptions>((get) => get(chartOption));
const selectedMinuteOptionAtom = atom<ChartMinutesOptions>((get) =>
  get(minutesOption),
);

const isSelectedMinuteAtom = atom(
  (get) => get(isSelectedMinute),
  (get, set, update) => {
    if (update) {
      set(chartOption, 'minutes');
    }
  },
);
const isOpenDropdownMenuAtom = atom((get) => get(isOpenDropdownMenu));
