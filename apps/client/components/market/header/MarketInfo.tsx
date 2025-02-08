'use client';

import React, { useEffect } from 'react';
import styles from './marketinfo.module.css';
import { useAtom, useAtomValue } from 'jotai';
import { selectedCoinAtom, tickerDataAtom } from '@/store/atom';
import { acc, comma, plusMark, rate } from '@/utils/formatting';

interface Props {
  market: string;
}

const Skeleton = () => {
  return <div className={styles.skeleton}></div>;
};

export default function MarketInfo({ market }: Props) {
  const [coin, setCoin] = useAtom(selectedCoinAtom);
  const selectedTicker = useAtomValue(tickerDataAtom);

  const loading = coin !== market;

  const getColor = (changeRate: number) => {
    if (changeRate > 0) {
      return styles.red;
    } else if (changeRate < 0) {
      return styles.blue;
    } else {
      return styles.equal;
    }
  };

  const leftMargin = (price: number) => {
    const toString = price.toString();
    if (toString[0] === '1') {
      return styles.leftMargin;
    }
    return '';
  };

  useEffect(() => {
    setCoin(market);
  }, [market, setCoin]);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <span className={styles.header}>어제보다</span>
        {!loading && selectedTicker ? (
          <div className={styles.textContainer}>
            <span
              className={`${styles.text} ${styles.num} ${leftMargin(selectedTicker.trade_price)} ${getColor(selectedTicker.signed_change_rate)}`}
            >
              {comma(selectedTicker.trade_price, selectedTicker.trade_price)}
            </span>
            <span
              className={`${styles.small} ${styles.num} ${getColor(selectedTicker.signed_change_rate)}`}
            >
              {plusMark(selectedTicker.signed_change_rate)}
              {rate(selectedTicker.signed_change_rate)}%
            </span>
          </div>
        ) : (
          <Skeleton />
        )}
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.header}>거래대금(24H)</span>
        {!loading && selectedTicker ? (
          <div className={styles.textContainer}>
            <span
              className={`${styles.text}  ${styles.num} ${leftMargin(selectedTicker.acc_trade_price_24h)}`}
            >
              {acc(selectedTicker.acc_trade_price_24h)}
            </span>
            <span className={`${styles.small} ${styles.equal}`}>백만</span>
          </div>
        ) : (
          <Skeleton />
        )}
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.header}>고가(24H)</span>
        {!loading && selectedTicker ? (
          <div className={styles.textContainer}>
            <span
              className={`${styles.text} ${styles.red} ${leftMargin(selectedTicker.high_price)} ${styles.num}`}
            >
              {comma(selectedTicker.high_price, selectedTicker.high_price)}
            </span>
          </div>
        ) : (
          <Skeleton />
        )}
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.header}>저가(24H)</span>
        {!loading && selectedTicker ? (
          <div className={styles.textContainer}>
            <span
              className={`${styles.text} ${leftMargin(selectedTicker.low_price)} ${styles.blue} ${styles.num}`}
            >
              {comma(selectedTicker.low_price, selectedTicker.low_price)}
            </span>
          </div>
        ) : (
          <Skeleton />
        )}
      </div>
      coin{coin}/ssr-market:{market}
    </div>
  );
}
