import { Injectable } from "@nestjs/common";
import { Subscription } from "rxjs";
import { Socket } from "socket.io";
import { UpbitWebsocketStreamService } from "./upbit-websocket-stream.service";
import { AppLogger } from "src/logger.service";

@Injectable()
export class SubscriptionService {
  private readonly roomSubspriptions: Map<
    string,
    Map<string, { trade: Subscription; orderbook: Subscription }>
  > = new Map();

  private readonly tickerSubscriptions: Map<string, Subscription> = new Map();

  constructor(
    private readonly upbitWebsocketStreamService: UpbitWebsocketStreamService,
    private readonly logger: AppLogger,
  ) {}

  ticker(client: Socket): {
    success: boolean;
    message: string;
    status: string;
  } {
    if (this.tickerSubscriptions.has(client.id)) {
      this.logger.warn(`이미 ticker를 구독중인 클라이언트: ${client.id}`);
      return {
        success: false,
        message: "이미 ticker를 구독 중입니다.",
        status: "already",
      };
    }

    const subscription = this.upbitWebsocketStreamService.subscribeTickerStream(
      (data) => {
        client.emit("ticker", data);
      },
    );

    this.tickerSubscriptions.set(client.id, subscription);
    this.logger.log(`ticker 구독: ${client.id}`);

    return { success: true, message: "ticker 구독 성공!", status: "success" };
  }

  join(
    client: Socket,
    coinCode: string,
  ): { success: boolean; message: string; leftRoom?: string } {
    const { leftRoom, leftSuccess } = this.leaveJoinedRoom(client);

    let subscriptions = this.roomSubspriptions.get(coinCode);

    if (!subscriptions) {
      subscriptions = new Map();
      this.roomSubspriptions.set(coinCode, subscriptions);
    }

    if (subscriptions.has(client.id)) {
      this.logger.warn(`이미 구독중인 클라이언트: ${client.id}/${coinCode}`);
      return { success: false, message: `이미 ${coinCode}를 구독 중입니다.` };
    }

    const tradeSubscription =
      this.upbitWebsocketStreamService.subscribeTradeStream(
        coinCode,
        (data) => {
          client.emit("trade", data);
        },
      );

    const orderbookSubscription =
      this.upbitWebsocketStreamService.subscribeOrderbookStream(
        coinCode,
        (data) => {
          client.emit("orderbook", data);
        },
      );

    subscriptions.set(client.id, {
      trade: tradeSubscription,
      orderbook: orderbookSubscription,
    });

    this.logger.log(`클라이언트 구독: ${client.id}/${coinCode}`);

    return {
      success: true,
      message: `${coinCode}를 구독했습니다.`,
      leftRoom: leftSuccess ? leftRoom : null,
    };
  }

  leave(client: Socket, coinCode: string) {
    const clientId = client.id;
    const subscriptions = this.roomSubspriptions.get(coinCode);

    if (!subscriptions || !subscriptions.has(client.id)) {
      this.logger.warn(`구독중이 아닌 클라이언트: ${clientId}/${coinCode}`);
      return;
    }

    const { trade, orderbook } = subscriptions.get(client.id);

    if (trade) {
      trade.unsubscribe();
    }

    if (orderbook) {
      orderbook.unsubscribe();
    }

    subscriptions.delete(clientId);
    if (subscriptions.size === 0) {
      this.roomSubspriptions.delete(coinCode);
    }
    this.logger.log(`클라이언트 구독해제: ${client.id}/${coinCode}`);
  }

  leaveJoinedRoom(client: Socket) {
    const currentCoinCode = this.getCurrentCoinCode(client);

    if (currentCoinCode) {
      this.leave(client, currentCoinCode);
      return { leftRoom: currentCoinCode, leftSuccess: true };
    }
    return { leftRoom: currentCoinCode, leftSuccess: false };
  }

  unsubscribeTickerStream(client: Socket): {
    success: boolean;
    message: string;
  } {
    const subscription = this.tickerSubscriptions.get(client.id);
    if (subscription) {
      subscription.unsubscribe();
      this.tickerSubscriptions.delete(client.id);
      this.logger.log(`ticker 구독해제: ${client.id}`);

      return { success: true, message: "ticker 구독해제 성공!" };
    } else {
      this.logger.warn(`ticker를 구독중이 아닌 클라이언트: ${client.id}`);

      return { success: false, message: "ticker가 구독중이 아닙니다." };
    }
  }

  private getCurrentCoinCode(client: Socket) {
    for (let [coinCode, subscriptions] of this.roomSubspriptions) {
      if (subscriptions.has(client.id)) {
        return coinCode;
      }
    }
    return null;
  }
}
