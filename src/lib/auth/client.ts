export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
}

async function parseJson<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON from ${res.url || 'auth API'}, got ${contentType || res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchSession(): Promise<AuthUser | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('/api/auth/session', {
      credentials: 'include',
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await parseJson<{ user: AuthUser | null }>(res);
    return data.user;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseJson<{ user?: AuthUser; error?: string }>(res);
    if (!res.ok) return { error: data.error ?? 'login_failed' };
    return { user: data.user };
  } catch {
    return { error: 'Could not reach the login service. Please try again.' };
  }
}

export async function signup(args: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ user?: AuthUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });
    const data = await parseJson<{ user?: AuthUser; error?: string }>(res);
    if (!res.ok) return { error: data.error ?? 'signup_failed' };
    return { user: data.user };
  } catch {
    return { error: 'Could not reach the signup service. Please try again.' };
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}

export const ADMIN_VIEW_MODES = [
  'admin',
  'ai-operations',
  'security-ops',
  'sre-ops',
  'qa-ops',
  'launch-ops',
  'blueprint-ops',
  'pim-ops',
  'merch-ops',
  'personalization-ops',
  'lifecycle-ops',
  'enterprise-ops',
  'service-ops',
  'knowledge-ops',
  'mobile-ops',
  'migration-ops'
] as const;

export type AdminViewMode = (typeof ADMIN_VIEW_MODES)[number];

export function isAdminViewMode(mode: string): mode is AdminViewMode {
  return (ADMIN_VIEW_MODES as readonly string[]).includes(mode);
}
