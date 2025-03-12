import MarketHeaderController from '@/components/market/header/MarketHeaderController';
import styles from './header.module.css';
import MarketHeader from '@/components/market/header/MarketHeader';
import { cookies } from 'next/headers';

interface Props {
  market: string;
}

export default async function Header({ market }: Props) {
  const cookie = await cookies();
  const accessToken = cookie.get('accessToken')?.value;

  const logout = async () => {
    'use server';

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(response);

      if (!response.ok) {
        throw new Error('로그아웃에 실패했습니다.');
      }

      (await cookies()).delete('accessToken');
      (await cookies()).delete('refreshToken');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <MarketHeader market={market} />
      </div>
      <div className={styles.controlContainer}>
        <MarketHeaderController token={accessToken} logout={logout} />
      </div>
    </div>
  );
}
