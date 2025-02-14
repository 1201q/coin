export const rate = (value: number) => {
  return (value * 100).toFixed(2);
};

export const acc = (value: number) => {
  return Number((value / 1000000).toFixed()).toLocaleString();
};

export const comma = (value: number, target: number) => {
  const test = value === target;
  const comparisonValue = test ? target : value;

  if (comparisonValue >= 1000) {
    return target.toLocaleString();
  } else if (comparisonValue >= 100) {
    return target.toFixed(1);
  } else if (comparisonValue >= 10) {
    return target.toFixed(2);
  } else if (comparisonValue >= 1) {
    return target.toFixed(3);
  } else if (comparisonValue >= 0.1) {
    return target.toFixed(4);
  } else if (comparisonValue >= 0.01) {
    return target.toFixed(5);
  } else if (comparisonValue >= 0.001) {
    return target.toFixed(6);
  } else if (comparisonValue >= 0.0001) {
    return target.toFixed(7);
  } else {
    return target.toFixed(8);
  }
};

export const signedComma = (tradePrice: number, target: number) => {
  const isMinus = target < 0;
  const absValue = Math.abs(target);

  return isMinus
    ? `-${comma(tradePrice, absValue)}`
    : comma(tradePrice, absValue);
};

export const orderbook = (value: number, target: number) => {
  if (value < 10) {
    return Number(target.toFixed()).toLocaleString();
  } else {
    return target.toFixed(3);
  }
};

export const plusMark = (changeRate: number) => {
  return changeRate > 0 ? '+' : ' ';
};
