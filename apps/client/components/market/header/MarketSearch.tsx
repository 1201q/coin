'use client';

import Image from 'next/image';
import styles from './marketsearch.module.css';
import { useAtomValue } from 'jotai';
import { loadableMarketAtom } from '@/store/atom';

import { useRouter, usePathname } from 'next/navigation';

interface Props {
  market: string;
}

export default function MarketSearch({ market }: Props) {
  const code = market.split('-')[1];
  const router = useRouter();
  const pathname = usePathname();

  const getMarket = useAtomValue(loadableMarketAtom);

  return (
    <div
      className={styles.container}
      onClick={() => {
        router.push(`/market/${market}/list`);
      }}
    >
      <div
        className={`${styles.searchContainer} ${pathname.split('/')[3] === 'list' ? styles.open : ''}`}
      >
        <div className={styles.logoContainer}>
          <Image
            width={19}
            height={19}
            src={`https://static.upbit.com/logos/${code}.png`}
            alt="logo"
            quality={100}
            priority
          />
        </div>
        {getMarket.state === 'loading' ? (
          <div className={styles.loadingContainer}></div>
        ) : (
          <div className={styles.textContainer}>
            <span className={styles.korea}>
              {getMarket.state === 'hasData' &&
                getMarket.data(market)?.korean_name}
            </span>
            <span className={styles.slash}>/</span>
            <span className={styles.code}>{code}</span>
          </div>
        )}
      </div>
    </div>
  );
}
