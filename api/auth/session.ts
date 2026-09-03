import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readToken, getUserFromToken } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });

  const user = await getUserFromToken(readToken(req));
  if (!user) return res.status(401).json({ user: null });
  return res.status(200).json({ user });
}
