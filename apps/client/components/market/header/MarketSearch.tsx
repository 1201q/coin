'use client';

import Image from 'next/image';
import styles from './marketsearch.module.css';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { marketAtom } from '@/store/atom';
import { isSearchDialogOpenAtom } from '@/store/ui';

interface Props {
  market: string;
}

export default function MarketSearch({ market }: Props) {
  const code = market.split('-')[1];
  const getMarket = useAtomValue(marketAtom);
  const [isDialogOpen, setIsDialogOpen] = useAtom(isSearchDialogOpenAtom);

  return (
    <div
      className={styles.container}
      onClick={() => {
        setIsDialogOpen((prev) => !prev);
      }}
    >
      <div className={styles.searchContainer}>
        <div className={styles.logoContainer}>
          <Image
            src={`https://static.upbit.com/logos/${code}.png`}
            width={20}
            height={20}
            alt="logo"
            quality={100}
          />
        </div>
        <div className={styles.textContainer}>
          <p>{getMarket(market)?.korean_name}</p>
        </div>
      </div>
    </div>
  );
}
