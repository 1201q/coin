import { cookies } from 'next/headers';
import Link from 'next/link';

const getUserProfile = () => {};

export default async function Home() {
  const cookie = (await cookies()).get('accessToken');

  if (cookie) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${cookie.value}` },
      credentials: 'include',
    });

    const data = await res.json();
    console.log(data);

    return (
      <div>
        <Link href={'/market/KRW-BTC'}>
          <button>쿠키가잇다. </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href={'/market/KRW-BTC'}>
        <button>없다.</button>
      </Link>
    </div>
  );
}
