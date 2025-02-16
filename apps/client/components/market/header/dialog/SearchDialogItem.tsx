'use client';

import { rate, acc, comma, signedComma, plusMark } from '@/utils/formatting';
import styles from './search.dialog.item.module.css';
import Image from 'next/image';
import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { marketAtom } from '@/store/atom';
import Link from 'next/link';
import { isSearchDialogOpenAtom } from '@/store/ui';

interface Props {
  market: string;
  accTradePrice: number;
  tradePrice: number;
  changeRate: number;
}

const SearchDialogItem = ({
  market,
  accTradePrice,
  tradePrice,
  changeRate,
}: Props) => {
  const code = market.split('-')[1];
  const setIsDialogOpen = useSetAtom(isSearchDialogOpenAtom);
  const getMarket = useAtomValue(marketAtom);

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
    <Link
      href={`/market/${market}`}
      onClick={() => {
        setIsDialogOpen(false);
      }}
      className={styles.listContainer}
    >
      {/* 코인명 */}
      <div className={`${styles.listBox} ${styles.left}`}>
        <div className={styles.logoBox}>
          <Image
            src={`https://static.upbit.com/logos/${code}.png`}
            width={19}
            height={19}
            alt={`${code}-logo`}
            style={{ width: 19, height: 19 }}
          />
        </div>
        <div className={styles.flex}>
          <span className={styles.text}>
            {getMarket(market)?.korean_name || ''}
          </span>
          <span
            className={`${styles.text} ${styles.small} ${styles.thin} ${styles.equal}`}
            style={{ marginLeft: '0.5px' }}
          >
            {code}
          </span>
        </div>
      </div>
      {/* 현재가 */}
      <div className={styles.listBox}>
        <span
          className={`${styles.text} ${getColor(changeRate)} ${styles.number}`}
        >
          {comma(tradePrice, tradePrice)}
        </span>
      </div>
      {/* 어제보디 */}
      <div className={styles.listBox}>
        <span
          className={`${styles.text}  ${styles.number} ${getColor(changeRate)}`}
        >
          {plusMark(changeRate)}
          {rate(changeRate)}%
        </span>
      </div>
      {/* 거래대금 */}
      <div className={styles.listBox}>
        <div className={`${styles.flex} ${styles.right}`}>
          <span className={`${styles.text}  ${styles.number}`}>
            {acc(accTradePrice)}
          </span>
          <span
            className={`${styles.text} ${styles.small} ${styles.thin} ${styles.equal}`}
          >
            백만
          </span>
        </div>
      </div>
    </Link>
  );
};
export default React.memo(SearchDialogItem);
