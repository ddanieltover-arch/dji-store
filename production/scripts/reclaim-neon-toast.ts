import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
config({ path: path.join(root, '.env.local') });

async function main() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!);

  const rows = await sql`
    SELECT id::text AS id, byte_size, file_name, (data IS NOT NULL) AS has_data,
      EXISTS(SELECT 1 FROM support_attachments s WHERE s.asset_id = db_assets.id) AS is_attachment
    FROM db_assets
    ORDER BY byte_size DESC
    LIMIT 50
  `;
  console.log(rows);

  // Delete product leftover assets (not support attachments) — binaries already on disk
  const deleted = await sql`
    DELETE FROM db_assets a
    WHERE NOT EXISTS (SELECT 1 FROM support_attachments s WHERE s.asset_id = a.id)
    RETURNING a.id::text AS id
  `;
  console.log('deleted non-attachment assets:', deleted.length);

  await sql`DELETE FROM product_media WHERE asset_id IS NOT NULL`;

  try {
    await sql`VACUUM FULL db_assets`;
    console.log('VACUUM FULL ok');
  } catch (e) {
    console.log('VACUUM FULL failed:', e instanceof Error ? e.message : e);
    try {
      await sql`VACUUM db_assets`;
      console.log('VACUUM ok');
    } catch (e2) {
      console.log('VACUUM failed:', e2 instanceof Error ? e2.message : e2);
    }
  }

  const size = await sql`
    SELECT
      pg_size_pretty(pg_database_size(current_database())) AS db_size,
      pg_size_pretty(pg_total_relation_size('db_assets')) AS assets_size,
      (SELECT COUNT(*) FROM db_assets)::int AS rows
  `;
  console.log(size[0]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
