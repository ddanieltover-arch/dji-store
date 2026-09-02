import { createDb } from '../db/client';
import { resolveRoleForEmail } from './config';
import { hashPassword, validatePassword } from './password';
import type { AuthUser, UserRole } from './types';

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
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

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  const normalized = normalizeEmail(email);
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return 'Enter a valid email address';
  }
  return null;
}

export async function findUserByEmail(email: string): Promise<(AuthUser & { passwordHash: string }) | null> {
  const sql = createDb();
  const normalized = normalizeEmail(email);
  const rows = await sql`
    SELECT id, email, password_hash, role, first_name, last_name
    FROM users
    WHERE lower(email) = ${normalized}
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0] as UserRow;
  return { ...mapUser(row), passwordHash: row.password_hash };
}

export async function createUser(args: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}): Promise<AuthUser> {
  const emailError = validateEmail(args.email);
  if (emailError) throw new Error(emailError);

  const passwordError = validatePassword(args.password);
  if (passwordError) throw new Error(passwordError);

  const normalized = normalizeEmail(args.email);
  const role = args.role ?? resolveRoleForEmail(normalized);
  const passwordHash = await hashPassword(args.password);
  const sql = createDb();

  const rows = await sql`
    INSERT INTO users (email, password_hash, role, first_name, last_name)
    VALUES (
      ${normalized},
      ${passwordHash},
      ${role},
      ${args.firstName?.trim() || null},
      ${args.lastName?.trim() || null}
    )
    RETURNING id, email, role, first_name, last_name
  `;

  return mapUser(rows[0] as UserRow);
}
