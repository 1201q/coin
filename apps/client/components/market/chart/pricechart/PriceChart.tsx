import { useAtomValue } from 'jotai';
import styles from './pricechart.module.css';
import PriceChartController from './PriceChartController';
import { selectedPriceChartOptionAtom } from '@/store/chart';
import { useEffect } from 'react';

const PriceChart = ({ code }: { code: string }) => {
  const selected = useAtomValue(selectedPriceChartOptionAtom);

  useEffect(() => {
    console.log(selected);
  }, [selected]);
  return (
    <div className={styles.container}>
      <PriceChartController />
      <div className={styles.priceChart}>
        <p>{selected.type}</p>
        <p>{selected.minutes ? selected.minutes : '없음'}</p>
      </div>
    </div>
  );
};

export default PriceChart;
