import { selectedPriceChartOptionAtom } from '@/store/chart';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import styles from './pricechart.module.css';
import {
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  IChartApi,
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
import { chartComma, chartMinMove } from '@/utils/formatting';
import dayjs from 'dayjs';

const data = [
  { time: '2020-01-01', value: 50 },
  { time: '2020-01-02', value: 55 },
  { time: '2020-01-03', value: 52 },
  { time: '2020-01-04', value: 60 },
];

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
  const selected = useAtomValue(selectedPriceChartOptionAtom);

  const [candleData, setCandleData] = useState<PriceCandle[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeCandle[]>([]);

  useEffect(() => {
    if (selected.code && selected.code === code) {
      fetchCandleData({
        market: selected?.code,
        type: selected?.type,
        unit: selected?.minutes,
      }).then((res) => {
        const data = res.convertedData;

        const price = convertPriceData(data).sort((a, b) => {
          return parseTime(a.time) - parseTime(b.time);
        });

        const volume = convertVolumeData(data).sort((a, b) => {
          return parseTime(a.time) - parseTime(b.time);
        });

        console.log(volume);

        setCandleData(price);
        setVolumeData(volume);
      });
    }
  }, [selected]);

  useEffect(() => {
    if (chartRef.current && candleData.length > 0 && volumeData.length > 0) {
      const handleResize = () => {
        if (chartRef.current) {
          chart.applyOptions({
            width: chartRef.current.clientWidth,
            height: chartRef.current.clientHeight,
          });
        }
      };

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
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

        timeScale: {
          borderColor: mainborder,
        },
      });

      const candlestickSeries = chart.addSeries(
        CandlestickSeries,
        {
          upColor: mainred,
          downColor: mainblue,
          wickDownColor: mainblue,
          wickUpColor: mainred,
          borderVisible: false,
          priceFormat: {
            minMove: chartMinMove(candleData[0].close),
          },
        },
        1,
      );

      const histogramSeries = chart.addSeries(HistogramSeries, {
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });

      histogramSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.15,
          bottom: 0,
        },
      });

      candlestickSeries.setData(candleData);
      histogramSeries.setData(volumeData);

      const candlesPane = chart.panes()[1];

      candlesPane.moveTo(0);
      candlesPane.setHeight(350);

      chart.timeScale().fitContent();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [candleData, volumeData]);

  return <div ref={chartRef} className={styles.priceChart}></div>;
};

export default PriceChart;
