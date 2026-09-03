import {
  createSession,
  createUser,
  findUserByEmail,
  json,
  parseJsonBody,
  sessionCookie,
  withAuthHandler
} from '../_lib/auth';

export const config = { runtime: 'nodejs' };

export default withAuthHandler(async (request: Request) => {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const body = await parseJsonBody(request);
  const email = String(body.email ?? '');
  const password = String(body.password ?? '');
  if (!email.trim() || !password) return json({ error: 'missing_fields' }, 400);

  const existing = await findUserByEmail(email);
  if (existing) return json({ error: 'email_taken' }, 409);

  const user = await createUser({
    email,
    password,
    firstName: body.firstName ? String(body.firstName) : undefined,
    lastName: body.lastName ? String(body.lastName) : undefined
  });

  const token = await createSession(user.id);
  return json({ user }, 200, sessionCookie(token));
});
