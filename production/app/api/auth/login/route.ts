import { NextRequest, NextResponse } from 'next/server';
import { badRequest, parseBody, requireFields } from '@/lib/api/helpers';
import { attachSessionCookie, createSession } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users';
import { verifyPassword } from '@/lib/auth/password';

export async function POST(req: NextRequest) {
  const body = await parseBody<Record<string, unknown>>(req);
  const missing = requireFields(body, ['email', 'password']);
  if (missing) return badRequest(`missing_${missing}`);

  const email = String(body.email);
  const password = String(body.password);

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const { passwordHash: _hash, ...safeUser } = user;
  const token = await createSession(user.id);
  const res = NextResponse.json({ user: safeUser });
  attachSessionCookie(res, token);
  return res;
}
