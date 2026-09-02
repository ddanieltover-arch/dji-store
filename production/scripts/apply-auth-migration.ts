/**
 * Apply auth migration to Neon Postgres.
 * Usage: npx tsx --tsconfig production/tsconfig.json production/scripts/apply-auth-migration.ts
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createDb } from '../src/lib/db/client';

config({ path: resolve(process.cwd(), 'production/.env.local') });

async function main() {
  const sql = createDb();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
      first_name TEXT,
      last_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS users_email_idx ON users (lower(email))`;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS auth_sessions_user_idx ON auth_sessions (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS auth_sessions_expires_idx ON auth_sessions (expires_at)`;

  console.log('Auth migration applied.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
