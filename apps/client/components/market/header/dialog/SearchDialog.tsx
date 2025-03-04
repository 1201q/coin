'use client';

import styles from './search.dialog.module.css';
import SearchIcon from '@/public/search.svg';
import SearchDialogItem from './SearchDialogItem';
import { useAtomValue } from 'jotai';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { allMarketAtom } from '@/store/atom';
import { AnimatePresence, motion } from 'framer-motion';
import { tickersAtom } from '@/store/websocket';
import { TickerData } from '@/types/upbit';
import { useRouter } from 'next/navigation';

const TABS = ['마켓', '즐겨찾기'];

export default function SearchDialog() {
  const data = useAtomValue(tickersAtom);
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  const markets = useAtomValue(allMarketAtom);

  const bgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundClick = (e: MouseEvent) => {
    if (bgRef.current && bgRef.current === e.target) {
      router.back();
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
    if (!data) return new Map();

    const marketSet = new Set(filteredMarkets);
    const filteredMap = new Map<string, TickerData>();

    for (const [key, value] of data.entries()) {
      if (marketSet.has(key)) {
        filteredMap.set(key, value);
      }
    }

    return filteredMap;
  }, [filteredMarkets, data]);

  const dataArary = Array.from(filteredData.values());

  return (
    <div className={styles.container} ref={bgRef}>
      <motion.div
        className={styles.dialogContainer}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
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
        {!data || data.size === 0 ? (
          <div className={styles.loadingContainer}></div>
        ) : (
          <div className={styles.contentsContainer}>
            {filteredData && filteredData.size > 0 ? (
              dataArary.map((item) => (
                <SearchDialogItem
                  key={item.code}
                  market={item.code}
                  accTradePrice={item.acc_trade_price_24h}
                  tradePrice={item.trade_price}
                  changeRate={item.signed_change_rate}
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
        )}
      </motion.div>
    </div>
  );
}
