'use client';

import Tab from '@/components/common/tab/Tab';
import { useEffect, useState } from 'react';

import styles from './info.module.css';
import OrderbookClient from './orderbook/OrderbookClient';
import { TradeData } from '@/types/upbit';
import TradeClient from './trade/TradeClient';
import { useHydrateAtoms } from 'jotai/utils';
import { hydratedTradeAtom, tradeAtom } from '@/store/websocket';
import { useAtom, useAtomValue } from 'jotai';

interface Props {
  data: TradeData[];
  code: string;
}

export default function InfoComponent({ data, code }: Props) {
  const tabs = ['호가', '체결'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  useHydrateAtoms([[hydratedTradeAtom, data]], {
    dangerouslyForceHydrate: true,
  });

  const hydratedData = useAtomValue(hydratedTradeAtom, { delay: 0 });
  const [tradeData, setTradeData] = useAtom(tradeAtom);

  useEffect(() => {
    if (
      tradeData.length <= 10 ||
      tradeData[tradeData.length - 1].code !== code
    ) {
      setTradeData(hydratedData);
    }
  }, [hydratedData, tradeData, setTradeData]);

  return (
    <div className={styles.container}>
      <Tab
        tabs={tabs}
        selectedTab={selectedTab}
        onClick={(tab: string) => setSelectedTab(tab)}
        tabId="infotab"
      />
      {selectedTab === tabs[0] && <OrderbookClient code={code} />}
      {selectedTab === tabs[1] && <TradeClient code={code} />}
    </div>
  );
}
