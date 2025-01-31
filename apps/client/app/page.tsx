import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/market/BTC"}>
        <button>마켓으로</button>
      </Link>
    </div>
  );
}
