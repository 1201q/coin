import styles from './pricechart.module.css';
import PriceChartController from './PriceChartController';

const TestChart = ({ code }: { code: string }) => {
  return (
    <div className={styles.container}>
      <PriceChartController code={code} />
    </div>
  );
};

export default TestChart;
