import { Suspense } from "react";
import Trade from "./Trade";
import { MarketData, FetchingTradeData } from "@/types/fetch";

const URL = `https://api.bithumb.com/v1/trades/ticks?count=100&market=`;

interface TradeRenderData {
  timestamp: number;
  ask_bid: string;
  trade_price: number;
  trade_volume: number;
  change_price: number;
  sequential_id: number;
  color?: "red" | "blue";
}

const convertFetchingDataType = (data: FetchingTradeData): TradeRenderData => {
  return {
    timestamp: data.timestamp,
    ask_bid: data.ask_bid,
    trade_price: data.trade_price,
    trade_volume: data.trade_volume,
    change_price: data.change_price,
    sequential_id: data.sequential_id,
  };
};

export default async function TradeServer({
  currentMarket,
}: {
  currentMarket: MarketData;
}) {
  const response = await fetch(`${URL}${currentMarket.market}`, {
    cache: "no-store",
  });
  const initialData: FetchingTradeData[] = await response.json();
  const renderData: TradeRenderData[] = initialData.map((data) =>
    convertFetchingDataType(data)
  );

  renderData.reverse().forEach((item, index) => {
    if (index == 0) {
      item.color = item.ask_bid === "ASK" ? "red" : "blue";
    } else {
      const prevPrice = renderData[index - 1].trade_price;
      const prevColor = renderData[index - 1].color;

      if (item.trade_price > prevPrice) {
        item.color = "red";
      } else if (item.trade_price < prevPrice) {
        item.color = "blue";
      } else {
        item.color = prevColor;
      }
    }
  });
  const reversedData = renderData.reverse();

  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Trade initialData={reversedData} />
    </Suspense>
  );
}
