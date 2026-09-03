import { getUserFromToken, json, readToken, withAuthHandler } from '../_lib/auth';

export const config = { runtime: 'nodejs' };

export default withAuthHandler(async (request: Request) => {
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
  const user = await getUserFromToken(readToken(request));
  if (!user) return json({ user: null }, 401);
  return json({ user });
});
