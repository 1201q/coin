import { NextResponse, NextRequest } from "next/server";

interface MarketType {
  market: string;
  korean_name: string;
  english_name: string;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const headers = new Headers(req.headers);

  const code = pathname.split("/")[2]?.toUpperCase() || "";

  const res = await fetch("https://api.bithumb.com/v1/market/all");
  const data = await res.json();

  const krw: string[] = data
    .filter((item: MarketType) => item.market.startsWith("KRW-"))
    .map((item: MarketType) => item.market.split("-")[1]);

  const isValid = krw.includes(code);

  if (isValid && pathname === `/market/${code}`) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();

  if (isValid) {
    url.pathname = `/market/${code}`;
  } else {
    url.pathname = "/market/BTC";
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/market/:path*",
};
