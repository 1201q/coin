import Link from 'next/link';
import styles from './marketheader.controller.module.css';

const MarketHeaderController = () => {
  return (
    <div className={styles.container}>
      <Link href={'/auth/login'}>
        <button className={styles.loginButton}>로그인</button>
      </Link>
    </div>
  );
};

export default MarketHeaderController;
