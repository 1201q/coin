'use client';

import { rate, acc, comma, signedComma } from '@/utils/formatting';
import styles from './search.dialog.module.css';
import Image from 'next/image';
import React from 'react';

interface Props {
  market: string;
  accTradePrice: number;
  tradePrice: number;
  changePrice: number;
  changeRate: number;
}

const SearchDialogItem = ({
  market,
  accTradePrice,
  tradePrice,
  changePrice,
  changeRate,
}: Props) => {
  const code = market.split('-')[1];

  return (
    <div className={styles.listContainer}>
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
      <div className={styles.listBox}>
        <span className={styles.text}>{comma(tradePrice, tradePrice)}</span>
      </div>
      <div className={styles.listBox}>
        <div className={`${styles.flex}  ${styles.right}`}>
          <span className={styles.text}>{rate(changeRate)}%</span>
          <span className={`${styles.text} ${styles.small} ${styles.thin}`}>
            {signedComma(tradePrice, changePrice)}
          </span>
        </div>
      </div>
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
