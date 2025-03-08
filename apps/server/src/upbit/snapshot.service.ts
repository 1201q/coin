import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import {
  MarketType,
  Orderbook,
  TickerSnapshot,
} from "../types/entities/upbit.entity";
import { firstValueFrom, map } from "rxjs";

import { CandleData } from "../types/entities/upbit.entity";
import {
  CandleParamsDto,
  GetCandleDto,
  GetTradeDto,
} from "../types/dtos/upbit.dto";

@Injectable()
export class SnapshotService {
  constructor(private readonly httpService: HttpService) {}

  async fetch<T>(url: string): Promise<T[]> {
    const response = await firstValueFrom(
      this.httpService.get<T[]>(url).pipe(map((res) => res.data)),
    );

    return response;
  }

  async getCandleData(params: CandleParamsDto, query: GetCandleDto) {
    const { type } = params;
    const { market, unit, to, count } = query;

    const base = `https://api.upbit.com/v1/candles`;
    const url =
      type === "minutes" ? `${base}/${type}/${unit}` : `${base}/${type}`;

    const queryParams: Record<string, string | number> = {
      market,
      ...(to && { to }),
      ...(count && { count }),
    };

    const queryToString = new URLSearchParams(
      queryParams as Record<string, string>,
    ).toString();

    const fetchUrl = `${url}?${queryToString}`;

    return this.fetch<CandleData>(fetchUrl);
  }

  async getOrderbookData(market: string) {
    const url = `https://api.upbit.com/v1/orderbook?markets=${market}`;

    return this.fetch<Orderbook>(url);
  }

  async getAllTickerData(type: MarketType) {
    const url = `https://api.upbit.com/v1/ticker/all?quote_currencies=${type}`;

    return this.fetch<TickerSnapshot>(url);
  }

  async getTradeData(query: GetTradeDto) {
    const { market, cursor, count, days_ago } = query;

    const url = `https://api.upbit.com/v1/trades/ticks`;

    const queryParams: Record<string, string | number> = {
      market,
      ...(count && { count }),
      ...(cursor && { cursor }),
      ...(days_ago && { days_ago: days_ago }),
    };

    const queryToString = new URLSearchParams(
      queryParams as Record<string, string>,
    ).toString();

    const fetchUrl = `${url}?${queryToString}`;

    return this.fetch<TickerSnapshot>(fetchUrl);
  }
}
