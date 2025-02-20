import { useAtom, useAtomValue } from 'jotai';
import styles from './pricechart.module.css';
import PriceChartController from './PriceChartController';
import { candleQueryAtom, coinAtom, hydratedCoinAtom } from '@/store/chart';
import { useEffect } from 'react';
import { useHydrateAtoms } from 'jotai/utils';

import dayjs from 'dayjs';
import { parseTime } from '@/utils/parse';

const TestChart = ({ code }: { code: string }) => {
  useHydrateAtoms([[hydratedCoinAtom, code]], {
    dangerouslyForceHydrate: true,
  });

  const hydratedCoin = useAtomValue(hydratedCoinAtom, { delay: 0 });
  const [coin, setCoin] = useAtom(coinAtom);

  useEffect(() => {
    if (coin !== hydratedCoin) {
      setCoin(hydratedCoin);
    }
  }, [hydratedCoin, coin, setCoin]);

  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useAtomValue(candleQueryAtom);

  useEffect(() => {
    const candles = data.pages.flat().sort((a, b) => {
      if (!a || !b) return 0;
      return parseTime(a.time) - parseTime(b.time);
    });

    const map = candles.map((data) => {
      return (
        data && dayjs.unix(parseTime(data.time)).format('YYYY-MM-DD HH:mm:ss')
      );
    });

    console.log(map);
  }, [data]);

  return (
    <div className={styles.container}>
      <PriceChartController />
      <div>{hasNextPage ? '있음' : '없음'}</div>
      <button
        onClick={() => {
          fetchNextPage();
        }}
      >
        fetch
      </button>
    </div>
  );
};

export default TestChart;
