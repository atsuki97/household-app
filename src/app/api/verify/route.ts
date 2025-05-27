import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const token = await req.cookies.get('firebase-auth-token')?.value;

    if (!token) return NextResponse.json({ valid: false }, { status: 400 });

    await verifyIdToken(token);

    return NextResponse.json({ valid: true });
  } catch {
    const response = NextResponse.json({ valid: false }, { status: 401 });
    response.cookies.delete('firebase-auth-token');

    return response;
  }
}