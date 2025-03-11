import MarketHeaderController from '@/components/market/header/MarketHeaderController';
import styles from './header.module.css';
import MarketHeader from '@/components/market/header/MarketHeader';

interface Props {
  market: string;
}

export default function Header({ market }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <MarketHeader market={market} />
      </div>
      <div className={styles.controlContainer}>
        <MarketHeaderController />
      </div>
    </div>
  );
}
