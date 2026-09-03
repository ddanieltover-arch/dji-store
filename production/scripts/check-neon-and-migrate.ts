import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
config({ path: path.join(root, '.env.local') });

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) throw new Error('no db url');
  const sql = neon(url);

  const size = await sql`
    SELECT
      pg_size_pretty(pg_database_size(current_database())) AS db_size,
      pg_size_pretty(pg_total_relation_size('db_assets')) AS assets_size,
      (SELECT COUNT(*) FROM db_assets)::int AS asset_rows
  `;
  console.log('size', size[0]);

  const cols = await sql`
    SELECT column_name, is_nullable, data_type
    FROM information_schema.columns
    WHERE table_name = 'db_assets'
    ORDER BY ordinal_position
  `;
  console.log('columns', cols);

  try {
    await sql`VACUUM db_assets`;
    console.log('vacuum ok');
  } catch (e) {
    console.log('vacuum failed', e instanceof Error ? e.message : e);
  }

  try {
    await sql`ALTER TABLE db_assets ALTER COLUMN data DROP NOT NULL`;
    console.log('drop not null ok');
  } catch (e) {
    console.log('drop not null', e instanceof Error ? e.message : e);
  }

  try {
    await sql`ALTER TABLE db_assets ADD COLUMN IF NOT EXISTS storage_url TEXT`;
    console.log('storage_url ok');
  } catch (e) {
    console.log('storage_url', e instanceof Error ? e.message : e);
  }

  try {
    await sql`ALTER TABLE db_assets ADD COLUMN IF NOT EXISTS storage_path TEXT`;
    console.log('storage_path ok');
  } catch (e) {
    console.log('storage_path', e instanceof Error ? e.message : e);
  }

  const size2 = await sql`
    SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size
  `;
  console.log('size after', size2[0]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
