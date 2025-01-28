import { Injectable, Logger } from "@nestjs/common";
import { Subscription } from "rxjs";
import { Socket } from "socket.io";
import { UpbitWebsocketStreamService } from "./upbit-websocket-stream.service";

@Injectable()
export class SubscriptionService {
  private readonly roomSubspriptions: Map<
    string,
    Map<string, { trade: Subscription; orderbook: Subscription }>
  > = new Map();

  private readonly tickerSubscriptions: Map<string, Subscription> = new Map();

  constructor(
    private readonly upbitWebsocketStreamService: UpbitWebsocketStreamService,
  ) {}
  private readonly logger = new Logger(SubscriptionService.name);

  ticker(client: Socket) {
    if (this.tickerSubscriptions.has(client.id)) {
      this.unsubscribeTickerStream(client);
      this.logger.log(`이미 구독중인 클라이언트: ${client.id}`);
      return;
    }

    const subscription = this.upbitWebsocketStreamService.subscribeTickerStream(
      (data) => {
        client.compress(true).emit("ticker", data);
      },
    );

    this.tickerSubscriptions.set(client.id, subscription);
    this.logger.log(`클라이언트 구독: ${client.id}`);
  }

  join(client: Socket, coinCode: string) {
    this.leaveJoinedRoom(client);

    let subscriptions = this.roomSubspriptions.get(coinCode);

    if (!subscriptions) {
      subscriptions = new Map();
      this.roomSubspriptions.set(coinCode, subscriptions);
    }

    if (subscriptions.has(client.id)) {
      this.logger.log(`이미 구독중인 클라이언트: ${client.id}/${coinCode}`);
      return;
    }

    const tradeSubscription =
      this.upbitWebsocketStreamService.subscribeTradeStream(
        coinCode,
        (data) => {
          client.compress(true).emit("trade", data);
        },
      );

    const orderbookSubscription =
      this.upbitWebsocketStreamService.subscribeOrderbookStream(
        coinCode,
        (data) => {
          client.compress(true).emit("orderbook", data);
        },
      );

    subscriptions.set(client.id, {
      trade: tradeSubscription,
      orderbook: orderbookSubscription,
    });
    this.logger.log(`클라이언트 구독: ${client.id}/${coinCode}`);
  }

  leave(client: Socket, coinCode: string) {
    const clientId = client.id;
    const subscriptions = this.roomSubspriptions.get(coinCode);

    if (!subscriptions || !subscriptions.has(client.id)) {
      this.logger.log(`구독중이 아닌 클라이언트: ${clientId}/${coinCode}`);
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
    }
  }

  unsubscribeTickerStream(client: Socket) {
    const subscription = this.tickerSubscriptions.get(client.id);
    if (subscription) {
      subscription.unsubscribe();
      this.tickerSubscriptions.delete(client.id);
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
