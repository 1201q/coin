'use client';

import { joinedRoomAtom, orderbookAtom } from '@/store/websocket';
import { Orderbook, OrderbookUnit } from '@/types/upbit';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import styles from './orderbook.module.css';

export default function OrderbookClient({ data }: { data: Orderbook }) {
  const newOrderbook = useAtomValue(orderbookAtom);
  const room = useAtomValue(joinedRoomAtom);

  // useEffect(() => {
  //   console.log(room);
  // }, [room]);

  const formatOrderbookArray = (units: OrderbookUnit[]) => {
    const asks = units
      .map(({ ask_price, ask_size }) => ({ price: ask_price, size: ask_size }))
      .sort((a, b) => b.price - a.price);

    const bids = units
      .map(({ bid_price, bid_size }) => ({ price: bid_price, size: bid_size }))
      .sort((a, b) => a.price - b.price);

    return Array.from({ length: 30 }, (_, i) => {
      if (i < 15) {
        return { price: asks[i]?.price, size: asks[i]?.size };
      } else {
        const index = 29 - i;
        return { price: bids[index]?.price, size: bids[index]?.size };
      }
    });
  };

  const orderbookList = useMemo(() => {
    return newOrderbook?.orderbook_units
      ? formatOrderbookArray(newOrderbook?.orderbook_units)
      : [];
  }, [newOrderbook?.orderbook_units]);

  return (
    <div className={styles.container}>
      <div className={styles.listHeaderContainer}>
        <div className={`${styles.listHeaderBox} ${styles.left}`}>
          <span className={`${styles.listHeaderText}`}>호가</span>
        </div>
        <div className={`${styles.listHeaderBox} ${styles.center}`}>
          <span className={styles.listHeaderText}>수량</span>
        </div>
        <div className={`${styles.listHeaderBox} ${styles.right}`}>
          <span className={styles.listHeaderText}></span>
        </div>
      </div>
      <div className={styles.listContainer}></div>
    </div>
  );
}
