import Sidebar from '@/components/common/sidebar/Sidebar';
import styles from './main.module.css';
import Header from '@/components/common/header/Header';
import InfoServer from '@/components/market/info/InfoServer';
import ChartClient from '@/components/market/chart/ChartClient';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function MarketCodePage(props: Props) {
  const { code } = await props.params;

  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentsContainer}>
        <div className={styles.headerContainer}>
          <Header market={code} />
        </div>
        <div className={styles.marketContainer}>
          <div className={styles.flexContainer}>
            <div className={styles.leftContainer}>
              <div className={styles.centerContainer}>
                <div className={styles.chartContainer}>
                  <ChartClient code={code} />
                </div>
                <div className={styles.orderbookContainer}>
                  <InfoServer code={code} />
                </div>
              </div>
              <div className={styles.bottomContainer}>3123</div>
            </div>
            <div className={styles.rightContainer}>1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
