import {
  candleQueryAtom,
  PriceChartOption,
  selectedPriceChartOptionAtom,
} from '@/store/chart';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './pricechart.module.css';
import {
  CandlestickSeries,
  CandlestickSeriesOptions,
  ChartOptions,
  CrosshairMode,
  DeepPartial,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LogicalRange,
  TickMarkType,
  Time,
  createChart,
} from 'lightweight-charts';

import {
  convertCandleData,
  convertPriceData,
  convertVolumeData,
  PriceCandle,
  PriceChart as PriceChartType,
  TickerData,
} from '@/types/upbit';
import { chartMinMove, chartVolume } from '@/utils/formatting';
import dayjs from 'dayjs';
import { parseTime } from '@/utils/time';
import { throttle } from '@/utils/throttle';
import { useCoin } from '@/store/utils';

const mainblue = 'rgba(74, 133, 253, 1)';
const mainred = 'rgb(240, 97, 109)';

const mainborder = 'rgb(209, 217, 224)';
const lighterborder = 'rgba(237, 237, 237,0.5)';
const fontgray = '#64748b';

const PriceChart = ({ code }: { code: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartClientRef = useRef<IChartApi>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'>>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'>>(null);

  const coin = useCoin(code);

  const option = useAtomValue(selectedPriceChartOptionAtom);
  const { data, fetchNextPage, hasNextPage, isFetching, isPending, refetch } =
    useAtomValue(candleQueryAtom);
  const candles = data.pages;
  const [lastCandle, setLastCandle] = useState(candles[candles.length - 1]);
  const [isNextCandleFetched, setIsNextCandleFetched] = useState(false);

  useEffect(() => {
    if (option.code !== code) return;
    if (candles.length === 0) return;
    setLastCandle(candles[candles.length - 1]);
  }, [candles]);

  const getChartOptions = (
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

  const getCandleStickSeriesOptions = (
    firstItemClose: number,
  ): DeepPartial<CandlestickSeriesOptions> => {
    return {
      upColor: mainred,
      downColor: mainblue,
      wickDownColor: mainblue,
      wickUpColor: mainred,
      borderVisible: false,
      priceFormat: {
        minMove: chartMinMove(firstItemClose),
      },
    };
  };

  const throttleFunc = useMemo(() => {
    return throttle(250);
  }, []);

  const fetchPreviousCandleData = (range: LogicalRange) => {
    if ((range.from < 60 || range.from < 0) && option.code === code) {
      throttleFunc(() => {
        if (hasNextPage && !isFetching && !isPending) {
          fetchNextPage();
        } else {
          console.log('실행되지안흥ㅁ');
        }
      });
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;
    if (candles.length === 0) return;

    const chart = createChart(
      chartRef.current,
      getChartOptions(chartRef.current, option),
    );

    chartClientRef.current = chart;

    candleSeriesRef.current = chart.addSeries(
      CandlestickSeries,
      getCandleStickSeriesOptions(candles[candles.length - 1].close),
      1,
    );

    volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'custom',
        formatter: chartVolume,
      },
      priceLineVisible: false,
    });

    volumeSeriesRef.current.priceScale().applyOptions({
      scaleMargins: {
        top: 0.15,
        bottom: 0,
      },
    });

    const panes = chart.panes();

    if (panes.length > 1) {
      panes[1].moveTo(0);
      panes[1].setHeight(350);
    }

    const handleResize = () => {
      if (chartRef.current) {
        chart.applyOptions({
          width: chartRef.current.clientWidth,
          height: chartRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      range && fetchPreviousCandleData(range);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();

      chart.timeScale().unsubscribeVisibleLogicalRangeChange((range) => {
        range && fetchPreviousCandleData(range);
      });
    };
  }, [option]);

  useEffect(() => {
    if (!chartClientRef.current) return;
    if (!candleSeriesRef.current) return;
    if (!volumeSeriesRef.current) return;
    if (option.code !== code) return;

    const currentRange = chartClientRef.current
      .timeScale()
      .getVisibleLogicalRange();

    const sortedPrices = candles.length > 0 ? convertPriceData(candles) : [];
    const sortedVolumes =
      candles.length > 0 && sortedPrices.length > 0
        ? convertVolumeData(candles).map((item, index) => {
            return {
              time: item.time,
              value: item.value / 1000000,
              color:
                sortedPrices[index].close >= sortedPrices[index].open
                  ? mainred
                  : mainblue,
            };
          })
        : [];

    candleSeriesRef.current.setData(sortedPrices);
    volumeSeriesRef.current.setData(sortedVolumes);

    currentRange &&
      chartClientRef.current.timeScale().setVisibleLogicalRange(currentRange);
  }, [candles]);

  useEffect(() => {
    if (!coin || !lastCandle) return;
    if (option.code !== code) return;
    if (!chartClientRef.current) return;
    if (!candleSeriesRef.current) return;
    if (!volumeSeriesRef.current) return;
    if (!lastCandle) return;

    const nextCandleTime = dayjs
      .unix(parseTime(lastCandle.time))
      .add(
        option.type === 'minutes' && option.minutes ? option.minutes : 1,
        option.type,
      );
    const newCandleTime = dayjs(coin.trade_timestamp).add(-9, 'hours');

    if (nextCandleTime.isAfter(newCandleTime)) {
      console.log('이전');

      const data = {
        ...lastCandle,
        close: coin.trade_price,
        high: Math.max(coin.trade_price, lastCandle.high),
        low: Math.min(coin.trade_price, lastCandle.low),
        volume: lastCandle.volume + coin.trade_volume,
      };

      const [candle] = convertPriceData([data]);
      const [volume] = convertVolumeData([data]).map((item) => {
        return {
          time: item.time,
          value: item.value / 1000000,
          color: candle.close >= candle.open ? mainred : mainblue,
        };
      });

      candleSeriesRef.current.update(candle);
      volumeSeriesRef.current.update(volume);

      setLastCandle(data);

      if (!isNextCandleFetched) {
        setIsNextCandleFetched(true);
      }
    } else {
      if (isNextCandleFetched) {
        refetch();
        setIsNextCandleFetched(true);
      }
    }
  }, [coin]);

  return <div ref={chartRef} className={styles.priceChart}></div>;
};

export default PriceChart;
