import React from 'react';
import styles from './orderbook.row.module.css';
import { comma, plusMark, rate } from '@/utils/formatting';
import { useCoin } from '@/store/utils';
import { useSetAtom } from 'jotai';
import { selectedPriceAtom } from '@/store/user';

interface Props {
  price: number;
  code: string;
  prevPrice: number;
}

const CenterComponent = ({ price, prevPrice, code }: Props) => {
  const calc = (price - prevPrice) / prevPrice;
  const data = useCoin(code);

  const setSelectedPrice = useSetAtom(selectedPriceAtom);

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
      <button
        onClick={() => setSelectedPrice(price)}
        className={`${styles.currentPriceContainer} ${price === data?.trade_price && styles.currentPrice}`}
      >
        <span className={`${styles.priceText} ${getColor(calc)}`}>
          {comma(price, price)}
        </span>
        <span className={`${styles.percentText}`}>
          {plusMark(calc)}
          {rate(calc)}%
        </span>
      </button>
    </div>
  );
};

export default React.memo(CenterComponent);
