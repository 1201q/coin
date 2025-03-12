'use client';

import Link from 'next/link';
import styles from './marketheader.controller.module.css';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const MarketHeaderController = ({
  token,
  logout,
}: {
  token: string | undefined;
  logout: () => Promise<void>;
}) => {
  if (token) {
    const router = useRouter();
    return (
      <div className={styles.container}>
        <form
          action={() => {
            logout();
            router.refresh();
          }}
        >
          <motion.button
            layoutId="headerButton"
            className={styles.loginButton}
            type="submit"
          >
            로그아웃
          </motion.button>
        </form>
        <div className={styles.profileIcon}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href={'/auth/login'}>
        <motion.button layoutId="headerButton" className={styles.loginButton}>
          로그인
        </motion.button>
      </Link>
    </div>
  );
};

export default MarketHeaderController;
