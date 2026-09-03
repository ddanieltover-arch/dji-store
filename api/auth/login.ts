import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findUserByEmail, verifyPassword, createSession, setSessionCookie } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'missing_fields' });

  const user = await findUserByEmail(String(email));
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });

  const valid = await verifyPassword(String(password), user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'invalid_credentials' });

  const { passwordHash: _, ...safeUser } = user;
  const token = await createSession(user.id);
  setSessionCookie(res, token);
  return res.status(200).json({ user: safeUser });
}
