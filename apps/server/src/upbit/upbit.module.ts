import { Module } from '@nestjs/common';

import { UpbitController } from './upbit.controller';
import { HttpModule } from '@nestjs/axios';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { MarketService } from './market.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SnapshotService } from './snapshot.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [UpbitController],
  providers: [
    MarketService,
    WebsocketService,
    WebsocketGateway,
    SnapshotService,
  ],
})
export class UpbitModule {}
