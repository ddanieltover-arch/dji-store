import bcrypt from 'bcryptjs';
import { createDb, ensureAuthTables } from './db';

export type UserRole = 'customer' | 'admin';
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
}

const SESSION_COOKIE = 'dji_session';
const SESSION_TTL_DAYS = 30;
const BCRYPT_ROUNDS = 12;

function sessionMaxAge() {
  return SESSION_TTL_DAYS * 24 * 60 * 60;
}

function adminEmails(): Set<string> {
  const s = new Set<string>();
  const single = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (single) s.add(single);
  for (const e of process.env.ADMIN_EMAILS?.split(',') ?? []) {
    const n = e.trim().toLowerCase();
    if (n) s.add(n);
  }
  return s;
}

function resolveRole(email: string): UserRole {
  return adminEmails().has(email.trim().toLowerCase()) ? 'admin' : 'customer';
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return toHex(digest);
}

function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let bin = '';
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function normalizeEmail(e: string) {
  return e.trim().toLowerCase();
}

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
};

function mapUser(r: UserRow): AuthUser {
  return {
    id: r.id,
    email: r.email,
    role: r.role,
    firstName: r.first_name,
    lastName: r.last_name
  };
}

export async function findUserByEmail(email: string) {
  await ensureAuthTables();
  const sql = createDb();
  const rows = await sql`
    SELECT id, email, password_hash, role, first_name, last_name
    FROM users
    WHERE lower(email) = ${normalizeEmail(email)}
    LIMIT 1
  `;
  if (!rows.length) return null;
  const r = rows[0] as UserRow;
  return { ...mapUser(r), passwordHash: r.password_hash };
}

export async function createUser(args: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  await ensureAuthTables();
  const normalized = normalizeEmail(args.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('Enter a valid email address');
  }
  if (args.password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  const role = resolveRole(normalized);
  const pw = await hashPassword(args.password);
  const sql = createDb();
  const rows = await sql`
    INSERT INTO users (email, password_hash, role, first_name, last_name)
    VALUES (
      ${normalized},
      ${pw},
      ${role},
      ${args.firstName?.trim() || null},
      ${args.lastName?.trim() || null}
    )
    RETURNING id, email, role, first_name, last_name
  `;
  return mapUser(rows[0] as UserRow);
}

export async function createSession(userId: string): Promise<string> {
  await ensureAuthTables();
  const sql = createDb();
  const token = generateSessionToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + sessionMaxAge() * 1000);
  await sql`
    INSERT INTO auth_sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;
  return token;
}

export async function deleteSession(token: string | null) {
  if (!token) return;
  await ensureAuthTables();
  const sql = createDb();
  await sql`DELETE FROM auth_sessions WHERE token_hash = ${await hashToken(token)}`;
}

export async function getUserFromToken(token: string | null): Promise<AuthUser | null> {
  if (!token) return null;
  await ensureAuthTables();
  const sql = createDb();
  const tokenHash = await hashToken(token);
  const rows = await sql`
    SELECT u.id, u.email, u.role, u.first_name, u.last_name
    FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > now()
    LIMIT 1
  `;
  if (!rows.length) return null;
  return mapUser(rows[0] as UserRow);
}

export function readToken(request: Request): string | null {
  const raw = request.headers.get('cookie') ?? '';
  const match = raw.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${sessionMaxAge()}; Secure`;
}

export function clearedSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Secure`;
}

export function json(data: unknown, status = 200, cookie?: string): Response {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (cookie) headers.append('Set-Cookie', cookie);
  return new Response(JSON.stringify(data), { status, headers });
}

export async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function withAuthHandler(
  fn: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    try {
      return await fn(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'internal_error';
      return json({ error: message }, 500);
    }
  };
}
