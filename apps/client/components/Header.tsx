import styles from "./Header.module.css";
import StarIcon from "../public/icons/search.svg";

interface MarketData {
  market: string;
  korean_name: string;
  english_name: string;
}

export default function Header({
  currentMarket,
  marketList,
}: {
  currentMarket: MarketData;
  marketList: MarketData[];
}) {
  console.log(currentMarket, marketList);
  return (
    <header className={styles.container}>
      <div className={styles.searchBox}>
        <StarIcon width={15} height={15} />
        <p>{currentMarket.korean_name}</p>
      </div>
      <div className={styles.infoBox}>
        <div className={styles.info}>
          <span className={styles.infoHeader}>종가</span>
          <span className={styles.infoData}>70.07</span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoHeader}>등락률</span>
          <span className={styles.infoData}>0.54%</span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoHeader}>거래량(24h)</span>
          <span className={styles.infoData}>거래대금(24h)</span>
        </div>
        <div className={styles.info}>
          <span className={styles.infoHeader}>거래대금(24h)</span>
          <span className={styles.infoData}>거래대금(24h)</span>
        </div>
      </div>
    </header>
  );
}
