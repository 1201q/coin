'use client';

import React from 'react';
import styles from './trade.module.css';
import { useAtomValue } from 'jotai';
import { tradeAtom } from '@/store/websocket';
import TradeItem from './TradeItem';

const TradeClient = ({ code }: { code: string }) => {
  const tradeData = useAtomValue(tradeAtom);

  return (
    <div className={styles.container}>
      <div className={styles.listHeaderContainer}>
        <div className={`${styles.listHeaderBox} ${styles.left}`}>
          <span className={`${styles.listHeaderText}`}>체결가</span>
        </div>
        <div className={`${styles.listHeaderBox} ${styles.center}`}>
          <span className={styles.listHeaderText}>체결량</span>
        </div>
        <div className={`${styles.listHeaderBox} ${styles.right}`}>
          <span className={styles.listHeaderText}>체결시간</span>
        </div>
      </div>
      <div className={styles.listContainer}>
        {tradeData[tradeData.length - 1].code === code &&
          tradeData?.map((item) => (
            <TradeItem
              key={`${code}/${item.sequential_id}/${item.trade_volume}`}
              price={item.trade_price}
              volume={item.trade_volume}
              timestamp={item.timestamp}
              prevPrice={item.prev_closing_price}
              askbid={item.ask_bid}
            />
          ))}
      </div>
    </div>
  );
};
export default TradeClient;
