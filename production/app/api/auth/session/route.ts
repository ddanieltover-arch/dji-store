import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSessionToken, readSessionToken } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const user = await getUserFromSessionToken(readSessionToken(req));
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
