'use client';

import { orderbookAtom, selectedTickerAtom } from '@/store/websocket';
import { Orderbook } from '@/types/upbit';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import styles from './orderbook.module.css';

import React from 'react';

import OrderbookRow from './OrderbookRow';
import OrderbookInfo from './OrderbookInfo';

export const OrderbookClient = ({ code }: { code: string }) => {
  const newOrderbook = useAtomValue(orderbookAtom);
  const selectedTicker = useAtomValue(selectedTickerAtom)(code);

  const prevPrice = useMemo(
    () => selectedTicker?.prev_closing_price,
    [selectedTicker?.prev_closing_price],
  );

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
      width: Number((widths[index] * scalingValue).toFixed(2)) || 0,
    }));
  };

  const orderbookList = useMemo(() => {
    return newOrderbook ? formatOrderbookArray(newOrderbook) : [];
  }, [newOrderbook]);

  return (
    <div className={styles.container}>
      {/* <div className={styles.listHeaderContainer}>
        <div className={`${styles.listHeaderBox} ${styles.left}`}>
          <span className={`${styles.listHeaderText}`}>호가</span>
        </div>

        <div className={`${styles.listHeaderBox} ${styles.right}`}>
          <span className={styles.listHeaderText}>수량</span>
        </div>
      </div> */}
      <div className={styles.listContainer}>
        <div className={styles.sellContainer}>
          {prevPrice &&
            orderbookList
              .slice(0, 15)
              .map((item) => (
                <OrderbookRow
                  type={'sell'}
                  key={item.price}
                  price={item.price}
                  size={item.size}
                  prevPrice={prevPrice}
                  width={item.width}
                  code={code}
                />
              ))}
        </div>
        <div className={styles.infoContainer}>
          {prevPrice && orderbookList && <OrderbookInfo code={code} />}
        </div>
        <div className={styles.centerContainer}></div>
        <div className={styles.buyContainer}>
          {prevPrice &&
            orderbookList
              .slice(15, 30)
              .map((item) => (
                <OrderbookRow
                  type={'buy'}
                  key={item.price}
                  price={item.price}
                  size={item.size}
                  prevPrice={prevPrice}
                  width={item.width}
                  code={code}
                />
              ))}
        </div>
      </div>
    </div>
  );
};
export default React.memo(OrderbookClient);
