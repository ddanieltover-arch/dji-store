import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import { createDb } from '../db/client';
import type { AuthUser } from './types';
import { SESSION_COOKIE, sessionMaxAgeSeconds } from './config';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function readSessionToken(req: NextRequest): string | null {
  return req.cookies.get(SESSION_COOKIE)?.value ?? null;
}

export async function readSessionTokenFromCookies(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export function attachSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionMaxAgeSeconds()
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}

type UserRow = {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  first_name: string | null;
  last_name: string | null;
};

function mapUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    firstName: row.first_name,
    lastName: row.last_name
  };
}

export async function createSession(userId: string): Promise<string> {
  const sql = createDb();
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + sessionMaxAgeSeconds() * 1000);

  await sql`
    INSERT INTO auth_sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;

  return token;
}

export async function deleteSession(token: string | null): Promise<void> {
  if (!token) return;
  const sql = createDb();
  await sql`DELETE FROM auth_sessions WHERE token_hash = ${hashToken(token)}`;
}

export async function getUserFromSessionToken(token: string | null): Promise<AuthUser | null> {
  if (!token) return null;
  const sql = createDb();
  const tokenHash = hashToken(token);

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

export async function purgeExpiredSessions(): Promise<void> {
  const sql = createDb();
  await sql`DELETE FROM auth_sessions WHERE expires_at <= now()`;
}
