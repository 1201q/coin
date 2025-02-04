'use client';

import Image from 'next/image';
import styles from './marketsearch.module.css';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAtomValue } from 'jotai';
import { marketAtom } from '@/store/atom';

interface Props {
  market: string;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MarketSearch({
  market,
  isDialogOpen,
  setIsDialogOpen,
}: Props) {
  const code = market.split('-')[1];
  const getMarket = useAtomValue(marketAtom);

  return (
    <div
      className={styles.container}
      onClick={() => setIsDialogOpen((prev) => !prev)}
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
