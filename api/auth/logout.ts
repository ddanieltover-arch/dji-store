import { clearedSessionCookie, deleteSession, json, readToken, withAuthHandler } from '../_lib/auth';

export const config = { runtime: 'nodejs' };

export default withAuthHandler(async (request: Request) => {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  await deleteSession(readToken(request));
  return json({ ok: true }, 200, clearedSessionCookie());
});
