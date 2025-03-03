import React, { Suspense } from 'react';
import styles from '../../main.module.css';

interface Props {
  children: React.ReactNode;
  info: React.ReactNode;
  chart: React.ReactNode;
  orderform: React.ReactNode;
  header: React.ReactNode;
  modal: React.ReactNode;
}

export default function MarketPageLayout({
  children,
  info,
  chart,
  orderform,
  header,
  modal,
}: Props) {
  return (
    <>
      {modal}
      <div className={styles.contentsContainer}>
        <div className={styles.headerContainer}>{header}</div>
        <div className={styles.marketContainer}>
          <div className={styles.flexContainer}>
            <div className={styles.leftContainer}>
              <div className={styles.centerContainer}>
                <div className={styles.chartContainer}>
                  <Suspense fallback={<div>차트 로딩</div>}>{chart}</Suspense>
                </div>
                <div className={styles.orderbookContainer}>
                  <Suspense fallback={<div>인포 로딩</div>}>{info}</Suspense>
                </div>
              </div>
              <div className={styles.bottomContainer}></div>
            </div>
            <div className={styles.rightContainer}>{orderform}</div>
          </div>
        </div>
      </div>
    </>
  );
}
