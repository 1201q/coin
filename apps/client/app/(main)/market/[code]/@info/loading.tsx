import styles from './loading.module.css';

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.tabMenuContainer}>
          <span className={styles.tab}></span>
          <span className={styles.tab}></span>
        </div>
      </div>
      <div className={styles.listContainer}>
        <div className={styles.leftContainer}>
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className={styles.orderbookrRowContainer}>
              <div className={styles.sideRowLoading}></div>
            </div>
          ))}
        </div>
        <div className={styles.centerContainer}>
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className={styles.orderbookrRowContainer}>
              <div className={styles.centerRowLoading}></div>
            </div>
          ))}
        </div>
        <div className={styles.rightContainer}>
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className={styles.orderbookrRowContainer}>
              <div className={styles.sideRowLoading}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
