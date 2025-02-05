import { HttpService } from "@nestjs/axios";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { firstValueFrom, map } from "rxjs";
import { MarketInfo } from "./types/upbit.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UpbitWebsocketStreamService } from "./upbit-websocket-stream.service";

@Injectable()
export class UpbitMarketUpdaterService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly upbitWebsocketStreamService: UpbitWebsocketStreamService,
  ) {}
  private readonly logger = new Logger(UpbitMarketUpdaterService.name);
  private marketList: MarketInfo[] = [];
  private marketCodes: string[] = [];

  async getKRWMarketData() {
    const url = "https://api.upbit.com/v1/market/all";

    const response = await firstValueFrom(
      this.httpService.get<MarketInfo[]>(url).pipe(map((res) => res.data)),
    );

    return response.filter((coin) => coin.market.startsWith("KRW-"));
  }

  @Cron(CronExpression.EVERY_2_HOURS, {
    name: "updateMarketData",
    timeZone: "Asia/Seoul",
  })
  async updateMarketData() {
    const currentMarkets = await this.getKRWMarketData();
    const currentCodes = currentMarkets.map((coin) => coin.market);

    if (JSON.stringify(currentCodes) !== JSON.stringify(this.marketCodes)) {
      this.marketList = currentMarkets;
      this.marketCodes = currentCodes;
      this.logger.log("마켓 데이터 갱신: " + currentCodes.length);

      this.upbitWebsocketStreamService.updateMarketCodes(this.marketCodes);
    }
  }

  onModuleInit() {
    this.updateMarketData();
  }

  getMarketList() {
    return this.marketList;
  }

  getMarketCodes() {
    return this.marketCodes;
  }

  isValidMarketCode(code: string) {
    const codes = this.getMarketCodes();
    return codes.includes(code);
  }
}
