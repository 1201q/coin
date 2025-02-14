import { convertTradeData, TradeSnapshot } from '@/types/upbit';
import TradeClient from './TradeClient';
import { Suspense } from 'react';

async function getTrade(code: string) {
  const res = await fetch(
    `https://api.coingosu.live/upbit/trade?market=${code}`,
    { cache: 'no-cache' },
  );
  const data: TradeSnapshot[] = await res.json();

  return data;
}

export default async function TradeServer({ code }: { code: string }) {
  const data = await getTrade(code);
  const uniqueData = data.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (d) =>
          d.ask_bid === item.ask_bid &&
          d.sequential_id === item.sequential_id &&
          d.trade_volume === item.trade_volume,
      ),
  );
  const convertData = uniqueData.map((item) => convertTradeData(item));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TradeClient data={convertData} code={code} />
    </Suspense>
  );
}
