export const UPBIT_CANDLE_UNIT = [1, 3, 5, 15, 10, 30, 60, 240] as const;
export const UPBIT_CANDLE_TYPE = [
  "seconds",
  "minutes",
  "days",
  "weeks",
  "months",
  "years",
] as const;
export const UPBIT_MARKET_TYPE = ["KRW", "USDT", "BTC"] as const;

export const INIT_WALLET_BALANCE = 30000000; // 3000만원
