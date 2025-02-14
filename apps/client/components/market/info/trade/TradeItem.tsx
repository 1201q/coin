'use client';

import React from 'react';

import styles from './trade.item.module.css';

import { comma } from '@/utils/formatting';
import dayjs from 'dayjs';

interface Props {
  price: number;
  prevPrice: number;
  volume: number;
  timestamp: number;
  askbid: 'ASK' | 'BID';
}

const TradeItem = ({ price, volume, timestamp, prevPrice, askbid }: Props) => {
  const getColor = (signedChangePrice: number) => {
    if (signedChangePrice > 0) {
      return styles.red;
    } else if (signedChangePrice < 0) {
      return styles.blue;
    } else {
      return styles.equal;
    }
  };

  const getAskBidColor = (askBid: 'ASK' | 'BID') => {
    if (askBid === 'ASK') {
      return styles.blue;
    } else {
      return styles.red;
    }
  };

  return (
    <div className={styles.itemContainer}>
      <div className={`${styles.itemBox} ${styles.left} `}>
        <span className={`${styles.numberText} ${getColor(price - prevPrice)}`}>
          {comma(price, price)}
        </span>
      </div>
      <div className={`${styles.itemBox} ${styles.center} `}>
        <span className={`${styles.numberText} ${getAskBidColor(askbid)} `}>
          {volume.toFixed(6)}
        </span>
      </div>
      <div className={`${styles.itemBox}  ${styles.right} `}>
        <span className={`${styles.timeText}`}>
          {dayjs(timestamp).format('HH:mm:ss')}
        </span>
      </div>
    </div>
  );
};

export default React.memo(TradeItem);
