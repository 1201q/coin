import styles from './pricechart.module.css';
import PriceChartController from './PriceChartController';

const TestChart = ({ code }: { code: string }) => {
  return (
    <div className={styles.container}>
      <PriceChartController />
    </div>
  );
};

export default TestChart;
