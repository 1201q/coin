import { TradeSnapshot } from '@/types/upbit';

async function getTrade(code: string) {
  const res = await fetch(
    `https://api.coingosu.live/upbit/trade?market=${code}`,
  );
  const data: TradeSnapshot[] = await res.json();

  return data;
}

export default async function TradeServer({ code }: { code: string }) {
  const data = await getTrade(code);

  console.log(data);

  return (
    <div>
      {data.map((item) => (
        <div key={`${item.timestamp}-${item.sequential_id}`}>
          <div>1</div>
          <div>{item.timestamp}</div>
          <div>1</div>
          <div>1</div>
        </div>
      ))}
    </div>
  );
}
