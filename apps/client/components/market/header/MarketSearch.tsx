'use client';

import Image from 'next/image';
import styles from './marketsearch.module.css';
import { useAtom, useAtomValue } from 'jotai';
import { loadableMarketAtom } from '@/store/atom';
import { isSearchDialogOpenAtom } from '@/store/ui';

interface Props {
  market: string;
}

export default function MarketSearch({ market }: Props) {
  const code = market.split('-')[1];

  const getMarket = useAtomValue(loadableMarketAtom);
  const [isDialogOpen, setIsDialogOpen] = useAtom(isSearchDialogOpenAtom);

  return (
    <div
      className={styles.container}
      onClick={() => {
        setIsDialogOpen((prev) => !prev);
      }}
    >
      <div
        className={`${styles.searchContainer} ${isDialogOpen ? styles.open : ''}`}
      >
        <div className={styles.logoContainer}>
          <Image
            src={`https://static.upbit.com/logos/${code}.png`}
            width={20}
            height={20}
            alt="logo"
            quality={100}
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
