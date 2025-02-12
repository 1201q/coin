import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { BehaviorSubject, Subject } from "rxjs";
import * as WebSocket from "ws";
import { Orderbook, Ticker, Trade } from "./types/upbit.entity";
import { AppLogger } from "src/logger.service";

export type SocketType = "ticker" | "orderbook" | "trade";

@Injectable()
export class UpbitWebsocketStreamService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: AppLogger) {}

  private isShuttingDown = false;
  private sockets = new Map<SocketType, WebSocket>();
  private streams = {
    ticker: new Subject<Ticker>(),
    orderbook: new Map<string, BehaviorSubject<Orderbook>>(),
    trade: new Map<string, BehaviorSubject<Trade>>(),
  };

  onModuleInit() {
    this.initSockets();
  }

  onModuleDestroy() {
    this.isShuttingDown = true;
    this.sockets.forEach((socket, type) => {
      socket.close();
      this.logger.log(`웹소켓 종료: ${type}`);
    });
  }

  private initSockets() {
    this.createUpbitSocket("ticker", this.handleTickerStream);
    this.createUpbitSocket("trade", this.handleTradeStream);
    this.createUpbitSocket("orderbook", this.handleOrderbookStream);
  }

  private checkAllSocketsOpen(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        const allOpen = Array.from(this.sockets.values()).every(
          (socket) => socket.readyState === WebSocket.OPEN,
        );

        if (allOpen) {
          this.logger.log(`✅ 웹소켓: 모든 소켓이 열렸습니다.`);
          resolve();
        } else {
          this.logger.log(`⚠️ 웹소켓: 아직 소켓이 열리지 않았습니다.`);
          setTimeout(check, 2000);
        }
      };
      check();
    });
  }

  private createUpbitSocket<T extends { code: string }>(
    type: SocketType,
    onMessage: (data: T) => void,
  ) {
    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");

    socket.on("open", () => {
      this.logger.log(`⏳ 소켓 생성: ${type}`);
    });

    socket.on("message", (data) =>
      this.processMessage(type, data.toString(), onMessage),
    );

    socket.on("close", (code, reason) => {
      this.logger.warn(
        `⚠️ 소켓 닫힘: ${type} (code: ${code}, reason: ${reason.toString()})`,
      );

      this.sockets.delete(type);

      if (!this.isShuttingDown) {
        setTimeout(() => {
          this.logger.log(`⏳ 소켓 연결 재시도: ${type}`);
          this.createUpbitSocket(type, onMessage);
        }, 5000);
      }
    });

    socket.on("error", (error) => {
      this.logger.error(`❌ 소켓 오류: ${type}/${error.message}`);
    });

    this.sockets.set(type, socket);
  }

  private processMessage<T extends { code: string }>(
    type: SocketType,
    data: string,
    onMessage: (data: T) => void,
  ) {
    const parsedData: T = JSON.parse(data.toString());

    if (parsedData["stream_type"] === "SNAPSHOT") {
      this.handleSnapshotData(type, parsedData);
    } else {
      onMessage(parsedData);
    }
  }

  // 업비트 웹소켓 서버에 구독 요청
  private subscribeToUpbit(type: SocketType, codes: string[]) {
    const socket = this.sockets.get(type);
    if (!socket) return;

    if (socket.readyState === WebSocket.OPEN && codes.length > 0) {
      const message = [{ ticket: `${type}/ws` }, { type: type, codes: codes }];
      socket.send(JSON.stringify(message));

      this.logger.log(`📌 업비트 구독: ${type}/${codes.length}개`);
    }
  }

  /////////////////////////////// 데이터 방출
  private updateStream<T extends { code: string }>(
    streamMap: Map<string, BehaviorSubject<T>>,
    data: T,
  ) {
    const stream = streamMap.get(data.code) || new BehaviorSubject<T>(data);
    streamMap.set(data.code, stream);
    stream.next(data);
  }

  private handleTickerStream = (data: Ticker) => {
    this.streams.ticker.next(data);
  };

  private handleTradeStream = (data: Trade) => {
    this.updateStream(this.streams.trade, data);
  };

  private handleOrderbookStream = (data: Orderbook) => {
    this.updateStream(this.streams.orderbook, data);
  };

  // snapshot 도착 데이터를 초기값으로 설정
  private handleSnapshotData(type: SocketType, data: any) {
    if (type === "ticker") {
      this.handleTickerStream(data);
    } else {
      this.updateStream(this.streams[type], data);
    }
  }

  // 마켓 리스트에 변경 일어나면 해당 변경사항을 업비트 웹소켓 서버에 전달
  // market 서비스가 호출
  updateMarketCodes(newMarketCodes: string[]) {
    this.logger.log(`🔄🔄 소켓 서비스에서 마켓 업데이트를 호출`);
    this.checkAllSocketsOpen().then(() => {
      this.sockets.forEach((_, type) => {
        this.subscribeToUpbit(type, newMarketCodes);
      });
    });
  }

  /////////////////////////////// 데이터 구독
  private getStream<T>(
    streamMap: Map<string, BehaviorSubject<T>>,
    code: string,
  ) {
    return streamMap.get(code) || new BehaviorSubject<T>(null);
  }

  subscribeTickerStream(callback: (data: Ticker) => void) {
    return this.streams.ticker.asObservable().subscribe(callback);
  }

  subscribeTradeStream(code: string, callback: (data: Trade) => void) {
    return this.getStream(this.streams.trade, code)
      .asObservable()
      .subscribe(callback);
  }

  subscribeOrderbookStream(code: string, callback: (data: Orderbook) => void) {
    return this.getStream(this.streams.orderbook, code)
      .asObservable()
      .subscribe(callback);
  }
}
