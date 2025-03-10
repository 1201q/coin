import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link href={'/market/KRW-BTC'}>
        <button>마켓으로</button>
      </Link>

      <Link href={'https://api.coingosu.live/auth/google'}>로그인</Link>
    </div>
  );
}
