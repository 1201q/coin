import { Transform } from "class-transformer";
import {
  IsOptional,
  IsIn,
  IsBoolean,
  IsString,
  IsInt,
  Min,
  Max,
  Matches,
} from "class-validator";
import {
  UPBIT_CANDLE_TYPE,
  UPBIT_CANDLE_UNIT,
  UPBIT_MARKET_TYPE,
} from "../../constants/constants";
import { CandleType, CandleUnit, MarketType } from "../entities/upbit.entity";

export class GetMarketInfoDto {
  @IsOptional()
  @IsIn(UPBIT_MARKET_TYPE, {
    message: "KRW, USDT, BTC 중에 하나를 선택하세요.",
  })
  filter?: string;

  @IsOptional()
  @IsBoolean({ message: "onlyCodes가 boolean type이어야 합니다." })
  @Transform(({ obj, key }) => {
    return obj[key] === "true";
  })
  onlyCodes?: boolean = false;
}

export class CandleParamsDto {
  @IsString()
  @IsIn(UPBIT_CANDLE_TYPE, {
    message:
      "type은 seconds, minutes, days, weeks, months, years 중 하나여야 합니다.",
  })
  type: CandleType;
}

export class GetCandleDto {
  @IsString({ message: "market은 문자열만 받을 수 있습니다." })
  market: string;

  @IsOptional()
  @IsInt({ message: "unit은 정수여야 합니다." })
  @Transform(({ value }) => parseInt(value, 10))
  @IsIn(UPBIT_CANDLE_UNIT, {
    message: "unit은 1, 3, 5, 15, 10, 30, 60, 240 중 하나여야 합니다.",
  })
  unit?: CandleUnit = 1;

  @IsOptional()
  @IsString({ message: "to는 문자열이어야 합니다." })
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2})?$/, {
    message: "to는 ISO8601 형식이어야 합니다. (예: 2023-01-01T00:00:00)",
  })
  to?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: "count는 숫자여야 합니다." })
  @Min(1, { message: "count는 1 이상이여야 합니다." })
  @Max(200, { message: "count는 200 이하여야 합니다." })
  count?: number = 200;
}

export class GetTradeDto {
  @IsString({ message: "market은 문자열만 받을 수 있습니다." })
  market: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: "count는 숫자여야 합니다." })
  @Min(1, { message: "count는 1 이상이여야 합니다." })
  @Max(50, { message: "count는 50 이하여야 합니다." })
  count?: number = 50;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: "days_ago는 숫자여야 합니다." })
  @Min(1, { message: "days_ago는 1 이상이여야 합니다." })
  @Max(7, { message: "days_ago는 7 이하여야 합니다." })
  days_ago?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: "cursor는 숫자여야 합니다." })
  @Min(1, { message: "cursor는 1 이상이여야 합니다." })
  @Max(10, { message: "cursor는 10 이하여야 합니다." })
  cursor?: number;
}

export class GetOrderbookSnapshotDto {
  @IsString({ message: "market은 문자열만 받을 수 있습니다." })
  market: string;
}

export class GetTickerSnapshotDto {
  @IsString()
  @IsIn(UPBIT_MARKET_TYPE, {
    message: "type은 KRW, USDT, BTC 중 하나여야 합니다.",
  })
  type: MarketType;
}
