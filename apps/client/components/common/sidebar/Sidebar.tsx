'use client';

import Link from 'next/link';
import styles from './sidebar.module.css';
import WalletIcon from '@/public/wallet.svg';
import ChartIcon from '@/public/chart.svg';
import NoteIcon from '@/public/note.svg';
import { motion } from 'framer-motion';

import { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';

const MENU = [
  { id: 'market', href: '/market/KRW-BTC', icon: ChartIcon, label: '정보' },
  { id: 'wallet', href: '/wallet', icon: WalletIcon, label: '지갑' },
  { id: 'orders', href: '/orders', icon: NoteIcon, label: '주문' },
];

export default function Sidebar() {
  const path = usePathname();
  const menu = path.split('/')[1];

  const [hovered, setHovered] = useState<string | null>(null);

  const handleMouseEnter = useCallback((id: string) => {
    setHovered(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  return (
    <>
      <div className={styles.logoContainer}>1</div>
      <nav className={styles.navContainer}>
        {MENU.map(({ id, href, icon: Icon, label }) => (
          <Link
            href={href}
            key={id}
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={handleMouseLeave}
            className={menu === id || hovered === id ? styles.hovered : ''}
          >
            <motion.button className={styles.button} whileTap={{ scale: 0.95 }}>
              <Icon className={styles.svg} />
            </motion.button>
            <p className={styles.buttonText}>{label}</p>
          </Link>
        ))}
      </nav>
    </>
  );
}
