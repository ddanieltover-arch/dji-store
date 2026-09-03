import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findUserByEmail, createUser, createSession, setSessionCookie } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { email, password, firstName, lastName } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'missing_fields' });

  try {
    const existing = await findUserByEmail(String(email));
    if (existing) return res.status(409).json({ error: 'email_taken' });

    const user = await createUser({
      email: String(email),
      password: String(password),
      firstName: firstName ? String(firstName) : undefined,
      lastName: lastName ? String(lastName) : undefined,
    });

    const token = await createSession(user.id);
    setSessionCookie(res, token);
    return res.status(200).json({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'signup_failed';
    return res.status(400).json({ error: message });
  }
}
