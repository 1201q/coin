import React, { useEffect, useRef, useState } from 'react';
import styles from './orderbook.row.module.css';
import { orderbook } from '@/utils/formatting';

type Type = 'buy' | 'sell';

interface Props {
  price: number;
  size: number;

  type: Type;
  width: number;
}

const SellBuyComponent = ({ type, width, price, size }: Props) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const sizeRef = useRef(size);

  useEffect(() => {
    if (sizeRef.current !== size) {
      setIsHighlighted(true);
      const timeout = setTimeout(() => {
        setIsHighlighted(false);
      }, 250);
      sizeRef.current = size;

      return () => clearTimeout(timeout);
    }
  }, [size]);

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
        className={`${styles.bar} ${getBarColorByIndex(type)} ${isHighlighted ? styles.highlight : ''}`}
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

export default React.memo(SellBuyComponent);
