'use client';

import React, { useEffect, useState } from 'react';
import { TradeData } from '@/types/upbit';
import styles from './trade.module.css';

import { useAtom, useAtomValue } from 'jotai';
import { hydratedTradeAtom, tradeAtom } from '@/store/websocket';

import { comma } from '@/utils/formatting';
import dayjs from 'dayjs';
import { useHydrateAtoms } from 'jotai/utils';

export default function TradeClient({
  data,
  code,
}: {
  data: TradeData[];
  code: string;
}) {
  useHydrateAtoms([[hydratedTradeAtom, data]], {
    dangerouslyForceHydrate: true,
  });

  const hydratedData = useAtomValue(hydratedTradeAtom, { delay: 0 });
  const [tradeData, setTradeData] = useAtom(tradeAtom);

  useEffect(() => {
    if (tradeData.length === 0 || tradeData[0].code !== hydratedData[0].code) {
      setTradeData(hydratedData);
    }
  }, [hydratedData, tradeData, setTradeData]);

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
        {tradeData?.map((item, index) => (
          <div
            className={styles.itemContainer}
            key={`${item.timestamp}-${index}`}
          >
            <div className={`${styles.itemBox} ${styles.left} `}>
              <span
                className={`${styles.numberText} ${getColor(item.trade_price - item.prev_closing_price)}`}
              >
                {comma(item.trade_price, item.trade_price)}
              </span>
            </div>
            <div className={`${styles.itemBox} ${styles.center} `}>
              <span
                className={`${styles.numberText} ${getAskBidColor(item.ask_bid)} `}
              >
                {/* {Number(
                  (item.trade_volume * item.trade_price).toFixed(),
                ).toLocaleString()} */}
                {item.trade_volume.toFixed(6)}
              </span>
            </div>
            <div className={`${styles.itemBox}  ${styles.right} `}>
              <span className={`${styles.timeText}`}>
                {dayjs(item.timestamp).format('HH:mm:ss')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
