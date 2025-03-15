import React from 'react';
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
                <section
                  className={`${styles.section} ${styles.chartContainer}`}
                >
                  {chart}
                </section>
                <section
                  className={`${styles.section} ${styles.orderbookContainer}`}
                >
                  {info}
                </section>
              </div>
              <section
                className={`${styles.section} ${styles.bottomContainer}`}
              ></section>
            </div>
            <section className={`${styles.section} ${styles.rightContainer}`}>
              {orderform}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
