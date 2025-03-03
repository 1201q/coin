import React from 'react';
import Sidebar from '@/components/common/sidebar/Sidebar';
import styles from './main.module.css';

export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebarContainer}>
          <Sidebar />
        </div>
        <div className={styles.contentsContainer}>{children}</div>
      </div>
    </>
  );
}
