import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  WsException,
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
        event: "join",
        data: {
          status: "fail",
          message: `${marketCode}는 유효하지 않은 마켓 코드입니다.`,
          submitCode: marketCode,
        },
      };
    }

    const result = this.subscriptionService.join(client, marketCode);

    if (!result.success) {
      return {
        event: "join",
        data: {
          status: "fail",
          message: result.message,
        },
      };
    }

    return {
      event: "join",
      data: {
        status: "success",
        message: result.message,
        submitCode: marketCode,
        leftRoom: result.leftRoom,
      },
    };
  }

  @SubscribeMessage("ticker")
  subscribeTicker(client: Socket) {
    const result = this.subscriptionService.ticker(client);

    if (!result.success) {
      return {
        event: "ticker:start",
        data: { status: "fail", message: result.message },
      };
    }

    return {
      event: "ticker:start",
      data: { status: "success", message: result.message },
    };
  }

  @SubscribeMessage("ticker:stop")
  unsubscribeTicker(client: Socket) {
    const result = this.subscriptionService.unsubscribeTickerStream(client);

    if (!result.success) {
      return {
        event: "ticker:stop",
        data: { status: "fail", message: result.message },
      };
    }

    return {
      event: "ticker:stop",
      data: { status: "success", message: result.message },
    };
  }
}
