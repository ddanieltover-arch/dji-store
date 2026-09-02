import { neon, neonConfig } from '@neondatabase/serverless';
import { resolveDataMode } from '../../../../src/lib/migration/wave12Production';
import type { DataMode } from '../../../../src/types/wave12Production';

neonConfig.fetchConnectionCache = true;

export function getDataMode(): DataMode {
  return resolveDataMode(process.env.DATA_MODE);
}

function requireDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL;
  if (!url) {
    throw new Error('Missing DATABASE_URL (Neon Postgres connection string)');
  }
  return url;
}

/** Server-only SQL client for Neon Postgres. Never import from Client Components. */
export function createDb() {
  return neon(requireDatabaseUrl());
}

export type DbClient = ReturnType<typeof createDb>;
