import React from 'react';
import SellBuyComponent from './SellBuyComponent';
import CenterComponent from './CenterComponent';

type Type = 'buy' | 'sell';

interface Props {
  price: number;
  size: number;
  prevPrice: number;
  type: Type;
  width: number;
  code: string;
}

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
