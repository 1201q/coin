'use client';

import { TickerSnapshot } from '@/types/upbit';
import styles from './search.dialog.module.css';
import SearchIcon from '@/public/search.svg';
import SearchDialogItem from './SearchDialogItem';
import { useAtomValue, useSetAtom } from 'jotai';
import { isSearchDialogOpenAtom } from '@/store/ui';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { allMarketAtom } from '@/store/atom';
import { motion } from 'framer-motion';

const TABS = ['마켓', '즐겨찾기'];

export default function SearchDialog({ data }: { data: TickerSnapshot[] }) {
  const setIsDialogOpen = useSetAtom(isSearchDialogOpenAtom);
  const [keyword, setKeyword] = useState('');
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  const markets = useAtomValue(allMarketAtom);

  const bgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundClick = (e: MouseEvent) => {
    if (bgRef.current && bgRef.current === e.target) {
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    document.addEventListener('mousedown', handleBackgroundClick);
    return () => {
      document.removeEventListener('mousedown', handleBackgroundClick);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 200);

    return () => clearTimeout(timer);
  }, [keyword]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const filteredMarkets = useMemo(() => {
    const lowerKeyword = debouncedKeyword.toLowerCase();

    return markets
      .filter((item) => {
        return (
          item.market.split('-')[1].toLowerCase().includes(lowerKeyword) ||
          item.korean_name.toLowerCase().includes(lowerKeyword) ||
          item.english_name
            .toLowerCase()
            .replaceAll(' ', '')
            .includes(lowerKeyword)
        );
      })
      .map((item) => item.market);
  }, [debouncedKeyword, markets]);

  const filteredData = useMemo(() => {
    const marketSet = new Set(filteredMarkets);
    return data.filter((item) => marketSet.has(item.market));
  }, [filteredMarkets, data]);

  return (
    <div className={styles.container} ref={bgRef}>
      <div className={styles.dialogContainer}>
        {/* title */}
        <div className={styles.titleContainer}>
          <div className={styles.tabmenuContainer}>
            {TABS.map((tab) => (
              <div
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`${styles.tabmenu} ${selectedTab === tab ? styles.selected : ''}`}
              >
                <span>{tab}</span>
                {selectedTab === tab && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={styles.indicator}
                  ></motion.div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.searchContainer}>
            <div className={styles.searchIconBox}>
              <SearchIcon width={11} height={11} />
            </div>

            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                ref={inputRef}
                maxLength={20}
                value={keyword}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        {/* 리스트 헤더 */}
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
        {/* 코인 리스트 */}
        <div className={styles.contentsContainer}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <SearchDialogItem
                key={item.market}
                market={item.market}
                accTradePrice={item.acc_trade_price_24h}
                tradePrice={item.trade_price}
                changePrice={item.signed_change_price}
                changeRate={item.signed_change_rate}
                change={item.change}
              />
            ))
          ) : (
            <div className={styles.noresultContainer}>
              <p className={styles.alertText}>검색결과를 찾을 수 없습니다</p>
              <p className={`${styles.listHeaderText}`}>
                다른 검색어로 다시 시도해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
