'use client';

import styles from './marketheader.module.css';
import MarketInfo from './MarketInfo';
import MarketSearch from './MarketSearch';

export default function MarketHeader({ market }: { market: string }) {
  return (
    <div className={styles.container}>
      <MarketSearch market={market} />
      <MarketInfo market={market} />
    </div>
  );
}
