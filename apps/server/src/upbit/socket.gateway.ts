import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { UpbitMarketUpdaterService } from "./upbit-market-updater.service";
import { SubscriptionService } from "./subscription.service";

@WebSocketGateway({ cors: true, namespace: "/ws" })
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(SocketGateway.name);

  constructor(
    private readonly marketService: UpbitMarketUpdaterService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  handleConnection(client: Socket) {
    console.log(client.id);
    this.logger.log(`클라이언트 연결: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 해제: ${client.id}`);
    this.subscriptionService.leaveJoinedRoom(client);
  }

  @SubscribeMessage("join")
  joinRoom(client: Socket, marketCode: string) {
    if (!this.marketService.isValidMarketCode(marketCode)) {
      this.subscriptionService.leaveJoinedRoom(client);

      return {
        event: "error",
        data: `${marketCode} 는 유효하지 않은 마켓 코드입니다.`,
      };
    }

    this.subscriptionService.join(client, marketCode);
    return { event: "ok", data: `${marketCode} 참가 성공` };
  }

  @SubscribeMessage("ticker")
  subscribeTicker(client: Socket) {
    this.subscriptionService.ticker(client);

    return { event: "ok", data: `ticker 구독 성공` };
  }

  @SubscribeMessage("ticker:stop")
  unsubscribeTicker(client: Socket) {
    this.subscriptionService.unsubscribeTickerStream(client);

    return { event: "ok", data: `ticker 구독해제 성공` };
  }
}
