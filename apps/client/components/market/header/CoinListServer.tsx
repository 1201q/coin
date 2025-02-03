import SearchDialog from './SearchDialog';
import { TickerSnapshot } from '@/types/upbit';

export default async function CoinListServer() {
  const data: TickerSnapshot[] = await fetch(
    'https://api.coingosu.live/upbit/allticker/KRW',
    {
      cache: 'no-store',
    },
  ).then((res) => res.json());

  return <SearchDialog data={data} />;
}
