import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

interface Token {
  exp: number;
  iat: number;
  id: string;
}

const getRemainingAccessTokenTime = (exp: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expiresIn = exp - currentTime;

  return expiresIn;
};

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const pathname = request.nextUrl.pathname;

  if (pathname.match(/^\/market\/[^/]+\/list$/)) {
    const referer = request.headers.get('referer');

    if (!referer || !referer.includes('/market/')) {
      const url = request.nextUrl.clone();

      // [' ', 'market', 'KRW-BTC', 'list']
      if (pathname.split('/')[1] === 'market' && pathname.split('/')[2]) {
        url.pathname = `/market/${pathname.split('/')[2]}`;
        return NextResponse.redirect(url);
      }
    }
  }

  if (request.cookies.has('accessToken') && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (accessToken) {
    const decoded = jwt.decode(accessToken.value) as Token;

    if (decoded) {
      const expiresIn = getRemainingAccessTokenTime(decoded.exp);

      if (expiresIn < 300 && refreshToken) {
        console.log(`300초미만 재갱신 시작: ${expiresIn}초`);
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                Cookie: `refreshToken=${refreshToken.value}`,
              },
            },
          );

          console.log('res');
          console.log(res);

          if (res.ok) {
            const response = NextResponse.next();
            const responseCookies = new ResponseCookies(res.headers);

            const newAccessToken = responseCookies.get('accessToken');
            const newRefreshToken = responseCookies.get('refreshToken');

            console.log('토큰');
            console.log(newAccessToken);
            console.log(newRefreshToken);

            if (newAccessToken) {
              response.cookies.set('accessToken', newAccessToken.value, {
                httpOnly: newAccessToken.httpOnly,
                sameSite: newAccessToken.sameSite,
                path: newAccessToken.path,
                secure: newAccessToken.secure,
                maxAge: newAccessToken.maxAge,
              });

              console.log(newAccessToken);
            }

            if (newRefreshToken) {
              response.cookies.set('refreshToken', newRefreshToken.value, {
                httpOnly: newRefreshToken.httpOnly,
                sameSite: newRefreshToken.sameSite,
                path: newRefreshToken.path,
                secure: newRefreshToken.secure,
                maxAge: newRefreshToken.maxAge,
              });
              console.log(newRefreshToken);
            }

            return response;
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path',
    '/market/:code',
    '/market/:code/list',
    '/wallet',
    '/orders',
  ],
};
