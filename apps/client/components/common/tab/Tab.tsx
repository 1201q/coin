'use client';

import styles from './tab.module.css';

import { motion } from 'framer-motion';

interface Props {
  tabs: string[];
  onClick: (tab: string) => void;
  tabId: string;
  selectedTab: string;
}

export default function Tab({ tabs, onClick, selectedTab, tabId }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.tabMenuContainer}>
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => onClick(tab)}
            className={`${styles.tabmenu} ${selectedTab === tab ? styles.selected : ''}`}
          >
            <span>{tab}</span>
            {selectedTab === tab && (
              <motion.div
                layoutId={tabId}
                className={styles.indicator}
                transition={{ duration: 0.2, type: 'tween' }}
              ></motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
