'use client';

import { TickerSnapshot } from '@/types/upbit';
import styles from './search.dialog.module.css';
import SearchIcon from '@/public/search.svg';
import SearchDialogItem from './SearchDialogItem';
import { useSetAtom } from 'jotai';
import { isSearchDialogOpenAtom } from '@/store/ui';
import { useEffect, useRef } from 'react';

export default function SearchDialog({ data }: { data: TickerSnapshot[] }) {
  const setIsDialogOpen = useSetAtom(isSearchDialogOpenAtom);

  const bgRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (e: MouseEvent) => {
    if (bgRef.current && bgRef.current === e.target) {
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleBackgroundClick);
    return () => {
      document.removeEventListener('mousedown', handleBackgroundClick);
    };
  }, []);

  return (
    <div className={styles.container} ref={bgRef}>
      <div className={styles.dialogContainer}>
        {/* title */}
        <div className={styles.titleContainer}>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <div className={styles.searchIconBox}>
                <SearchIcon width={14} height={14} />
              </div>
              <div className={styles.inputBox}>
                <input type="text" placeholder="검색어를 입력하세요" />
              </div>
            </div>
          </div>
          <div className={styles.listHeaderContainer}>
            <div className={`${styles.listHeaderBox} ${styles.left}`}>
              <span className={`${styles.listHeaderText}`}>코인명</span>
            </div>
            <div className={styles.listHeaderBox}>
              <span className={styles.listHeaderText}>현재가</span>
            </div>
            <div className={styles.listHeaderBox}>
              <span className={styles.listHeaderText}>어제보다</span>
            </div>
            <div className={styles.listHeaderBox}>
              <span className={styles.listHeaderText}>거래대금</span>
            </div>
          </div>
        </div>
        {/* 코인 리스트 */}
        <div className={styles.contentsContainer}>
          {data.map((item) => (
            <SearchDialogItem
              key={item.market}
              market={item.market}
              accTradePrice={item.acc_trade_price_24h}
              tradePrice={item.trade_price}
              changePrice={item.signed_change_price}
              changeRate={item.signed_change_rate}
              change={item.change}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
