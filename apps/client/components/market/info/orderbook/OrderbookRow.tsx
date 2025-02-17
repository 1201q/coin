import React from 'react';
import styles from './orderbook.row.module.css';
import { comma, orderbook, plusMark, rate } from '@/utils/formatting';
import { useCoin } from '@/store/utils';

type Type = 'buy' | 'sell';

interface Props {
  price: number;
  size: number;
  prevPrice: number;
  type: Type;
  width: number;
  code: string;
}

interface CenterProps {
  price: number;
  size: number;

  type: Type;
  width: number;
}

interface SellBuyProps {
  price: number;
  code: string;
  prevPrice: number;
}

const SellBuyComponent = ({ type, width, price, size }: CenterProps) => {
  const getBarColorByIndex = (type: Type) => {
    if (type === 'sell') {
      return styles.bluebar;
    } else {
      return styles.redbar;
    }
  };

  const getColorByIndex = (type: Type) => {
    if (type === 'sell') {
      return styles.blue;
    } else {
      return styles.red;
    }
  };

  return (
    <div
      className={type === 'sell' ? styles.sellContainer : styles.buyContainer}
    >
      <div
        className={`${styles.bar} ${getBarColorByIndex(type)}`}
        style={{
          transform: `translateX(${type === 'buy' ? -1 * (100 - width) : 100 - width}%) translateZ(0px)`,
        }}
      ></div>
      <span
        className={`${styles.sizeText} ${getColorByIndex(type)} ${type === 'sell' ? styles.right : styles.left}`}
      >
        {orderbook(price, size)}
      </span>
    </div>
  );
};

const CenterComponent = ({ price, prevPrice, code }: SellBuyProps) => {
  const calc = (price - prevPrice) / prevPrice;
  const data = useCoin(code);

  const getColor = (calc: number) => {
    if (calc > 0) {
      return styles.red;
    } else if (calc < 0) {
      return styles.blue;
    } else {
      return styles.equal;
    }
  };

  return (
    <div className={`${styles.centerContainer}`}>
      <div
        className={`${styles.currentPriceContainer} ${price === data?.trade_price && styles.currentPrice}`}
      >
        <span className={`${styles.priceText} ${getColor(calc)}`}>
          {comma(price, price)}
        </span>
        <span className={`${styles.percentText} `}>
          {plusMark(calc)}
          {rate(calc)}%
        </span>
      </div>
    </div>
  );
};

const OrderbookRow = ({ price, prevPrice, type, width, size, code }: Props) => {
  return (
    <>
      {type === 'sell' ? (
        <>
          <SellBuyComponent
            price={price}
            size={size}
            type={type}
            width={width}
          />
          <CenterComponent price={price} prevPrice={prevPrice} code={code} />
        </>
      ) : (
        <>
          <CenterComponent price={price} prevPrice={prevPrice} code={code} />
          <SellBuyComponent
            price={price}
            size={size}
            type={type}
            width={width}
          />
        </>
      )}
    </>
  );
};

export default React.memo(OrderbookRow);
