import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link href={'/market/KRW-BTC'}>
        <button>마켓으로</button>
      </Link>
      <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
        로그인
      </Link>
    </div>
  );
}
