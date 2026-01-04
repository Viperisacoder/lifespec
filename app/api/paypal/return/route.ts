import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tx = searchParams.get('tx');

  if (!tx) {
    return NextResponse.redirect(
      new URL('/?blocked=1', request.url)
    );
  }

  const response = NextResponse.redirect(
    new URL('/signup?via=paypal', request.url)
  );

  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set('ls_paypal_return', '1', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60,
  });

  response.cookies.set('ls_paypal_tx', tx, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60,
  });

  return response;
}
