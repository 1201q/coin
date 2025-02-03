'use client';

import styles from './marketinfo.module.css';

export default function MarketInfo() {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <span className={styles.header}>어제보다</span>
        <div className={styles.textContainer}>
          <span className={styles.text}>100000원</span>
          <span className={`${styles.text} ${styles.blue}`}>-0.92%</span>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.header}>거래량(24H)</span>
        <div className={styles.textContainer}>
          <span className={styles.text}>100000원</span>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.header}>거래대금(24H)</span>
        <div className={styles.textContainer}>
          <span className={styles.text}>100000원</span>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.header}>고가(24H)</span>
        <div className={styles.textContainer}>
          <span className={`${styles.text} ${styles.red}`}>100000원</span>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.header}>저가(24H)</span>
        <div className={styles.textContainer}>
          <span className={`${styles.text} ${styles.blue}`}>100000원</span>
        </div>
      </div>
    </div>
  );
}
