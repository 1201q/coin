import styles from './loading.module.css';

function getRandomPercentage(min: number, max: number) {
  if (min >= max) {
    throw new Error('min 값은 max 값보다 작아야 합니다.');
  }

  const randomValue = Math.random() * (max - min) + min;
  return `${randomValue.toFixed()}%`;
}

const Item = () => {
  return (
    <div className={styles.listContainer}>
      {/* 코인명 */}
      <div className={`${styles.listBox} ${styles.left}`}>
        <div className={styles.logoBox}></div>
        <div className={styles.flex}>
          <span
            className={styles.text}
            style={{ width: getRandomPercentage(40, 90) }}
          ></span>
          <span
            style={{ width: getRandomPercentage(20, 35) }}
            className={`${styles.text} ${styles.small}`}
          ></span>
        </div>
      </div>
      {/* 현재가 */}
      <div className={styles.listBox}>
        <div className={`${styles.flex} ${styles.right}`}>
          <span
            style={{ width: getRandomPercentage(45, 90) }}
            className={`${styles.text}`}
          ></span>
        </div>
      </div>
      {/* 어제보디 */}
      <div className={styles.listBox}>
        <div className={`${styles.flex} ${styles.right}`}>
          <span
            className={`${styles.text}`}
            style={{ width: getRandomPercentage(60, 70) }}
          ></span>
        </div>
      </div>
      {/* 거래대금 */}
      <div className={styles.listBox}>
        <div className={`${styles.flex} ${styles.right}`}>
          <span style={{ width: '80%' }} className={`${styles.text}`}></span>
          <span
            style={{ width: '20%' }}
            className={`${styles.text} ${styles.small}`}
          ></span>
        </div>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dialogContainer}>
        {/* title */}
        <div className={styles.titleContainer}>
          <div className={styles.tabmenuContainer}>
            <div className={`${styles.tabmenu}`}></div>
            <div className={`${styles.tabmenu}`} style={{ width: '30%' }}></div>
          </div>
          <div className={styles.searchContainer}>
            <div className={styles.inputBox}></div>
          </div>
        </div>
        {/* 리스트 헤더 */}
        <div className={styles.listHeaderContainer}>
          <div className={`${styles.listHeaderBox} ${styles.left}`}>
            <span
              style={{ width: '52%' }}
              className={`${styles.listHeaderText}`}
            ></span>
          </div>
          <div className={styles.listHeaderBox}>
            <span
              className={styles.listHeaderText}
              style={{ width: '40%' }}
            ></span>
          </div>
          <div className={styles.listHeaderBox}>
            <span
              className={styles.listHeaderText}
              style={{ width: '55%' }}
            ></span>
          </div>
          <div className={styles.listHeaderBox}>
            <span
              className={styles.listHeaderText}
              style={{ width: '55%' }}
            ></span>
          </div>
        </div>
        {/* 코인 리스트 */}
        <div className={styles.contentsContainer}>
          {[...Array(11)].map((_, index) => (
            <Item key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
