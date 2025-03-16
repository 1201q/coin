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
  const refreshToken = cookie.get('refreshToken')?.value;

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
            Cookie: `refreshToken=${refreshToken}`,
          },
        },
      );

      console.log(response);

      if (!response.ok) {
        throw new Error('로그아웃에 실패했습니다.');
      }

      (await cookies()).delete({
        name: 'accessToken',
        domain: process.env.NEXT_PUBLIC_URL
          ? `.${new URL(process.env.NEXT_PUBLIC_URL).hostname}`
          : '',
      });
      (await cookies()).delete({
        name: 'refreshToken',
        domain: process.env.NEXT_PUBLIC_URL
          ? `.${new URL(process.env.NEXT_PUBLIC_URL).hostname}`
          : '',
      });
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
