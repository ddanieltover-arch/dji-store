import { NextRequest, NextResponse } from 'next/server';
import { badRequest, parseBody, requireFields } from '@/lib/api/helpers';
import { attachSessionCookie, createSession } from '@/lib/auth/session';
import { createUser, findUserByEmail } from '@/lib/auth/users';

export async function POST(req: NextRequest) {
  const body = await parseBody<Record<string, unknown>>(req);
  const missing = requireFields(body, ['email', 'password']);
  if (missing) return badRequest(`missing_${missing}`);

  const email = String(body.email);
  const password = String(body.password);

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'email_taken' }, { status: 409 });
    }

    const user = await createUser({
      email,
      password,
      firstName: body.firstName ? String(body.firstName) : undefined,
      lastName: body.lastName ? String(body.lastName) : undefined
    });

    const token = await createSession(user.id);
    const res = NextResponse.json({ user });
    attachSessionCookie(res, token);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'signup_failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
