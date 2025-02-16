import React from 'react';
import styles from './orderbook.row.module.css';
import { comma, orderbook, plusMark, rate } from '@/utils/formatting';

type Type = 'buy' | 'sell';

interface Props {
  price: number;
  size: number;
  prevPrice: number;
  type: Type;
  width: number;
}

interface CenterProps {
  price: number;
  size: number;

  type: Type;
  width: number;
}

interface SellBuyProps {
  price: number;

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
          transform: `scaleX(${width}) translateZ(0px)`,
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

const CenterComponent = ({ price, prevPrice }: SellBuyProps) => {
  const calc = (price - prevPrice) / prevPrice;
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
    <div className={styles.centerContainer}>
      <span className={`${styles.priceText} ${getColor(calc)}`}>
        {comma(price, price)}
      </span>
      <span className={`${styles.percentText} ${getColor(calc)}`}>
        {plusMark(calc)}
        {rate(calc)}%
      </span>
    </div>
  );
};

const OrderbookRow = ({ price, prevPrice, type, width, size }: Props) => {
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
          <CenterComponent price={price} prevPrice={prevPrice} />
        </>
      ) : (
        <>
          <CenterComponent price={price} prevPrice={prevPrice} />
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
