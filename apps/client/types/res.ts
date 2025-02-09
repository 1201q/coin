export interface WsResponse {
  message: string;
  status: 'success' | 'fail' | 'already';
}

export interface WsTickerResponse extends WsResponse {
  count?: number;
}

export interface WsJoinResponse extends WsResponse {
  submitCode: string;
  leftRoom?: null | string;
}

export interface WsLeaveResponse extends WsResponse {
  leftRoom?: string;
}
