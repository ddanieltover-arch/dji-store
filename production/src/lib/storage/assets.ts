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

export type StoredAsset = {
  id: string;
  contentType: string;
  fileName: string | null;
  contentHash: string;
  byteSize: number;
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

function assertDatabaseStorage(): void {
  const backend = (process.env.STORAGE_BACKEND ?? 'database').toLowerCase();
  if (backend !== 'database') {
    throw new Error(`Unsupported STORAGE_BACKEND="${backend}" — only "database" is configured`);
  }
}

function toStoredAsset(row: Record<string, unknown>): StoredAsset {
  return {
    id: String(row.id),
    contentType: String(row.content_type),
    fileName: row.file_name ? String(row.file_name) : null,
    contentHash: String(row.content_hash),
    byteSize: Number(row.byte_size)
  };
}

function withPublicUrl(asset: StoredAsset): StoredAssetWithUrl {
  return { ...asset, url: assetPublicUrl(asset.id) };
}

/** Persist binary data in Postgres db_assets (BYTEA). */
export async function storeAsset(args: {
  data: Buffer | Uint8Array;
  contentType: string;
  fileName?: string;
  contentHash: string;
}): Promise<StoredAsset> {
  assertDatabaseStorage();
  const sql = createDb();
  const bytes = Buffer.from(args.data);
  const rows = await sql`
    INSERT INTO db_assets (content_type, file_name, data, content_hash, byte_size)
    VALUES (${args.contentType}, ${args.fileName ?? null}, ${bytes}, ${args.contentHash}, ${bytes.byteLength})
    ON CONFLICT (content_hash) DO UPDATE SET content_type = EXCLUDED.content_type
    RETURNING id, content_type, file_name, content_hash, byte_size
  `;
  return toStoredAsset(rows[0] as Record<string, unknown>);
}

/** Validate and store an uploaded file buffer in db_assets. */
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

/** Download a remote image/file and persist it in db_assets (deduped by hash). */
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

/** Link a stored asset to a product_media row. */
export async function linkProductMedia(args: {
  productId: string;
  assetId: string;
  role: string;
  contentHash: string;
  contentType: string;
  sourceUrl?: string;
}): Promise<{ id: string }> {
  assertDatabaseStorage();
  const sql = createDb();
  const format = formatFromContentType(args.contentType);
  const rows = await sql`
    INSERT INTO product_media (product_id, role, asset_id, source_url, cdn_url, content_hash, format)
    VALUES (
      ${args.productId},
      ${args.role},
      ${args.assetId}::uuid,
      ${args.sourceUrl ?? null},
      ${args.sourceUrl ?? null},
      ${args.contentHash},
      ${format}
    )
    RETURNING id
  `;
  return { id: String(rows[0].id) };
}

/** Link a stored asset to a support_attachments row (RMA, warranty, checkout receipts). */
export async function linkSupportAttachment(args: {
  ownerType: string;
  ownerId: string;
  assetId: string;
  fileName: string;
  mimeType: string;
}): Promise<{ id: string }> {
  assertDatabaseStorage();
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

/** Read binary asset from Postgres. */
export async function fetchAsset(id: string): Promise<{ data: Buffer; contentType: string; fileName: string | null } | null> {
  assertDatabaseStorage();
  const sql = createDb();
  const rows = await sql`
    SELECT data, content_type, file_name
    FROM db_assets
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  if (!rows.length) return null;
  const row = rows[0];
  return {
    data: Buffer.from(row.data as Uint8Array),
    contentType: String(row.content_type),
    fileName: row.file_name ? String(row.file_name) : null
  };
}

/** Public URL for a database-stored asset (served via API route). */
export function assetPublicUrl(assetId: string): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const base = site.replace(/\/$/, '');
  return base ? `${base}${assetServePath(assetId)}` : assetServePath(assetId);
}

/** Relative path served by /api/assets/[id] — safe for catalog cache and Vite proxy. */
export function assetServePath(assetId: string): string {
  return `/api/assets/${assetId}`;
}
