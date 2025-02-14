export const UPBIT_CANDLE_UNIT = [1, 3, 5, 15, 10, 30, 60, 240] as const;
export const UPBIT_CANDLE_TYPE = [
  'seconds',
  'minutes',
  'days',
  'weeks',
  'months',
  'years',
] as const;
export const UPBIT_MARKET_TYPE = ['KRW', 'USDT', 'BTC'] as const;

export interface MarketInfo {
  market: string;
  korean_name: string;
  english_name: string;
}

export interface CandleData {
  market: string;
  candle_date_time_utc: string;
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  first_day_of_period?: string;
  unit?: CandleUnit;
}

export type MarketType = (typeof UPBIT_MARKET_TYPE)[number];
export type CandleType = (typeof UPBIT_CANDLE_TYPE)[number];
export type CandleUnit = (typeof UPBIT_CANDLE_UNIT)[number];

export type TickerData = {
  code: string; // code, market
  opening_price: number; // 시가
  high_price: number; // 고가
  low_price: number; // 저가
  trade_price: number; // 현재가
  change: 'RISE' | 'EVEN' | 'FALL'; // 전일 대비
  signed_change_price: number; // 부호 포함 전일 대비 금액
  signed_change_rate: number; // 부호 포함 전일 대비 비율
  acc_trade_volume_24h: number; // 24시간 누적 거래량
  acc_trade_price_24h: number; // 24시간 누적 거래대금
  timestamp: number; // 데이터 생성 타임스탬프 (milliseconds)
  prev_closing_price: number;
};

export const convertTickerData = (
  data: Ticker | TickerSnapshot,
): TickerData => {
  if ('code' in data) {
    // Ticker
    return {
      code: data.code,
      opening_price: data.opening_price,
      high_price: data.high_price,
      low_price: data.low_price,
      trade_price: data.trade_price,
      change: data.change,
      signed_change_price: data.signed_change_price,
      signed_change_rate: data.signed_change_rate,
      acc_trade_volume_24h: data.acc_trade_volume_24h,
      acc_trade_price_24h: data.acc_trade_price_24h,
      timestamp: data.timestamp,
      prev_closing_price: data.prev_closing_price,
    };
  } else {
    // tickersnapshot market => code
    return {
      code: data.market,
      opening_price: data.opening_price,
      high_price: data.high_price,
      low_price: data.low_price,
      trade_price: data.trade_price,
      change: data.change,
      signed_change_price: data.signed_change_price,
      signed_change_rate: data.signed_change_rate,
      acc_trade_volume_24h: data.acc_trade_volume_24h,
      acc_trade_price_24h: data.acc_trade_price_24h,
      timestamp: data.timestamp,
      prev_closing_price: data.prev_closing_price,
    };
  }
};

export type TickerSnapshot = {
  market: string; // 마켓 코드 (ex. KRW-BTC)
  trade_date: string; // 최근 거래 일자 (UTC) yyyyMMdd
  trade_time: string; // 최근 거래 시각 (UTC) HHmmss
  trade_date_kst: string; // 최근 거래 일자 (KST) yyyyMMdd
  trade_time_kst: string; // 최근 거래 시각 (KST) HHmmss
  trade_timestamp: number; // 체결 타임스탬프 (milliseconds)
  opening_price: number; // 시가
  high_price: number; // 고가
  low_price: number; // 저가
  trade_price: number; // 현재가
  prev_closing_price: number; // 전일 종가
  change: 'RISE' | 'EVEN' | 'FALL'; // 전일 대비 상태
  change_price: number; // 전일 대비 금액
  change_rate: number; // 전일 대비 비율
  signed_change_price: number; // 부호 포함 전일 대비 금액
  signed_change_rate: number; // 부호 포함 전일 대비 비율
  trade_volume: number; // 최근 거래량
  acc_trade_price: number; // 누적 거래대금 (UTC 0시 기준)
  acc_trade_price_24h: number; // 24시간 누적 거래대금
  acc_trade_volume: number; // 누적 거래량 (UTC 0시 기준)
  acc_trade_volume_24h: number; // 24시간 누적 거래량
  highest_52_week_price: number; // 52주 최고가
  highest_52_week_date: string; // 52주 최고가 달성일 yyyy-MM-dd
  lowest_52_week_price: number; // 52주 최저가
  lowest_52_week_date: string; // 52주 최저가 달성일 yyyy-MM-dd
  timestamp: number; // 데이터 생성 타임스탬프 (milliseconds)
};

