'use client';

import { useState } from 'react';
import styles from './marketheader.module.css';
import MarketInfo from './MarketInfo';
import MarketSearch from './MarketSearch';

export default function MarketHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className={styles.container}>
      <MarketSearch
        code={'KRW-BTC'}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <MarketInfo />
      {isDialogOpen && <>{children}</>}
    </div>
  );
}
