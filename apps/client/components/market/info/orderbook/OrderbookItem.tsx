import styles from './orderbook.item.module.css';
import { comma, orderbook, plusMark, rate } from '@/utils/formatting';

interface Props {
  price: number;
  size: number;
  prevPrice: number;
  index: number;
}

const OrderbookItem = ({ price, size, prevPrice, index }: Props) => {
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

  const getColorByIndex = (index: number) => {
    if (index < 15) {
      return styles.blue;
    } else {
      return styles.red;
    }
  };

  return (
    <div className={`${styles.itemContainer}`}>
      <div className={`${styles.itemBox} ${styles.left}`}>
        <span className={`${styles.priceText} ${getColor(calc)}`}>
          {comma(price, price)}
        </span>
        <span
          className={`${styles.percentText} ${getColor(calc)} ${calc === 0 && styles.leftMargin} `}
        >
          {plusMark(calc)}
          {rate(calc)}%
        </span>
      </div>

      <div className={`${styles.itemBox} ${styles.right}`}>
        <span className={`${styles.itemText} ${getColorByIndex(index)}`}>
          {orderbook(price, size)}
        </span>
      </div>
    </div>
  );
};

export default OrderbookItem;
