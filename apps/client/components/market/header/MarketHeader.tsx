'use client';

import { useState } from 'react';
import styles from './marketheader.module.css';
import MarketInfo from './MarketInfo';
import MarketSearch from './MarketSearch';

export default function MarketHeader({
  children,
  market,
}: {
  children: React.ReactNode;
  market: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className={styles.container}>
      <MarketSearch
        market={market}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <MarketInfo />
      {isDialogOpen && <>{children}</>}
    </div>
  );
}
