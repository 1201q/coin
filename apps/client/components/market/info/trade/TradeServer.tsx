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

  const convertData = data.map((item) => convertTradeData(item));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TradeClient data={convertData} />
    </Suspense>
  );
}
