'use client';

import { orderbookAtom, selectedTickerAtom } from '@/store/websocket';
import { Orderbook, OrderbookUnit } from '@/types/upbit';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import styles from './orderbook.module.css';
import OrderbookItem from './OrderbookItem';
import React from 'react';

export const OrderbookClient = ({ code }: { code: string }) => {
  const newOrderbook = useAtomValue(orderbookAtom);
  const selectedTicker = useAtomValue(selectedTickerAtom)(code);

  const prevPrice = useMemo(
    () => selectedTicker?.prev_closing_price,
    [selectedTicker?.prev_closing_price],
  );

  const loading = newOrderbook?.code !== code;

  const formatOrderbookArray = (data: Orderbook) => {
    const total = data.total_ask_size + data.total_bid_size;

    const asks = data.orderbook_units
      .map(({ ask_price, ask_size }) => ({ price: ask_price, size: ask_size }))
      .sort((a, b) => b.price - a.price);

    const bids = data.orderbook_units
      .map(({ bid_price, bid_size }) => ({ price: bid_price, size: bid_size }))
      .sort((a, b) => a.price - b.price);

    const orderbook = Array.from({ length: 30 }, (_, i) => {
      if (i < 15) {
        return asks[i] || { price: 0, size: 0 };
      } else {
        const bidIndex = 29 - i;
        return bids[bidIndex] || { price: 0, size: 0 };
      }
    });

    const widths = orderbook.map((item) => (item.size / total) * 700);
    const maxOver100 = Math.max(...widths.filter((w) => w > 100), 0);
    const scalingValue = maxOver100 > 0 ? 100 / maxOver100 : 1;

    return orderbook.map((item, index) => ({
      price: item.price,
      size: item.size,
      width: Number(((widths[index] * scalingValue) / 100).toFixed(3)) || 0,
    }));
  };

  const orderbookList = useMemo(() => {
    return newOrderbook ? formatOrderbookArray(newOrderbook) : [];
  }, [newOrderbook]);

  return (
    <div className={styles.container}>
      <div className={styles.listHeaderContainer}>
        <div className={`${styles.listHeaderBox} ${styles.left}`}>
          <span className={`${styles.listHeaderText}`}>호가</span>
        </div>

        <div className={`${styles.listHeaderBox} ${styles.right}`}>
          <span className={styles.listHeaderText}>수량</span>
        </div>
      </div>
      <div className={styles.listContainer}>
        {prevPrice &&
          orderbookList.map((item, index) => (
            <OrderbookItem
              index={index}
              key={item.price}
              price={item.price}
              size={item.size}
              prevPrice={prevPrice}
              width={item.width}
            />
          ))}
      </div>
    </div>
  );
};
export default React.memo(OrderbookClient);
