export interface MarketData {
  market: string;
  korean_name: string;
  english_name: string;
}

interface TradeData {
  trade_price: number; // 체결 가격
  trade_volume: number; // 체결량
  ask_bid: string; // 매도/매수 구분
  prev_closing_price: number; // 전일 종가
  change_price: number; // 변화량
  timestamp: number; // 체결 타임스탬프
  sequential_id: number; // 체결 번호
}

export interface WebsocketTradeData extends TradeData {
  type: string; // 타입 (trade)
  code: string; // 마켓 코드
  change: string; // 전일 대비
  trade_date: string; // 거래 일자
  trade_time: string; // 거래 시각
  trade_timestamp: number; // 체결 타임스탬프
  stream_type: string; // 스트림 타입
}

export interface FetchingTradeData extends TradeData {
  market: string; // 마켓 구분 코드
  trade_date_utc: string; // 체결 일자 (UTC)
  trade_time_utc: string; // 체결 시각 (UTC)
}

interface TradeRenderData {
  timestamp: number;
  ask_bid: string;
  trade_price: number;
  trade_volume: number;
  change_price: number;
  sequential_id: number;
}
