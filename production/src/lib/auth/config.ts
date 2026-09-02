export const SESSION_COOKIE = 'dji_session';
export const SESSION_TTL_DAYS = 30;

export function sessionMaxAgeSeconds(): number {
  return SESSION_TTL_DAYS * 24 * 60 * 60;
}

/** Emails that receive admin role on signup (comma-separated ADMIN_EMAILS + ADMIN_EMAIL). */
export function adminEmailAllowlist(): Set<string> {
  const emails = new Set<string>();
  const single = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (single) emails.add(single);
  const list = process.env.ADMIN_EMAILS?.split(',') ?? [];
  for (const entry of list) {
    const normalized = entry.trim().toLowerCase();
    if (normalized) emails.add(normalized);
  }
  return emails;
}

export function resolveRoleForEmail(email: string): 'customer' | 'admin' {
  return adminEmailAllowlist().has(email.trim().toLowerCase()) ? 'admin' : 'customer';
}
