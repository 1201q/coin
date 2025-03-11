import Link from 'next/link';
import styles from './login.module.css';

import Image from 'next/image';

export default async function LoginPage() {
  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <p className={styles.logoContainer}>COINGOSU</p>
      </header>
      <div className={styles.loginContainer}>
        <div className={styles.centerBox}>
          <p className={styles.welcomeText}>로그인하고 더 많은 기능을</p>
          <p className={styles.welcomeText}>이용해보세요</p>
          <div className={styles.buttonContainer}>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
              <button className={styles.socialButton}>
                <div className={styles.socialLogoContainer}>
                  <Image
                    src={'/google-logo.png'}
                    alt="googleLogo"
                    width={25}
                    height={25}
                  />
                </div>
                <p>구글로 로그인하기</p>
              </button>
            </Link>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
              <button className={styles.socialButton}>
                <div className={styles.socialLogoContainer}>
                  <Image
                    src={'/naver-logo.png'}
                    alt="naverLogo"
                    width={25}
                    height={25}
                  />
                </div>
                <p>네이버로 로그인하기</p>
              </button>
            </Link>
          </div>
          <div className={styles.divider}>
            <p>또는</p>
            <span></span>
          </div>
          <div className={styles.nonuserContainer}>
            <Link href={'/'}>
              <p>가입없이 체험 계정으로 할래요</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
