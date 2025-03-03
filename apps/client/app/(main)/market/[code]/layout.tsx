import React from 'react';
import styles from '../../main.module.css';

interface Props {
  children: React.ReactNode;
  info: React.ReactNode;
  chart: React.ReactNode;
  orderform: React.ReactNode;
  header: React.ReactNode;
}

export default function MarketPageLayout({
  children,
  info,
  chart,
  orderform,
  header,
}: Props) {
  return (
    <div className={styles.contentsContainer}>
      <div className={styles.headerContainer}>{header}</div>
      <div className={styles.marketContainer}>
        <div className={styles.flexContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.centerContainer}>
              <div className={styles.chartContainer}>{chart}</div>
              <div className={styles.orderbookContainer}>{info}</div>
            </div>
            <div className={styles.bottomContainer}>3123</div>
          </div>
          <div className={styles.rightContainer}>{orderform}</div>
        </div>
      </div>
    </div>
  );
}
