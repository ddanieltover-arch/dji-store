-- Option A: Neon keeps metadata; binaries may live in Supabase Storage.
-- Run against Neon after deploying the storage backend change:
--   psql "$DATABASE_URL_UNPOOLED" -f neon/migrations/001_supabase_storage_metadata.sql

ALTER TABLE db_assets ALTER COLUMN data DROP NOT NULL;

ALTER TABLE db_assets
  ADD COLUMN IF NOT EXISTS storage_url TEXT,
  ADD COLUMN IF NOT EXISTS storage_path TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'db_assets_has_payload'
  ) THEN
    ALTER TABLE db_assets
      ADD CONSTRAINT db_assets_has_payload
      CHECK (data IS NOT NULL OR storage_url IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS db_assets_storage_path_idx ON db_assets (storage_path)
  WHERE storage_path IS NOT NULL;
