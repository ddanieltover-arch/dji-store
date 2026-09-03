import { randomUUID } from 'node:crypto';
import {
  formatFromContentType,
  hashBuffer,
  isAllowedUploadType,
  maxBytesForType,
  mimeFromFileName,
  normalizeContentType,
  UploadValidationError
} from '@shared/lib/storage/assetHelpers';
import { createDb } from '../db/client';
import {
  createSupabaseAdmin,
  extensionForContentType,
  getStorageBackend,
  getSupabaseStorageBucket
} from './supabase';

export type StoredAsset = {
  id: string;
  contentType: string;
  fileName: string | null;
  contentHash: string;
  byteSize: number;
  storageUrl?: string | null;
  storagePath?: string | null;
};

export type StoredAssetWithUrl = StoredAsset & { url: string };

export {
  ALLOWED_ATTACHMENT_TYPES,
  ALLOWED_IMAGE_TYPES,
  formatFromContentType,
  hashBuffer,
  isAllowedUploadType,
  maxBytesForType,
  MAX_ATTACHMENT_BYTES,
  MAX_IMAGE_BYTES,
  mimeFromFileName,
  normalizeContentType,
  UploadValidationError
} from '@shared/lib/storage/assetHelpers';

function toStoredAsset(row: Record<string, unknown>): StoredAsset {
  return {
    id: String(row.id),
    contentType: String(row.content_type),
    fileName: row.file_name ? String(row.file_name) : null,
    contentHash: String(row.content_hash),
    byteSize: Number(row.byte_size),
    storageUrl: row.storage_url ? String(row.storage_url) : null,
    storagePath: row.storage_path ? String(row.storage_path) : null
  };
}

function withPublicUrl(asset: StoredAsset): StoredAssetWithUrl {
  return { ...asset, url: assetPublicUrl(asset) };
}

async function findAssetByHash(contentHash: string): Promise<StoredAsset | null> {
  const sql = createDb();
  const rows = await sql`
    SELECT id, content_type, file_name, content_hash, byte_size, storage_url, storage_path
    FROM db_assets
    WHERE content_hash = ${contentHash}
    LIMIT 1
  `;
  if (!rows.length) return null;
  return toStoredAsset(rows[0] as Record<string, unknown>);
}

/** Persist binary in Postgres BYTEA (legacy / fallback). */
async function storeAssetInDatabase(args: {
  data: Buffer;
  contentType: string;
  fileName?: string;
  contentHash: string;
}): Promise<StoredAsset> {
  const sql = createDb();
  const rows = await sql`
    INSERT INTO db_assets (content_type, file_name, data, content_hash, byte_size)
    VALUES (${args.contentType}, ${args.fileName ?? null}, ${args.data}, ${args.contentHash}, ${args.data.byteLength})
    ON CONFLICT (content_hash) DO UPDATE SET content_type = EXCLUDED.content_type
    RETURNING id, content_type, file_name, content_hash, byte_size, storage_url, storage_path
  `;
  return toStoredAsset(rows[0] as Record<string, unknown>);
}

