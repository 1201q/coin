'use client';

import React, { useEffect, useState } from 'react';
import { convertTradeData, TradeData, TradeSnapshot } from '@/types/upbit';
import styles from './trade.module.css';
import dayjs from 'dayjs';
import { comma } from '@/utils/formatting';
import { useAtom, useAtomValue } from 'jotai';
import { joinedRoomAtom, tradeAtom, tradeDataAtom } from '@/store/websocket';
import { useHydrateAtoms } from 'jotai/utils';

export default function TradeClient({ data }: { data: TradeData[] }) {
  useHydrateAtoms([[tradeDataAtom, data]], { dangerouslyForceHydrate: true });

  const tradeData = useAtomValue(tradeDataAtom, { delay: 0 });

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

  console.log(data[0]);
  console.log(tradeData[0]);

  return (
    // <div className={styles.container}>
    //   <div className={styles.listHeaderContainer}>
    //     <div className={`${styles.listHeaderBox} ${styles.left}`}>
    //       <span className={`${styles.listHeaderText}`}>체결가</span>
    //     </div>
    //     <div className={`${styles.listHeaderBox} ${styles.center}`}>
    //       <span className={styles.listHeaderText}>체결량</span>
    //     </div>
    //     <div className={`${styles.listHeaderBox} ${styles.right}`}>
    //       <span className={styles.listHeaderText}>체결시간</span>
    //     </div>
    //   </div>
    //   <div className={styles.listContainer}>
    //     {[]?.map((item, index) => (
    //       <div
    //         className={styles.itemContainer}
    //         key={`${item.timestamp}-${index}`}
    //       >
    //         <div className={`${styles.itemBox} ${styles.left} `}>
    //           <span
    //             className={`${styles.numberText} ${getColor(item.trade_price - item.prev_closing_price)}`}
    //           >
    //             {comma(item.trade_price, item.trade_price)}
    //           </span>
    //         </div>
    //         <div className={`${styles.itemBox} ${styles.center} `}>
    //           <span
    //             className={`${styles.numberText} ${getAskBidColor(item.ask_bid)} `}
    //           >
    //             {/* {Number(
    //               (item.trade_volume * item.trade_price).toFixed(),
    //             ).toLocaleString()} */}
    //             {item.trade_volume.toFixed(6)}
    //           </span>
    //         </div>
    //         <div className={`${styles.itemBox}  ${styles.right} `}>
    //           <span className={`${styles.timeText}`}>
    //             {dayjs(item.timestamp).format('HH:mm:ss')}
    //           </span>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <></>
  );
}
