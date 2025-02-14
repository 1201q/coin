'use client';

import styles from './marketheader.module.css';
import MarketInfo from './MarketInfo';
import MarketSearch from './MarketSearch';
import { useAtomValue } from 'jotai';
import { isSearchDialogOpenAtom } from '@/store/ui';
import SearchDialog from './dialog/SearchDialog';

export default function MarketHeader({ market }: { market: string }) {
  const isDialogOpen = useAtomValue(isSearchDialogOpenAtom, { delay: 0 });
  return (
    <div className={styles.container}>
      <MarketSearch market={market} />
      <MarketInfo market={market} />
      {isDialogOpen && <SearchDialog />}
    </div>
  );
}
