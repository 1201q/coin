import {
  CandleData,
  CandleType,
  CandleUnit,
  convertCandleData,
} from '@/types/upbit';

interface FetchCandleProps {
  market: string;
  unit?: CandleUnit;
  to?: string;
  type: CandleType;
}

export const fetchCandleData = async ({
  market,
  unit,
  to,
  type,
}: FetchCandleProps) => {
  const url = new URL(`https://api.coingosu.live/upbit/candle/${type}`);
  url.searchParams.append('market', market);

  if (type === 'minutes' && unit) {
    url.searchParams.append('unit', unit.toString());
  }

  if (to) {
    url.searchParams.append('to', to);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to fetch candle data');
  }

  const data: CandleData[] = await res.json();

  return { data: data, convertedData: convertCandleData(data) };
};
