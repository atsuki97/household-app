import { verifyIdToken } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // トークンがない場合エラーを返す
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'トークンが未提供です' },
        { status: 400 },
      );
    }

    await verifyIdToken(token);

    const response = NextResponse.json({ success: true });
    response.cookies.set('firebase-auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 15,
      path: '/',
    });

    return response;
  } catch {
    const response = NextResponse.json({ success: false }, { status: 401 });
    response.cookies.delete('firebase-auth-token');
    return response;
  }
}