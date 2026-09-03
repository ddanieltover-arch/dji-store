import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readToken, deleteSession, clearSessionCookie } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const token = readToken(req);
  await deleteSession(token);
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
