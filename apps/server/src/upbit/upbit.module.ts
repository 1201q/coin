import { Module } from "@nestjs/common";

import { UpbitController } from "./upbit.controller";
import { HttpModule } from "@nestjs/axios";

import { UpbitMarketUpdaterService } from "./upbit-market-updater.service";
import { ScheduleModule } from "@nestjs/schedule";
import { SnapshotService } from "./snapshot.service";
import { SocketGateway } from "./socket.gateway";
import { UpbitWebsocketStreamService } from "./upbit-websocket-stream.service";
import { SubscriptionService } from "./subscription.service";
import { LoggerModule } from "src/logger.module";

@Module({
  imports: [LoggerModule, HttpModule, ScheduleModule.forRoot()],
  controllers: [UpbitController],
  providers: [
    UpbitMarketUpdaterService,
    SnapshotService,
    UpbitWebsocketStreamService,
    SocketGateway,
    SubscriptionService,
  ],
})
export class UpbitModule {}
