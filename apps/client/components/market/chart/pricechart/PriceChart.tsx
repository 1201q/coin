import { candleQueryAtom, selectedPriceChartOptionAtom } from '@/store/chart';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import styles from './pricechart.module.css';
import {
  CandlestickSeries,
  CrosshairMode,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LogicalRange,
  createChart,
} from 'lightweight-charts';

import { convertPriceData, convertVolumeData } from '@/types/upbit';
import { chartMinMove, chartVolume } from '@/utils/formatting';
import dayjs from 'dayjs';
import { parseTime } from '@/utils/parse';
import { throttle } from '@/utils/throttle';

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

  const selected = useAtomValue(selectedPriceChartOptionAtom);

  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useAtomValue(candleQueryAtom);

  const candles = data.pages
    .flat()
    .filter((candle) => candle !== undefined && candle !== null)
    .sort((a, b) => {
      if (!a || !b) return 0;
      return parseTime(a.time) - parseTime(b.time);
    });

  const prices = candles.length > 0 ? convertPriceData(candles) : [];
  const volumes =
    candles.length > 0 && prices.length > 0
      ? convertVolumeData(candles).map((item, index) => {
          return {
            time: item.time,
            value: item.value / 1000000,
            color:
              prices[index].close >= prices[index].open ? mainred : mainblue,
          };
        })
      : [];

  const getChartOptions = (container: HTMLDivElement) => {
    return {
      width: container.clientWidth,
      height: container.clientHeight,
      localization: {
        locale: 'ko-KR',
        timeFormatter: (time: number) => {
          return dayjs.unix(time).add(9, 'hour').format('YYYY-MM-DD HH:mm');
        },
      },

      layout: {
        panes: {
          separatorColor: mainborder,
        },
        textColor: fontgray,
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
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: mainborder,
      },
    };
  };

  const getCandleStickSeriesOptions = (firstItemClose: number) => {
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
    if (range.from < 30 && selected.code === code) {
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
      getChartOptions(chartRef.current),
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
  }, [selected]);

  useEffect(() => {
    if (!chartClientRef.current) return;
    if (!candleSeriesRef.current) return;
    if (!volumeSeriesRef.current) return;
    if (prices.length === 0 || volumes.length === 0) return;

    const currentRange = chartClientRef.current
      .timeScale()
      .getVisibleLogicalRange();

    candleSeriesRef.current.setData(prices);
    volumeSeriesRef.current.setData(volumes);

    currentRange &&
      chartClientRef.current.timeScale().setVisibleLogicalRange(currentRange);
  }, [prices, volumes]);

  return <div ref={chartRef} className={styles.priceChart}></div>;
};

export default PriceChart;
