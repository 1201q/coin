import { Orderbook } from '@/types/upbit';

async function getOrderbook(code: string) {
  const res = await fetch(
    `https://api.coingosu.live/upbit/orderbook?market=${code}`,
  );
  const data: Orderbook[] = await res.json();

  return data[0];
}

export default async function OrderbookServer({ code }: { code: string }) {
  const data = await getOrderbook(code);

  console.log(1);
  return (
    <div>
      <div>1111111111111111111111</div>
      <h1>{code}</h1>
      <h2>{data.timestamp}</h2>
    </div>
  );
}
