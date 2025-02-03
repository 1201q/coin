import styles from './header.module.css';
import MarketHeader from '@/components/market/header/MarketHeader';
import CoinListServer from '@/components/market/header/CoinListServer';

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <MarketHeader>
          <CoinListServer />
        </MarketHeader>
      </div>
      <div className={styles.controlContainer}></div>
    </div>
  );
}
