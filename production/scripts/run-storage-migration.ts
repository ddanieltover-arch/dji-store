/**
 * Apply Neon migration for Supabase Storage metadata columns.
 *   npx tsx --tsconfig production/tsconfig.json production/scripts/run-storage-migration.ts
 */
import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDb } from '../src/lib/db/client';

const productionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
config({ path: path.join(productionRoot, '.env.local') });

async function main() {
  const sql = createDb();

  await sql`ALTER TABLE db_assets ALTER COLUMN data DROP NOT NULL`;
  await sql`ALTER TABLE db_assets ADD COLUMN IF NOT EXISTS storage_url TEXT`;
  await sql`ALTER TABLE db_assets ADD COLUMN IF NOT EXISTS storage_path TEXT`;

  try {
    await sql`
      ALTER TABLE db_assets
      ADD CONSTRAINT db_assets_has_payload
      CHECK (data IS NOT NULL OR storage_url IS NOT NULL)
    `;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!/already exists/i.test(message)) {
      console.warn('constraint note:', message);
    }
  }

  await sql`
    CREATE INDEX IF NOT EXISTS db_assets_storage_path_idx
    ON db_assets (storage_path)
    WHERE storage_path IS NOT NULL
  `;

  const cols = await sql`
    SELECT column_name, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'db_assets'
    ORDER BY ordinal_position
  `;

  console.log(
    'db_assets columns:',
    cols.map((c) => `${c.column_name}(nullable=${c.is_nullable})`).join(', ')
  );
  console.log('Migration applied.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
