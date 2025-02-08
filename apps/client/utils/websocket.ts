import io from 'socket.io-client';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import {
  convertTickerData,
  Orderbook,
  Ticker,
  TickerData,
  TickerSnapshot,
  Trade,
} from '@/types/upbit';
import {
  WsJoinResponse,
  WsLeaveResponse,
  WsResponse,
  WsTickerResponse,
} from '@/types/res';

class WebsocketService {
  private socket = io('https://api.coingosu.live/ws', {
    transports: ['websocket'],
  });

  private tickerSubjects = new Map<
    string,
    BehaviorSubject<TickerData | null>
  >();

  private orderbookSubject = new BehaviorSubject<Orderbook | null>(null);
  private tradeSubject = new BehaviorSubject<Trade | null>(null);

  private initStatusSubject = new BehaviorSubject<boolean>(false);
  private tickerStatusSubject = new BehaviorSubject<boolean>(false);
  private joinedRoomSubject = new BehaviorSubject<string>('');

  constructor() {
    this.initTickerData().then(() => {
      this.initStatusSubject.next(true);
      console.log('init');
      this.handleTickerWebsocket();
    });

    this.socket.on('orderbook', (data: Orderbook) => {
      this.orderbookSubject.next(data);
    });

    this.socket.on('trade', (data: Trade) => {
      this.tradeSubject.next(data);
    });

    this.socket.on('join', (msg: WsJoinResponse) => {
      console.log(msg);
      if (msg.status === 'success') {
        this.joinedRoomSubject.next(msg.submitCode);
      } else if (msg.status === 'fail') {
        this.joinedRoomSubject.next('');
      }
    });

    this.socket.on('leave', (msg: WsLeaveResponse) => {
      if (msg.status === 'success') {
        this.joinedRoomSubject.next('');
      } else if (msg.status === 'fail') {
        this.joinedRoomSubject.next('');
      }
    });
  }

  private async initTickerData() {
    try {
      const res = await fetch('https://api.coingosu.live/upbit/allticker/KRW');

      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      const data: TickerSnapshot[] = await res.json();

      data.forEach((item) => {
        const ticker = convertTickerData(item);
        this.tickerSubjects.set(
          ticker.code,
          new BehaviorSubject<TickerData | null>(ticker),
        );
      });
    } catch (e) {
      console.error(e);
    }
  }

  private handleTickerWebsocket() {
    console.log('handleWebsocket');

    this.socket.on('ticker', (newData: Ticker) => {
      const code = newData.code;
      const data = convertTickerData(newData);

      if (this.tickerSubjects.has(code)) {
        this.tickerSubjects.get(code)!.next(data);
      } else {
        this.tickerSubjects.set(
          code,
          new BehaviorSubject<TickerData | null>(data),
        );
      }
    });

    this.socket.on('ticker:start', (msg: WsTickerResponse) => {
      if (msg.status === 'success' && msg.count && msg.count > 0) {
        this.tickerStatusSubject.next(true);
      }
    });

    this.socket.on('ticker:stop', (msg: WsResponse) => {
      if (msg.status === 'success' && this.tickerStatusSubject.value) {
        this.tickerStatusSubject.next(false);
      }
    });
  }

  getTicker(code: string): Observable<TickerData | null> {
    if (!this.tickerSubjects.has(code)) {
      this.tickerSubjects.set(
        code,
        new BehaviorSubject<TickerData | null>(null),
      );
    }

    return this.tickerSubjects.get(code)!.asObservable();
  }

  getAllTickers(): Observable<TickerData[]> {
    return combineLatest([...this.tickerSubjects.values()]).pipe(
      map((tickers) => tickers.filter((ticker) => ticker !== null)),
    );
  }

  getOrderbook(): Observable<Orderbook | null> {
    return this.orderbookSubject.asObservable();
  }

  getTrade(): Observable<Trade | null> {
    return this.tradeSubject.asObservable();
  }

  getTickerStatus(): Observable<boolean> {
    return this.tickerStatusSubject.asObservable();
  }

  getJoinedRoom(): Observable<string> {
    return this.joinedRoomSubject.asObservable();
  }

  joinRoom(code: string) {
    this.socket.emit('join', code);
  }

  leaveRoom() {
    this.socket.emit('leave');
  }

  subscirbeTicker() {
    this.socket.emit('ticker');
  }

  unsubscirbeTicker() {
    this.socket.emit('ticker:stop');
  }
}

export const socketService = new WebsocketService();
