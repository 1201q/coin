'use client';

import { useEffect, useState } from 'react';
import styles from './order.module.css';
import Tab from '@/components/common/tab/Tab';
import OrderForm from './OrderForm';
import React from 'react';

const OrderClient = ({ code }: { code: string }) => {
  const tabs = ['매수', '매도'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className={styles.container}>
      <Tab
        tabs={tabs}
        selectedTab={selectedTab}
        onClick={(tab: string) => setSelectedTab(tab)}
        tabId="orderTab"
        flex1={true}
        colors={['rgb(240, 97, 109)', 'rgba(0, 82, 254, 0.7)']}
      />
      <OrderForm selectedTab={selectedTab} code={code} />
    </div>
  );
};

export default React.memo(OrderClient);
