const million = 1000000;

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
  } else if (comparisonValue >= 0.00001) {
    return target.toFixed(8);
  } else {
    return '0';
  }
};

export const chartComma = (value: number) => {
  return comma(value, value);
};

export const chartMinMove = (value: number) => {
  if (value >= 10000) {
    return 1;
  } else if (value >= 1000) {
    return 0.1;
  } else if (value >= 100) {
    return 0.01;
  } else if (value >= 10) {
    return 0.001;
  } else if (value >= 1) {
    return 0.0001;
  } else if (value >= 0.1) {
    return 0.00001;
  } else if (value >= 0.01) {
    return 0.000001;
  } else {
    return 0.0000001;
  }
};

export const chartVolume = (value: number) => {
  const raw = value * million;

  if (raw >= 1e12) {
    return (raw / 1e12).toFixed(2) + 'T';
  } else if (raw >= 1e9) {
    return (raw / 1e9).toFixed(2) + 'B';
  } else if (raw >= 1e6) {
    return (raw / 1e6).toFixed(2) + 'M';
  } else if (raw >= 1e3) {
    return (raw / 1e3).toFixed(2) + 'K';
  }

  return raw.toFixed(3);
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
    const fixed = target.toFixed(3);
    const [front, back] = fixed.split('.');
    return `${Number(front).toLocaleString()}.${back}`;
  }
};

export const plusMark = (changeRate: number) => {
  return changeRate > 0 ? '+' : ' ';
};
