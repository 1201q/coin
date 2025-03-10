import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log(request.cookies);

  return NextResponse.next();
}

//
export const config = {
  matcher: ['/auth'],
};
