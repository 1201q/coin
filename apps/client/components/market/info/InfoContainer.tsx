'use client';

import Tab from '@/components/common/tab/Tab';
import { useState } from 'react';

import styles from './info.module.css';
import Orderbook from './orderbook/Orderbook';
import Trade from './trade/Trade';

interface Props {
  orderbook: React.ReactNode;
  trade: React.ReactNode;
}

export default function InfoContainer({ orderbook, trade }: Props) {
  const tabs = ['호가', '거래내역'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className={styles.container}>
      <Tab
        tabs={tabs}
        selectedTab={selectedTab}
        onClick={(tab) => setSelectedTab(tab)}
        tabId="infotab"
      />
      {selectedTab === tabs[0] && <Orderbook>{orderbook}</Orderbook>}
      {selectedTab === tabs[1] && <Trade>{trade}</Trade>}
    </div>
  );
}
