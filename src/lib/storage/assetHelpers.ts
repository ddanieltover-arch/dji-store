import { createHash } from 'node:crypto';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
]);

export const ALLOWED_ATTACHMENT_TYPES = new Set([
  ...ALLOWED_IMAGE_TYPES,
  'application/pdf'
]);

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  pdf: 'application/pdf'
};

export function hashBuffer(data: Buffer | Uint8Array): string {
  return createHash('sha256').update(data).digest('hex');
}

export function mimeFromFileName(fileName?: string): string | null {
  if (!fileName) return null;
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext ? EXT_TO_MIME[ext] ?? null : null;
}

export function normalizeContentType(declared?: string, fileName?: string): string | null {
  const mime = (declared ?? mimeFromFileName(fileName) ?? '').split(';')[0].trim().toLowerCase();
  return mime || null;
}

export function isAllowedUploadType(contentType: string, allowPdf = true): boolean {
  const allowed = allowPdf ? ALLOWED_ATTACHMENT_TYPES : ALLOWED_IMAGE_TYPES;
  return allowed.has(contentType);
}

export function maxBytesForType(contentType: string): number {
  return contentType === 'application/pdf' ? MAX_ATTACHMENT_BYTES : MAX_IMAGE_BYTES;
}

export function formatFromContentType(contentType: string): string {
  const subtype = contentType.split('/')[1] ?? 'bin';
  if (subtype === 'jpeg') return 'jpeg';
  return subtype;
}

export class UploadValidationError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = 'UploadValidationError';
  }
}
