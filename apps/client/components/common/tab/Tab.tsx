'use client';

import styles from './tab.module.css';

import { motion } from 'framer-motion';

interface Props {
  tabs: string[];
  onClick: (tab: string) => void;
  tabId: string;
  selectedTab: string;
  flex1?: boolean;
  colors?: string[];
}

export default function Tab({
  tabs,
  onClick,
  selectedTab,
  tabId,
  flex1 = false,
  colors,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={`${styles.tabMenuContainer}`}>
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => onClick(tab)}
            className={`${styles.tabmenu} ${flex1 ? styles.flex1 : ''} ${selectedTab === tab ? styles.selected : ''}`}
          >
            <span
              style={
                colors && colors[index] && selectedTab === tab
                  ? { color: colors[index] }
                  : {}
              }
            >
              {tab}
            </span>
            {selectedTab === tab && (
              <motion.div
                layoutId={tabId}
                className={styles.indicator}
                style={
                  colors && colors[index]
                    ? { backgroundColor: colors[index] }
                    : {}
                }
                transition={{ duration: 0.2, type: 'tween' }}
              ></motion.div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