/** Upload binary to Supabase Storage; Neon only stores metadata (no BYTEA). */
async function storeAssetInSupabase(args: {
  data: Buffer;
  contentType: string;
  fileName?: string;
  contentHash: string;
}): Promise<StoredAsset> {
  const existing = await findAssetByHash(args.contentHash);
  if (existing?.storageUrl) {
    return existing;
  }

  const supabase = createSupabaseAdmin();
  const bucket = getSupabaseStorageBucket();
  const ext = extensionForContentType(args.contentType, args.fileName);
  const objectId = randomUUID();
  const storagePath = `uploads/${objectId}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, args.data, {
    contentType: args.contentType,
    upsert: false,
    cacheControl: '31536000'
  });

  if (uploadError) {
    throw new Error(`supabase_upload_failed: ${uploadError.message}`);
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  const storageUrl = publicData.publicUrl;

  const sql = createDb();
  const rows = await sql`
    INSERT INTO db_assets (content_type, file_name, data, content_hash, byte_size, storage_url, storage_path)
    VALUES (
      ${args.contentType},
      ${args.fileName ?? null},
      NULL,
      ${args.contentHash},
      ${args.data.byteLength},
      ${storageUrl},
      ${storagePath}
    )
    ON CONFLICT (content_hash) DO UPDATE SET
      content_type = EXCLUDED.content_type,
      storage_url = COALESCE(EXCLUDED.storage_url, db_assets.storage_url),
      storage_path = COALESCE(EXCLUDED.storage_path, db_assets.storage_path)
    RETURNING id, content_type, file_name, content_hash, byte_size, storage_url, storage_path
  `;

  return toStoredAsset(rows[0] as Record<string, unknown>);
}

/** Persist binary according to STORAGE_BACKEND (database | supabase). */
export async function storeAsset(args: {
  data: Buffer | Uint8Array;
  contentType: string;
  fileName?: string;
  contentHash: string;
}): Promise<StoredAsset> {
  const bytes = Buffer.from(args.data);
  const payload = {
    data: bytes,
    contentType: args.contentType,
    fileName: args.fileName,
    contentHash: args.contentHash
  };

  if (getStorageBackend() === 'supabase') {
    return storeAssetInSupabase(payload);
  }
  return storeAssetInDatabase(payload);
}

/** Validate and store an uploaded file buffer. */
export async function ingestUploadedFile(args: {
  data: Buffer | Uint8Array;
  contentType?: string;
  fileName?: string;
  allowPdf?: boolean;
}): Promise<StoredAssetWithUrl> {
  const bytes = Buffer.from(args.data);
  const contentType = normalizeContentType(args.contentType, args.fileName);
  if (!contentType) {
    throw new UploadValidationError('unsupported_type');
  }
  if (!isAllowedUploadType(contentType, args.allowPdf ?? true)) {
    throw new UploadValidationError('unsupported_type');
  }
  if (bytes.byteLength === 0) {
    throw new UploadValidationError('empty_file');
  }
  if (bytes.byteLength > maxBytesForType(contentType)) {
    throw new UploadValidationError('file_too_large');
  }

  const stored = await storeAsset({
    data: bytes,
    contentType,
    fileName: args.fileName,
    contentHash: hashBuffer(bytes)
  });
  return withPublicUrl(stored);
}

/** Download a remote image/file and persist it (deduped by hash). */
export async function ingestAssetFromUrl(sourceUrl: string, fileName?: string): Promise<StoredAssetWithUrl> {
  const absoluteUrl = sourceUrl.startsWith('/')
    ? `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3015').replace(/\/$/, '')}${sourceUrl}`
    : sourceUrl;

  const response = await fetch(absoluteUrl, {
    headers: { 'User-Agent': 'DJI-Store-EU-AssetIngest/1.0', Accept: 'image/*,application/pdf' }
  });
  if (!response.ok) {
    throw new UploadValidationError('fetch_failed');
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType =
    normalizeContentType(response.headers.get('content-type') ?? undefined, fileName) ??
    mimeFromFileName(absoluteUrl);

  return ingestUploadedFile({
    data: buffer,
    contentType: contentType ?? undefined,
    fileName: fileName ?? absoluteUrl.split('?')[0].split('/').pop(),
    allowPdf: true
  });
}

/** Link a stored asset to a product_media row (Neon metadata). */
export async function linkProductMedia(args: {
  productId: string;
  assetId: string;
  role: string;
  contentHash: string;
  contentType: string;
  sourceUrl?: string;
}): Promise<{ id: string }> {
  const sql = createDb();
  const format = formatFromContentType(args.contentType);
  const publicUrl = args.sourceUrl ?? assetServePath(args.assetId);
  const rows = await sql`
    INSERT INTO product_media (product_id, role, asset_id, source_url, cdn_url, content_hash, format)
    VALUES (
      ${args.productId},
      ${args.role},
      ${args.assetId}::uuid,
      ${args.sourceUrl ?? null},
      ${publicUrl},
      ${args.contentHash},
      ${format}
    )
    RETURNING id
  `;
  return { id: String(rows[0].id) };
}

/** Link a stored asset to a support_attachments row (receipts, RMA, warranty). */
export async function linkSupportAttachment(args: {
  ownerType: string;
  ownerId: string;
  assetId: string;
  fileName: string;
  mimeType: string;
}): Promise<{ id: string }> {
  const sql = createDb();
  const id = `att-${Date.now()}`;
  await sql`
    INSERT INTO support_attachments (id, owner_type, owner_id, file_name, mime_type, asset_id)
    VALUES (
      ${id},
      ${args.ownerType},
      ${args.ownerId},
      ${args.fileName},
      ${args.mimeType},
      ${args.assetId}::uuid
    )
  `;
  return { id };
}

/** Read asset bytes from Neon BYTEA, or null if stored externally. */
export async function fetchAsset(
  id: string
): Promise<{ data: Buffer; contentType: string; fileName: string | null; storageUrl?: string | null } | null> {
  const sql = createDb();
  const rows = await sql`
    SELECT data, content_type, file_name, storage_url
    FROM db_assets
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0];
  const storageUrl = row.storage_url ? String(row.storage_url) : null;

  if (row.data == null) {
    return {
      data: Buffer.alloc(0),
      contentType: String(row.content_type),
      fileName: row.file_name ? String(row.file_name) : null,
      storageUrl
    };
  }

  return {
    data: Buffer.from(row.data as Uint8Array),
    contentType: String(row.content_type),
    fileName: row.file_name ? String(row.file_name) : null,
    storageUrl
  };
}

/** Public URL for a stored asset (Supabase public URL or local API path). */
export function assetPublicUrl(assetOrId: StoredAsset | string): string {
  if (typeof assetOrId !== 'string') {
    if (assetOrId.storageUrl) return assetOrId.storageUrl;
    return assetPublicUrl(assetOrId.id);
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const base = site.replace(/\/$/, '');
  return base ? `${base}${assetServePath(assetOrId)}` : assetServePath(assetOrId);
}

/** Relative path served by /api/assets/[id] — fallback when no external URL. */
export function assetServePath(assetId: string): string {
  return `/api/assets/${assetId}`;
}
