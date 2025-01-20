import Header from "@/components/Header";
import styles from "./main.module.css";
import Widget from "@/components/widget/Widget";
import Sidebar from "@/components/Sidebar";
import TradeServer from "@/components/widget/trade/TradeServer";

interface Props {
  params: Promise<{ code: string }>;
}
interface MarketData {
  market: string;
  korean_name: string;
  english_name: string;
}

export default async function Home(props: Props) {
  const { code } = await props.params;
  const res = await fetch("https://api.bithumb.com/v1/market/all", {
    next: { revalidate: 300 },
  });
  const marketList: MarketData[] = await res.json();
  const currentMarket = marketList.find(
    (item: MarketData) => item.market.split("-")[1] === code
  );

  if (!currentMarket) {
    throw new Error("market code not found");
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentsContainer}>
        <Header currentMarket={currentMarket} marketList={marketList} />
        <div className={styles.widgetsContainer}>
          <Widget title="차트">
            <div>1</div>
          </Widget>
          <div className={styles.flex}>
            <div className={styles.widgets}>
              <Widget title="호가"><div></div></Widget>
              <Widget title="주문"><div></div></Widget>
            </div>
            <div className={styles.bottomWidget}>
              <Widget title="시세">
                <TradeServer currentMarket={currentMarket} />
              </Widget>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
