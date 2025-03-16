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

export interface WalletResponse {
  wallet_id: string;
  balance: number;
  available_balance: number;
  locked_balance: number;
  created_at: string;
}

export interface ProfileRespons {
  id: string;
  email: string;
  name: string;
  walletId: string;
  expiresIn: number;
}
