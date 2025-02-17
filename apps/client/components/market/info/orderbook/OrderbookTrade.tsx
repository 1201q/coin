'use client';

import styles from './orderbook.trade.module.css';
import React from 'react';

import { comma, orderbook } from '@/utils/formatting';
import { useAtomValue } from 'jotai';
import { tradeAtom } from '@/store/websocket';

interface TradeItemProps {
  price: number;
  volume: number;
  askbid: 'ASK' | 'BID';
  prevPrice: number;
}
const TradeItem = ({ price, volume, askbid, prevPrice }: TradeItemProps) => {
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
      <p className={`${styles.priceText} ${getColor(price - prevPrice)}`}>
        {comma(price, price)}
      </p>
      <p className={`${styles.sizeText} ${getAskBidColor(askbid)}`}>
        {orderbook(price, volume)}
      </p>
    </div>
  );
};

const OrderbookTrade = ({ code }: { code: string }) => {
  const tradeData = useAtomValue(tradeAtom);
  return (
    <div className={styles.container}>
      {tradeData[tradeData.length - 1].code === code &&
        tradeData
          .slice(0, 10)
          ?.map((item) => (
            <TradeItem
              key={`${code}/${item.sequential_id}/${item.trade_volume}`}
              price={item.trade_price}
              volume={item.trade_volume}
              askbid={item.ask_bid}
              prevPrice={item.prev_closing_price}
            />
          ))}
    </div>
  );
};

export default React.memo(OrderbookTrade);
