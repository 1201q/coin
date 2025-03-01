export const getMaxDecimals = (num: number) => {
  if (num >= 1000) return 0;
  else if (num >= 100) return 1;
  else if (num >= 10) return 2;
  else if (num >= 1) return 3;
  else if (num >= 0.1) return 4;
  else if (num >= 0.01) return 5;
  else if (num >= 0.001) return 6;
  else if (num >= 0.0001) return 7;
  else return 8;
};

export const getStepValue = (num: number) => {
  if (num < 0.001) return 0.0000001;
  if (num < 0.01) return 0.000001;
  if (num < 0.1) return 0.00001;
  if (num < 1) return 0.0001;
  if (num < 10) return 0.001;
  if (num < 100) return 0.01;
  if (num < 1000) return 0.1;
  if (num < 10000) return 1;
  if (num < 100000) return 10;
  if (num < 500000) return 50;
  if (num < 1000000) return 100;
  if (num < 2000000) return 500;
  return 1000;
};

export const getFixedDecimalsPrice = (price: number): number => {
  if (price === 0) return 0;
  if (price < 0.001) return 7;
  if (price < 0.01) return 6;
  if (price < 0.1) return 5;
  if (price < 1) return 4;
  if (price < 10) return 3;
  if (price < 100) return 2;
  if (price < 1000) return 1;
  if (price < 10000) return 0;
  return 0;
};

export const formatPrice = (price: number) => {
  if (price === 0) return '0';
  if (price >= 10000) {
    return (Math.round(price / 10) * 10).toString();
  }
  const decimals = getFixedDecimalsPrice(price);
  return price.toFixed(decimals);
};

export const getRoundDecimals = (num: number) => {
  return num >= 10 ? 3 : getMaxDecimals(num);
};

export const roundValue = (val: number) => {
  if (val >= 10000) {
    const step = getStepValue(val);
    return Math.round(val / step) * step;
  } else {
    const decimals = getRoundDecimals(val);
    return parseFloat(val.toFixed(decimals));
  }
};
