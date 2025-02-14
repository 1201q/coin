import { Orderbook } from '@/types/upbit';
import OrderbookClient from './OrderbookClient';

async function getOrderbook(code: string) {
  const res = await fetch(
    `https://api.coingosu.live/upbit/orderbook?market=${code}`,
  );
  const data: Orderbook[] = await res.json();

  return data[0];
}

export default async function OrderbookServer({ code }: { code: string }) {
  const data = await getOrderbook(code);

  return <OrderbookClient data={data} />;
}