export type Ticker = {
  type: string; // ticker: 현재가
  code: string; // 마켓 코드 (ex. KRW-BTC)
  opening_price: number; // 시가
  high_price: number; // 고가
  low_price: number; // 저가
  trade_price: number; // 현재가
  prev_closing_price: number; // 전일 종가
  change: 'RISE' | 'EVEN' | 'FALL'; // 전일 대비
  change_price: number; // 부호 없는 전일 대비 값
  signed_change_price: number; // 전일 대비 값
  change_rate: number; // 부호 없는 전일 대비 등락율
  signed_change_rate: number; // 전일 대비 등락율
  trade_volume: number; // 가장 최근 거래량
  acc_trade_volume: number; // 누적 거래량(UTC 0시 기준)
  acc_trade_volume_24h: number; // 24시간 누적 거래량
  acc_trade_price: number; // 누적 거래대금(UTC 0시 기준)
  acc_trade_price_24h: number; // 24시간 누적 거래대금
  trade_date: string; // 최근 거래 일자(UTC) yyyyMMdd
  trade_time: string; // 최근 거래 시각(UTC) HHmmss
  trade_timestamp: number; // 체결 타임스탬프 (milliseconds)
  ask_bid: 'ASK' | 'BID'; // 매수/매도 구분
  acc_ask_volume: number; // 누적 매도량
  acc_bid_volume: number; // 누적 매수량
  highest_52_week_price: number; // 52주 최고가
  highest_52_week_date: string; // 52주 최고가 달성일 yyyy-MM-dd
  lowest_52_week_price: number; // 52주 최저가
  lowest_52_week_date: string; // 52주 최저가 달성일 yyyy-MM-dd
  market_state: 'PREVIEW' | 'ACTIVE' | 'DELISTED'; // 거래상태
  is_trading_suspended?: boolean; // 거래 정지 여부 (*Deprecated)
  delisting_date?: string | null; // 거래지원 종료일
  market_warning: 'NONE' | 'CAUTION'; // 유의 종목 여부
  timestamp: number; // 타임스탬프 (millisecond)
  stream_type: 'SNAPSHOT' | 'REALTIME'; // 스트림 타입
};

export type TradeSnapshot = {
  market: string;
  trade_date_utc: string;
  trade_time_utc: string;
  timestamp: number;
  trade_price: number;
  trade_volume: number;
  prev_closing_price: number;
  change_price: number;
  ask_bid: 'ASK' | 'BID'; // 매수/매도 구분 (ASK: 매도, BID: 매수)
  sequential_id: number;
};

export interface Trade {
  type: string; // 체결 타입 (trade : 체결)
  code: string; // 마켓 코드 (ex. KRW-BTC)
  trade_price: number; // 체결 가격
  trade_volume: number; // 체결량
  ask_bid: 'ASK' | 'BID'; // 매수/매도 구분 (ASK: 매도, BID: 매수)
  prev_closing_price: number; // 전일 종가
  change: 'RISE' | 'EVEN' | 'FALL'; // 전일 대비 (RISE: 상승, EVEN: 보합, FALL: 하락)
  change_price: number; // 부호 없는 전일 대비 값
  trade_date: string; // 체결 일자 (UTC 기준) (yyyy-MM-dd)
  trade_time: string; // 체결 시각 (UTC 기준) (HH:mm:ss)
  trade_timestamp: number; // 체결 타임스탬프 (millisecond)
  timestamp: number; // 타임스탬프 (millisecond)
  sequential_id: number; // 체결 번호 (Unique)
  best_ask_price: number; // 최우선 매도 호가
  best_ask_size: number; // 최우선 매도 잔량
  best_bid_price: number; // 최우선 매수 호가
  best_bid_size: number; // 최우선 매수 잔량
  stream_type: 'SNAPSHOT' | 'REALTIME'; // 스트림 타입 (SNAPSHOT: 스냅샷, REALTIME: 실시간)
}

export type TradeData = {
  code: string;
  timestamp: number;
  sequential_id: number;
  trade_price: number;
  trade_volume: number;
  prev_closing_price: number;
  ask_bid: 'ASK' | 'BID';
};

export const convertTradeData = (data: Trade | TradeSnapshot): TradeData => {
  if ('code' in data) {
    // Trade
    return {
      code: data.code,
      timestamp: data.timestamp,
      sequential_id: data.sequential_id,
      trade_price: data.trade_price,
      trade_volume: data.trade_volume,
      prev_closing_price: data.prev_closing_price,
      ask_bid: data.ask_bid,
    };
  } else {
    // TradeSnapshot
    return {
      code: data.market,
      timestamp: data.timestamp,
      sequential_id: data.sequential_id,
      trade_price: data.trade_price,
      trade_volume: data.trade_volume,
      prev_closing_price: data.prev_closing_price,
      ask_bid: data.ask_bid,
    };
  }
};

export interface Orderbook {
  market?: string;
  type: string; // 호가 타입 (orderbook : 호가)
  code: string; // 마켓 코드 (ex. KRW-BTC)
  total_ask_size: number; // 호가 매도 총 잔량
  total_bid_size: number; // 호가 매수 총 잔량
  orderbook_units: OrderbookUnit[]; // 호가 상세 정보 리스트
  timestamp: number; // 타임스탬프 (millisecond)
  level: number; // 호가 모아보기 단위
  stream_type?: 'SNAPSHOT' | 'REALTIME'; // 스트림 타입 (SNAPSHOT: 스냅샷, REALTIME: 실시간)
}

export interface OrderbookUnit {
  ask_price: number; // 매도 호가
  bid_price: number; // 매수 호가
  ask_size: number; // 매도 잔량
  bid_size: number; // 매수 잔량
}
