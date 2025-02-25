import { PriceChartOption } from '@/store/chart';
import { parseTime } from '@/utils/time';
import dayjs from 'dayjs';
import {
  CandlestickSeriesOptions,
  ChartOptions,
  CrosshairMode,
  DeepPartial,
  Time,
} from 'lightweight-charts';
import {
  fontgray,
  lighterborder,
  mainblue,
  mainborder,
  mainred,
} from './constants';
import { chartMinMove } from '@/utils/formatting';
import { PriceCandle, VolumeCandle } from '@/types/upbit';

export const getChartOptions = (
  container: HTMLDivElement,
  option: PriceChartOption,
): DeepPartial<ChartOptions> => {
  return {
    width: container.clientWidth,
    height: container.clientHeight,
    localization: {
      locale: 'ko-kr',
      timeFormatter: (time: number) => {
        if (option.type === 'minutes') {
          return dayjs.unix(time).format('YYYY-MM-DD  HH:mm');
        } else {
          return dayjs.unix(time).format('YYYY-MM-DD');
        }
      },
    },

    layout: {
      panes: {
        separatorColor: mainborder,
      },
      textColor: fontgray,
      fontFamily: 'Pretendard',
    },

    grid: {
      vertLines: {
        color: lighterborder,
      },
      horzLines: {
        color: lighterborder,
      },
    },

    rightPriceScale: {
      borderColor: mainborder,
      autoScale: true,
    },

    crosshair: {
      mode: CrosshairMode.Normal,
    },
    timeScale: {
      borderColor: mainborder,
      allowShiftVisibleRangeOnWhitespaceReplacement: true,
      timeVisible: true,
      rightOffset: 10,
      tickMarkFormatter: (time: Time) => {
        if (option.type === 'minutes') {
          return dayjs.unix(parseTime(time)).format('HH:mm');
        }
        return null;
      },

      minBarSpacing: 1,
    },
  };
};

export const getCandleStickSeriesOptions = (
  firstItemClose: number,
): DeepPartial<CandlestickSeriesOptions> => ({
  upColor: mainred,
  downColor: mainblue,
  wickDownColor: mainblue,
  wickUpColor: mainred,
  borderVisible: false,
  priceFormat: {
    minMove: chartMinMove(firstItemClose),
  },
});

export const getVolumeCandleWithColor = (
  volumes: VolumeCandle[],
  prices: PriceCandle[],
) => {
  return volumes.map((item, index) => {
    return {
      time: item.time,
      value: item.value / 1000000,
      color: prices[index].close >= prices[index].open ? mainred : mainblue,
    };
  });
};
