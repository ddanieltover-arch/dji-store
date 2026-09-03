import {
  createSession,
  findUserByEmail,
  json,
  parseJsonBody,
  sessionCookie,
  verifyPassword,
  withAuthHandler
} from '../_lib/auth';

export const config = { runtime: 'nodejs' };

export default withAuthHandler(async (request: Request) => {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const body = await parseJsonBody(request);
  const email = String(body.email ?? '');
  const password = String(body.password ?? '');
  if (!email.trim() || !password) return json({ error: 'missing_fields' }, 400);

  const user = await findUserByEmail(email);
  if (!user) return json({ error: 'invalid_credentials' }, 401);

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return json({ error: 'invalid_credentials' }, 401);

  const { passwordHash: _hash, ...safeUser } = user;
  const token = await createSession(user.id);
  return json({ user: safeUser }, 200, sessionCookie(token));
});
