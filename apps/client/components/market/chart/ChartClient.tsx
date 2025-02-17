'use client';

import Tab from '@/components/common/tab/Tab';
import { useState } from 'react';
import styles from './chart.module.css';
import PriceChart from './pricechart/PriceChart';

const ChartClient = ({ code }: { code: string }) => {
  const tabs = ['차트', '뎁스'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className={styles.container}>
      <Tab
        tabs={tabs}
        selectedTab={selectedTab}
        onClick={(tab: string) => setSelectedTab(tab)}
        tabId="chartTab"
      />
      {selectedTab === tabs[0] && <PriceChart code={code} />}
      {/* {selectedTab === tabs[1] && <TradeClient code={code} />} */}
    </div>
  );
};

export default ChartClient;
