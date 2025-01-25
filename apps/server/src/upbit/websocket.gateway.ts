import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { SocketType, WebsocketService } from "./websocket.service";
import { Subscription } from "rxjs";
import { MarketService } from "./market.service";

@WebSocketGateway({ cors: true, namespace: "ws", transports: ["websocket"] })
@Injectable()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(WebsocketGateway.name);

  private currentClients = new Map<string, string>();

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly marketService: MarketService,
  ) {}

  getConnectedClientCount() {
    return this.currentClients.size;
  }

  handleConnection(client: Socket) {
    this.logger.log(`클라이언트 연결: ${client.id}`);
    this.currentClients.set(client.id, "");
    this.logger.log(
      `현재 연결된 클라이언트 수: ${this.getConnectedClientCount()}`,
    );
  }
  handleDisconnect(client: Socket) {
    this.unsubscribeAll(client);
    this.currentClients.delete(client.id);
    this.logger.log(`클라이언트 해제: ${client.id}`);
    this.logger.log(
      `현재 연결된 클라이언트 수: ${this.getConnectedClientCount()}`,
    );
  }

  private unsubscribeAll(client: Socket) {
    const subscriptions = this.websocketService.getSubscriptions(client.id);

    if (subscriptions) {
      subscriptions.forEach((_, type) => {
        this.logger.log(`구독 해제/${type}: ${client.id}`);
        const [wsType, code] = type.split("/");
        this.websocketService.unsubscribeStream(
          wsType as SocketType,
          client.id,
          code,
        );
      });
      this.websocketService.deleteSubscriptions(client.id);
    }
  }

  @SubscribeMessage("sub/ticker")
  subscribeTickerData(client: Socket): WsResponse<any> {
    const subscriptions = this.websocketService.getSubscriptions(client.id);

    if (subscriptions && subscriptions.has("ticker/all")) {
      this.logger.warn(`이미 ticker를 구독 중입니다. ${client.id}`);
      client.emit("error", "이미 ticker를 구독 중입니다.");
      return { event: "error", data: "이미 ticker를 구독 중입니다." };
    }

    const tickerSubscription = this.websocketService.subscribeTickerStream(
      (data) => client.emit("ticker", data),
    );

    this.websocketService.saveSubscription(
      "ticker",
      client.id,
      "all",
      tickerSubscription,
    );

    this.logger.log(`ticker 구독 시작. ${client.id}`);
    return { event: "ok", data: "ticker 구독 시작" };
  }

  @SubscribeMessage("unsub/ticker")
  unsubscribeTickerData(client: Socket): WsResponse<any> {
    const subscriptions = this.websocketService.getSubscriptions(client.id);

    if (!subscriptions || !subscriptions.has("ticker/all")) {
      this.logger.warn(`ticker가 구독 중이 아닙니다. ${client.id}`);
      client.emit("error", "ticker가 구독 중이 아닙니다.");
      return { event: "error", data: "ticker가 구독 중이 아닙니다." };
    }

    this.websocketService.unsubscribeStream("ticker", client.id, "all");
    this.logger.log(`ticker 구독 해제. ${client.id}`);

    return { event: "ok", data: "ticker 구독 해제" };
  }

  @SubscribeMessage("sub/other")
  subscribeOtherData(client: Socket, marketCode: string): WsResponse<any> {
    const subscriptions = this.websocketService.getSubscriptions(client.id);

    if (!this.marketService.isValidMarketCode(marketCode)) {
      this.logger.warn(`${marketCode}는 없는 코인입니다. ${client.id}`);
      client.emit("error", `${marketCode}는 없는 코인입니다.`);
      return {
        event: "error",
        data: `${marketCode}는 없는 코인입니다.`,
      };
    }

    if (subscriptions) {
      const isSubscribedCoin = [...subscriptions.keys()].some(
        (key) =>
          key.includes(`trade/${marketCode}`) ||
          key.includes(`orderbook/${marketCode}`),
      );

      if (isSubscribedCoin) {
        this.logger.warn(
          `이미 ${marketCode}에 대해 구독 중입니다. ${client.id}`,
        );
        client.emit("error", `${marketCode}에 대해 이미 구독 중입니다.`);
        return {
          event: "error",
          data: `${marketCode}에 대해 이미 구독 중입니다.`,
        };
      }
    }

    this.unsubscribePreviousMarket(client, marketCode);
    this.subscribeStream(client, "trade", marketCode);
    this.subscribeStream(client, "orderbook", marketCode);

    this.currentClients.set(client.id, marketCode);
    return { event: "ok", data: marketCode };
  }

  @SubscribeMessage("unsub/other")
  unsubscribeOtherData(client: Socket): WsResponse<any> {
    const subscriptions = this.websocketService.getSubscriptions(client.id);

    if (!subscriptions) {
      this.logger.warn(`구독 정보가 없습니다. ${client.id}`);
      client.emit("error", "구독 정보가 없습니다.");
      return { event: "error", data: "구독 정보가 없습니다." };
    }

    const keys = [...subscriptions.keys()].filter(
      (key) => key.startsWith("trade") || key.startsWith("orderbook"),
    );

    if (keys.length === 0) {
      this.logger.warn(`구독 중인 trade/orderbook이 없습니다. ${client.id}`);
      client.emit("error", "구독 중인 trade/orderbook이 없습니다.");
      return { event: "error", data: "구독 중인 trade/orderbook이 없습니다." };
    }

    keys.forEach((key) => {
      const [type, code] = key.split("/");
      this.websocketService.unsubscribeStream(
        type as SocketType,
        client.id,
        code,
      );
    });

    this.logger.log(`모든 trade/orderbook 구독 해제 ${client.id}`);
    return { event: "ok", data: "모든 trade/orderbook 구독 해제" };
  }

  private subscribeStream(
    client: Socket,
    type: "trade" | "orderbook",
    code: string,
  ) {
    let subscription: Subscription;

    if (type === "trade") {
      subscription = this.websocketService.subscribeTradeStream(code, (data) =>
        client.emit(type, data),
      );
    } else if (type === "orderbook") {
      subscription = this.websocketService.subscribeOrderbookStream(
        code,
        (data) => client.emit(type, data),
      );
    }

    this.websocketService.saveSubscription(type, client.id, code, subscription);
  }

  private unsubscribePreviousMarket(client: Socket, newMarketCode: string) {
    const prevMarketCode = this.currentClients.get(client.id);

    if (prevMarketCode && prevMarketCode !== newMarketCode) {
      this.websocketService.unsubscribeStream(
        "trade",
        client.id,
        prevMarketCode,
      );
      this.websocketService.unsubscribeStream(
        "orderbook",
        client.id,
        prevMarketCode,
      );
    }
  }
}
