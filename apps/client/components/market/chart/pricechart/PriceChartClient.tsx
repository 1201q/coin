import { useAtom, useAtomValue } from 'jotai';
import styles from './pricechart.module.css';
import PriceChartController from './PriceChartController';
import { coinAtom, hydratedCoinAtom } from '@/store/chart';
import { Suspense, useEffect } from 'react';
import { useHydrateAtoms } from 'jotai/utils';
import PriceChart from './PriceChart';

const PriceChartClient = ({ code }: { code: string }) => {
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

  return (
    <div className={styles.container}>
      <PriceChartController code={code} />
      <Suspense fallback={<div>로딩</div>}>
        <PriceChart code={code} />
      </Suspense>
    </div>
  );
};

export default PriceChartClient;
