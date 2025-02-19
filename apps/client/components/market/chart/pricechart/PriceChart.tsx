import { selectedPriceChartOptionAtom } from '@/store/chart';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import styles from './pricechart.module.css';
import {
  AreaSeries,
  CandlestickSeries,
  CandlestickSeriesOptions,
  CrosshairMode,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  Time,
  createChart,
} from 'lightweight-charts';
import { fetchCandleData } from '@/utils/chart';
import {
  convertPriceData,
  convertVolumeData,
  PriceCandle,
  VolumeCandle,
} from '@/types/upbit';
import { chartComma, chartMinMove, chartVolume } from '@/utils/formatting';
import dayjs from 'dayjs';

const mainblue = 'rgba(74, 133, 253, 1)';
const mainred = 'rgb(240, 97, 109)';

const mainborder = 'rgb(209, 217, 224)';
const lighterborder = 'rgba(237, 237, 237,0.5)';
const fontgray = '#64748b';

const parseTime = (time: Time): number => {
  if (typeof time === 'string') {
    return new Date(time).getTime();
  } else if (typeof time === 'object') {
    return new Date(time.year, time.month - 1, time.day).getTime();
  } else {
    return time;
  }
};

const PriceChart = ({ code }: { code: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartClientRef = useRef<IChartApi>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'>>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'>>(null);

  const selected = useAtomValue(selectedPriceChartOptionAtom);

  const [candleData, setCandleData] = useState<PriceCandle[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeCandle[]>([]);

  const fetchCandle = async (to?: string) => {
    if (!selected.code || selected.code !== code) return;

    try {
      const res = await fetchCandleData({
        market: selected?.code,
        type: selected?.type,
        unit: selected?.minutes,
        ...(to ? { to } : {}),
      });

      const data = res.convertedData;

      const price = convertPriceData(data).sort((a, b) => {
        return parseTime(a.time) - parseTime(b.time);
      });

      const volume = convertVolumeData(data)
        .sort((a, b) => {
          return parseTime(a.time) - parseTime(b.time);
        })
        .map((item, index) => {
          return {
            time: item.time,
            value: item.value / 1000000,
            color: price[index].close >= price[index].open ? mainred : mainblue,
          };
        });

      if (to) {
        setCandleData((prev) => [...price, ...prev]);
        setVolumeData((prev) => [...volume, ...prev]);
      } else {
        setCandleData(price);
        setVolumeData(volume);
      }
    } catch (e) {
      console.error(e);
    }
  };

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

  useEffect(() => {
    fetchCandle();
  }, [selected]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (candleData.length === 0) return;

    const chart = createChart(
      chartRef.current,
      getChartOptions(chartRef.current),
    );
    chartClientRef.current = chart;

    candleSeriesRef.current = chart.addSeries(
      CandlestickSeries,
      getCandleStickSeriesOptions(candleData[0].close),
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
      if (range && range.from < 10 && selected.code === code) {
        const to = dayjs
          .unix(parseTime(candleData[0].time) - 1)
          .format('YYYY-MM-DDTHH:mm:ss');

        // fetchCandleData({
        //   market: selected.code,
        //   type: selected.type,
        //   unit: selected.minutes,
        //   to: to,
        // })
        //   .then((res) => {
        //     const data = res.convertedData;
        //     const newPrice = convertPriceData(data).sort((a, b) => {
        //       return parseTime(a.time) - parseTime(b.time);
        //     });

        //     const newVolume = convertVolumeData(data)
        //       .sort((a, b) => {
        //         return parseTime(a.time) - parseTime(b.time);
        //       })
        //       .map((item, index) => {
        //         return {
        //           time: item.time,
        //           value: item.value / 1000000,
        //           color:
        //             newPrice[index].close >= newPrice[index].open
        //               ? mainred
        //               : mainblue,
        //         };
        //       });

        //     if (
        //       newPrice.length > 0 &&
        //       newPrice[newPrice.length - 1].time < candleData[0].time
        //     ) {
        //       setCandleData((prev) => [...newPrice, ...prev]);
        //       setVolumeData((prev) => [...newVolume, ...prev]);
        //     }
        //   })
        //   .catch((e) => {
        //     console.error(e);
        //   });
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candleData, selected]);

  useEffect(() => {
    if (!chartClientRef.current) return;
    if (!candleSeriesRef.current) return;
    if (!volumeSeriesRef.current) return;
    if (candleData.length === 0 || volumeData.length === 0) return;

    candleSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);
  }, [candleData, volumeData]);

  return <div ref={chartRef} className={styles.priceChart}></div>;
};

export default PriceChart;
