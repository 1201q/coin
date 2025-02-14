'use client';
import styles from './info.module.css';

export default function Decider({ children }: { children: React.ReactNode }) {
  return <div className={styles.contents}>{children}</div>;
}
