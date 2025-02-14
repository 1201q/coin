'use client';

import Tab from '@/components/common/tab/Tab';
import { useState } from 'react';

import styles from './info.module.css';
import Decider from './Decider';
import TradeClient from './trade/TradeClient';
import OrderbookClient from './orderbook/OrderbookClient';

interface Props {
  orderbook?: React.ReactNode;
  trade?: React.ReactNode;
  code: string;
}

export default function InfoContainer({ trade, code }: Props) {
  const tabs = ['호가', '거래내역'];
  const [selectedTab, setSelectedTab] = useState(tabs[1]);

  return (
    <div className={styles.container}>
      <Tab
        tabs={tabs}
        selectedTab={selectedTab}
        onClick={(tab: string) => setSelectedTab(tab)}
        tabId="infotab"
      />
      {selectedTab === tabs[0] && <OrderbookClient />}
      {selectedTab === tabs[1] && trade}
    </div>
  );
}
