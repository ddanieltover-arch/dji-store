const { neon } = require('@neondatabase/serverless');

function requireDatabaseUrl() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;
  if (!url) throw new Error('Missing DATABASE_URL');
  return url;
}

function createDb() {
  return neon(requireDatabaseUrl());
}

async function ensureAuthTables() {
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
}

async function ensureOrdersTable() {
  const sql = createDb();
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      customer_id TEXT NOT NULL,
      idempotency_key TEXT NOT NULL UNIQUE,
      payment_intent_id TEXT,
      status TEXT NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders (customer_id)`;
  await sql`CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC)`;
}

module.exports = { createDb, ensureAuthTables, ensureOrdersTable };
