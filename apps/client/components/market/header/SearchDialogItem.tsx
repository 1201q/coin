'use client';

import { rate, acc, comma, signedComma, plusMark } from '@/utils/formatting';
import styles from './search.dialog.module.css';
import Image from 'next/image';
import React from 'react';

interface Props {
  market: string;
  accTradePrice: number;
  tradePrice: number;
  changePrice: number;
  changeRate: number;
  change: 'RISE' | 'EVEN' | 'FALL';
}

const SearchDialogItem = ({
  market,
  accTradePrice,
  tradePrice,
  changePrice,
  changeRate,
}: Props) => {
  const code = market.split('-')[1];

  const getColor = (changeRate: number) => {
    if (changeRate > 0) {
      return styles.red;
    } else if (changeRate < 0) {
      return styles.blue;
    } else {
      return styles.equal;
    }
  };

  return (
    <div className={styles.listContainer}>
      {/* 코인명 */}
      <div className={`${styles.listBox} ${styles.left}`}>
        <Image
          src={`https://static.upbit.com/logos/${code}.png`}
          width={19}
          height={19}
          alt="logo"
        />
        <div className={styles.flex}>
          <span className={styles.text}>{market}</span>
        </div>
      </div>
      {/* 현재가 */}
      <div className={styles.listBox}>
        <span className={`${styles.text} ${getColor(changeRate)}`}>
          {comma(tradePrice, tradePrice)}
        </span>
      </div>
      {/* 어제보디 */}
      <div className={styles.listBox}>
        <div className={`${styles.flex}  ${styles.right} `}>
          <span className={`${styles.text} ${getColor(changeRate)}`}>
            {plusMark(changeRate)}
            {rate(changeRate)}%
          </span>
          <span
            className={`${styles.text} ${styles.small} ${styles.thin} ${getColor(changeRate)}`}
          >
            {plusMark(changeRate)}
            {signedComma(tradePrice, changePrice)}
          </span>
        </div>
      </div>
      {/* 거래대금 */}
      <div className={styles.listBox}>
        <div className={`${styles.flex} ${styles.right}`}>
          <span className={styles.text}>{acc(accTradePrice)}</span>
          <span
            className={`${styles.text} ${styles.small} ${styles.thin} ${styles.equal}`}
          >
            백만
          </span>
        </div>
      </div>
    </div>
  );
};
export default SearchDialogItem;
