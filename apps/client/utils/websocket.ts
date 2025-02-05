import io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Orderbook, Ticker, Trade } from '@/types/upbit';

class WebsocketService {
  private socket = io('https://api.coingosu.live/ws', {
    transports: ['websocket'],
  });
  private tickerSubject = new BehaviorSubject<Ticker | null>(null);
  private orderbookSubject = new BehaviorSubject<Orderbook | null>(null);
  private tradeSubject = new BehaviorSubject<Trade | null>(null);

  private tickerStatusSubject = new BehaviorSubject<boolean>(false);
  private joinStatusSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket.on('ticker', (data: Ticker) => {
      this.tickerSubject.next(data);
    });

    this.socket.on('orderbook', (data: Orderbook) => {
      this.orderbookSubject.next(data);
    });

    this.socket.on('trade', (data: Trade) => {
      this.tradeSubject.next(data);
    });

    this.socket.on('ok', (msg: string) => {
      if (msg.indexOf('ticker') !== -1) {
        if (msg.indexOf('성공') !== -1) {
          this.tickerStatusSubject.next(true);
          console.log('ticker success');
        } else {
          this.tickerStatusSubject.next(false);
          console.log('ticker fail');
        }
      } else {
        if (msg.indexOf('참가 성공') !== -1) {
          this.joinStatusSubject.next(true);
          console.log('join success');
        } else {
          this.joinStatusSubject.next(false);
          console.log('join fail');
        }
      }
    });
  }

  getTicker(): Observable<Ticker | null> {
    return this.tickerSubject.asObservable();
  }

  getOrderbook(): Observable<Orderbook | null> {
    return this.orderbookSubject.asObservable();
  }

  getTrade(): Observable<Trade | null> {
    return this.tradeSubject.asObservable();
  }

  joinCode(code: string) {
    this.socket.emit('join', code);
  }

  subscirbeTicker() {
    this.socket.emit('ticker');
  }
}

export const socketService = new WebsocketService();
