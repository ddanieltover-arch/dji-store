import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, deleteSession, readSessionToken } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  const token = readSessionToken(req);
  await deleteSession(token);
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
