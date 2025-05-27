import { NextRequest, NextResponse } from 'next/server';

// 公開パス（ログイン不要でアクセス可能なパス）
const publicPaths = ['/login', 'robots.txt'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 公開ページの場合はそのまま次へ進む
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // FirebaseトークンをCookieから取得
  const token = req.cookies.get('firebase-auth-token')?.value;

  // トークンがなければログインページへリダイレクト
  if (!token) return NextResponse.redirect(new URL('login', req.url));

  // トークンがある場合はそのまま通過
  return NextResponse.next();
}

// このミドルウェアが適用される対象パスの設定
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};