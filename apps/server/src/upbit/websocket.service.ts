import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';

import * as WebSocket from 'ws';
import { Orderbook, Ticker, Trade } from './types/upbit.entity';

@Injectable()
export class WebsocketService implements OnModuleInit, OnModuleDestroy {
  private tickerSocket: WebSocket;
  private orderbookSocket: WebSocket;
  private tradeSocket: WebSocket;

  private tickerStream = new Subject<Ticker>();
  private orderbookStream = new Subject<Orderbook>();
  private tradeStream = new Subject<Trade>();

  private marketCodes: string[] = [];

  onModuleInit() {
    this.connectTickerSocket();
    this.connectOrderbookSocket();
    this.connectTradeSocket();
  }

  onModuleDestroy() {
    if (this.tickerSocket) {
      console.log('websocket 종료');
      this.tickerSocket.close();
    }
    if (this.tradeSocket) {
      console.log('websocket 종료');
      this.tradeSocket.close();
    }
    if (this.orderbookSocket) {
      console.log('websocket 종료');
      this.orderbookSocket.close();
    }
  }

  private connectTickerSocket() {
    this.tickerSocket = new WebSocket('wss://api.upbit.com/websocket/v1');

    this.tickerSocket.on('open', () => {
      if (this.marketCodes.length > 0) {
        this.subscribeTicker(this.marketCodes);
      }
    });

    this.tickerSocket.on('message', (data) => {
      try {
        const message: Ticker = JSON.parse(data.toString());

        this.tickerStream.next(message);
      } catch (error) {
        console.error(error);
      }
    });
  }

  private connectOrderbookSocket() {
    this.orderbookSocket = new WebSocket('wss://api.upbit.com/websocket/v1');

    this.orderbookSocket.on('open', () => {
      if (this.marketCodes.length > 0) {
        this.subscribeOrderbook(this.marketCodes);
      }
    });

    this.orderbookSocket.on('message', (data) => {
      try {
        const message: Orderbook = JSON.parse(data.toString());

        this.orderbookStream.next(message);
      } catch (error) {
        console.error(error);
      }
    });
  }

  private connectTradeSocket() {
    this.tradeSocket = new WebSocket('wss://api.upbit.com/websocket/v1');

    this.tradeSocket.on('open', () => {
      if (this.marketCodes.length > 0) {
        this.subscribeTrade(this.marketCodes);
      }
    });

    this.tradeSocket.on('message', (data) => {
      try {
        const message: Trade = JSON.parse(data.toString());

        this.tradeStream.next(message);
      } catch (error) {
        console.error(error);
      }
    });
  }

  private subscribeTicker(codes: string[]) {
    const message = [{ ticket: 'test' }, { type: 'ticker', codes: codes }];

    this.tickerSocket.send(JSON.stringify(message));
  }
  private subscribeTrade(codes: string[]) {
    const message = [{ ticket: 'test-1' }, { type: 'trade', codes: codes }];

    this.tradeSocket.send(JSON.stringify(message));
  }

  private subscribeOrderbook(codes: string[]) {
    const message = [{ ticket: 'test-2' }, { type: 'orderbook', codes: codes }];

    this.orderbookSocket.send(JSON.stringify(message));
  }

  updateMarketCodes(newMarketCodes: string[]) {
    this.marketCodes = newMarketCodes;
    if (this.tickerSocket && this.tickerSocket.readyState === WebSocket.OPEN) {
      this.subscribeTicker(this.marketCodes);
    }

    if (this.tradeSocket && this.tradeSocket.readyState === WebSocket.OPEN) {
      this.subscribeTrade(this.marketCodes);
    }

    if (
      this.orderbookSocket &&
      this.orderbookSocket.readyState === WebSocket.OPEN
    ) {
      this.subscribeOrderbook(this.marketCodes);
    }
  }

  getTickerStream() {
    return this.tickerStream.asObservable();
  }

  getTradeStream() {
    return this.tradeStream.asObservable();
  }

  getOrderbookStream() {
    return this.orderbookStream.asObservable();
  }
}
