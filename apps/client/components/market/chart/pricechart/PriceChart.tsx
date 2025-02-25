import {
  candleHistoryQueryAtom,
  selectedPriceChartOptionAtom,
} from '@/store/chart';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './pricechart.module.css';
import {
  CandlestickSeries,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LogicalRange,
  createChart,
} from 'lightweight-charts';

import {
  convertPriceData,
  convertVolumeData,
  PriceChart as PriceChartType,
} from '@/types/upbit';
import { chartVolume } from '@/utils/formatting';
import dayjs from 'dayjs';
import { getNextCandleTime } from '@/utils/time';
import { throttle } from '@/utils/throttle';
import { useCoin } from '@/store/utils';
import {
  getCandleStickSeriesOptions,
  getChartOptions,
  getVolumeCandleWithColor,
} from './settings/utils';
import { useUpdateFirstPageQuery } from '@/hooks/useUpdateFirstPageQuery';

const PriceChart = ({ code }: { code: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartClientRef = useRef<IChartApi>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'>>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'>>(null);

  const lastCandleRef = useRef<PriceChartType | null>(null);

  const chartOptions = useAtomValue(selectedPriceChartOptionAtom);
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useAtomValue(candleHistoryQueryAtom);

  const update = useUpdateFirstPageQuery(code);

  const ticker = useCoin(code);
  const candles = data.pages;

  const [hasFetchedLatest, setHasFetchedLatest] = useState(false);

  const throttleFunc = useMemo(() => throttle(250), []);

  const fetchPreviousCandleData = useCallback(
    (range: LogicalRange) => {
      if ((range.from < 60 || range.from < 0) && chartOptions.code === code) {
        throttleFunc(() => {
          if (hasNextPage && !isFetching && !isPending) {
            fetchNextPage();
          } else {
            console.log('실행x');
          }
        });
      }
    },
    [
      chartOptions.code,
      code,
      throttleFunc,
      hasNextPage,
      isFetching,
      isPending,
      fetchNextPage,
    ],
  );

  const getSortedData = (candles: PriceChartType[]) => {
    const sortedPrices = candles.length > 0 ? convertPriceData(candles) : [];
    const sortedVolumes =
      candles.length > 0 && sortedPrices.length > 0
        ? getVolumeCandleWithColor(convertVolumeData(candles), sortedPrices)
        : [];

    return { price: sortedPrices, volume: sortedVolumes };
  };

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    setHasFetchedLatest(false);
    lastCandleRef.current = null;

    const chart = createChart(
      chartRef.current,
      getChartOptions(chartRef.current, chartOptions),
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

    lastCandleRef.current = candles[candles.length - 1];

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartOptions]);

  useEffect(() => {
    if (
      !chartClientRef.current ||
      !candleSeriesRef.current ||
      !volumeSeriesRef.current
    )
      return;

    const { price, volume } = getSortedData(candles);

    candleSeriesRef.current.setData(price);
    volumeSeriesRef.current.setData(volume);

    const currentRange = chartClientRef.current
      .timeScale()
      .getVisibleLogicalRange();

    if (currentRange) {
      chartClientRef.current.timeScale().setVisibleLogicalRange(currentRange);
    }
  }, [candles]);

  useEffect(() => {
    if (chartOptions.code !== code) return;
    if (!ticker) return;
    if (
      !chartClientRef.current ||
      !candleSeriesRef.current ||
      !volumeSeriesRef.current
    )
      return;
    if (lastCandleRef.current === null) return;

    const updatedCandleData = {
      ...candles[candles.length - 1],
      close: ticker.trade_price,
      high: Math.max(lastCandleRef.current.high, ticker.trade_price),
      low: Math.min(lastCandleRef.current.low, ticker.trade_price),
      volume:
        chartOptions.type === 'minutes'
          ? lastCandleRef.current.volume + ticker.trade_volume
          : lastCandleRef.current.volume + ticker.trade_volume,
    };

    const { price, volume } = getSortedData([updatedCandleData]);

    const nextCandleTime = getNextCandleTime(
      candles[candles.length - 1].time,
      chartOptions,
    );
    const latestCandleTime = dayjs(ticker.trade_timestamp);

    if (nextCandleTime.isBefore(latestCandleTime)) {
      if (!hasFetchedLatest) {
        setHasFetchedLatest(true);
        setTimeout(() => {
          update.updateFirstPageQuery();
        }, 1500);
      }
    } else {
      candleSeriesRef.current.update(price[0]);
      volumeSeriesRef.current.update(volume[0]);
      lastCandleRef.current = updatedCandleData;

      if (hasFetchedLatest) {
        setHasFetchedLatest(false);
      }
    }
  }, [candles, ticker, chartOptions, code, hasFetchedLatest]);

  return <div ref={chartRef} className={styles.priceChart}></div>;
};

export default PriceChart;
