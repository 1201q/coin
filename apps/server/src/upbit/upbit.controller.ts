import { Controller, Get, Param, Query } from "@nestjs/common";

import {
  CandleParamsDto,
  GetCandleDto,
  GetOrderbookSnapshotDto,
  GetTickerSnapshotDto,
  GetTradeDto,
} from "./types/upbit.dto";
import { SnapshotService } from "./snapshot.service";
import { UpbitMarketUpdaterService } from "./upbit-market-updater.service";

@Controller("upbit")
export class UpbitController {
  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly marketService: UpbitMarketUpdaterService,
  ) {}

  // 캔들 조회
  @Get("candle/:type")
  async getCandle(
    @Param() params: CandleParamsDto,
    @Query() query: GetCandleDto,
  ) {
    return this.snapshotService.getCandleData(params, query);
  }

  @Get("orderbook")
  async getOrderbookSnapshot(@Query() query: GetOrderbookSnapshotDto) {
    return this.snapshotService.getOrderbookData(query.market);
  }

  @Get("market")
  async getMarketData() {
    return this.marketService.getMarketList();
  }

  @Get("allticker/:type")
  async getAllTickerSnapshot(@Param() params: GetTickerSnapshotDto) {
    return this.snapshotService.getAllTickerData(params.type);
  }

  @Get("trade")
  async getTradeSnapshot(@Query() query: GetTradeDto) {
    return this.snapshotService.getTradeData(query);
  }
}
