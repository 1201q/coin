'use client';

import styles from './marketheader.module.css';
import MarketInfo from './MarketInfo';
import MarketSearch from './MarketSearch';
import { useAtomValue } from 'jotai';
import { isSearchDialogOpenAtom } from '@/store/ui';

export default function MarketHeader({
  children,
  market,
}: {
  children: React.ReactNode;
  market: string;
}) {
  const isDialogOpen = useAtomValue(isSearchDialogOpenAtom);
  return (
    <div className={styles.container}>
      <MarketSearch market={market} />
      <MarketInfo market={market} />
      {isDialogOpen && <>{children}</>}
    </div>
  );
}
