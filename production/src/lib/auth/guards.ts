import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { AuthUser } from './types';
import { getUserFromSessionToken, readSessionToken } from './session';

export async function requireAuth(req: NextRequest): Promise<AuthUser | NextResponse> {
  const user = await getUserFromSessionToken(readSessionToken(req));
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<AuthUser | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  return result;
}

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return user?.role === 'admin';
}
