'use client';

import Image from 'next/image';
import styles from './marketsearch.module.css';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  code: string;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MarketSearch({
  code,
  isDialogOpen,
  setIsDialogOpen,
}: Props) {
  return (
    <div
      className={styles.container}
      onClick={() => setIsDialogOpen((prev) => !prev)}
    >
      <div className={styles.searchContainer}>
        <div className={styles.logoContainer}>
          <Image
            src={'https://static.upbit.com/logos/BTC.png'}
            width={20}
            height={20}
            alt="logo"
            quality={100}
          />
        </div>
        <div className={styles.textContainer}>
          <p>{'비트코인'}</p>
        </div>
      </div>
    </div>
  );
}
