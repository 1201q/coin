'use client';

import { useEffect, useMemo } from 'react';
import styles from './orderbook.info.module.css';

import React from 'react';

import { useCoin } from '@/store/utils';
import { acc, comma, orderbook } from '@/utils/formatting';

const OrderbookInfo = ({ code }: { code: string }) => {
  const data = useCoin(code);

  return (
    <div className={styles.container}>
      {/* 52주 */}
      <div className={styles.infoContainer}>
        <span className={styles.headerText}>1년 최고</span>
        {data && (
          <p className={`${styles.text} ${styles.red}`}>
            {comma(data.highest_52_week_price, data.highest_52_week_price)}
          </p>
        )}
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.headerText}>1년 최저</span>
        {data && (
          <p className={`${styles.text} ${styles.blue}`}>
            {comma(data.lowest_52_week_price, data.lowest_52_week_price)}
          </p>
        )}
      </div>
      {/* 종가 고가 저가 */}
      <span className={styles.line}></span>
      <div className={styles.infoContainer}>
        <span className={styles.headerText}>종가</span>
        {data && (
          <p className={`${styles.text} ${styles.equal}`}>
            {comma(data.prev_closing_price, data.prev_closing_price)}
          </p>
        )}
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.headerText}>고가</span>
        {data && (
          <p className={`${styles.text} ${styles.red}`}>
            {comma(data.high_price, data.high_price)}
          </p>
        )}
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.headerText}>저가</span>
        {data && (
          <p className={`${styles.text} ${styles.blue}`}>
            {comma(data.low_price, data.low_price)}
          </p>
        )}
      </div>
      {/* 거래대금 */}
      <span className={styles.line}></span>
      <div className={styles.infoContainer}>
        <span className={styles.headerText}>거래대금</span>
        {data && (
          <p className={`${styles.text} ${styles.equal}`}>
            {acc(data.acc_trade_price_24h)}백만
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(OrderbookInfo);
