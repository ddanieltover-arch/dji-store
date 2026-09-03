import { neon, neonConfig } from '@neondatabase/serverless';

neonConfig.fetchConnectionCache = true;

function requireDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL;
  if (!url) throw new Error('Missing DATABASE_URL');
  return url;
}

export function createDb() {
  return neon(requireDatabaseUrl());
}
