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
  convertPriceData,
  convertVolumeData,
  PriceCandle,
  PriceChart as PriceChartType,
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

  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useAtomValue(candleQueryAtom);

  const candles = data.pages
    .flat()
    .filter((candle) => candle !== undefined && candle !== null)
    .sort((a, b) => {
      if (!a || !b) return 0;
      return parseTime(a.time) - parseTime(b.time);
    });

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

  const fetchNextCandleData = (range: LogicalRange) => {
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

  const generateDummyCandles = (data: PriceCandle[], count: number) => {
    const lastTime = data[data.length - 1].time;
    const secondLastTime = data[data.length - 2].time;

    const addTime = parseTime(lastTime) - parseTime(secondLastTime);
    let currentTime = parseTime(lastTime);

    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push({
        time: (currentTime + addTime) as Time,
      });

      currentTime = currentTime + addTime;
    }

    // console.log(arr);
    return arr;
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
      range && fetchNextCandleData(range);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();

      chart.timeScale().unsubscribeVisibleLogicalRangeChange((range) => {
        range && fetchNextCandleData(range);
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

    const dummy = generateDummyCandles(sortedPrices, 10);

    // const test = [...sortedPrices, ...dummy].map((item) => {
    //   return dayjs.unix(parseTime(item.time)).format('YYYY-MM-DD HH:mm');
    // });

    // console.log(test);

    candleSeriesRef.current.setData([...sortedPrices, ...dummy]);
    volumeSeriesRef.current.setData([...sortedVolumes, ...dummy]);

    currentRange &&
      chartClientRef.current.timeScale().setVisibleLogicalRange(currentRange);
  }, [candles]);

  return <div ref={chartRef} className={styles.priceChart}></div>;
};

export default PriceChart;
