import { describe, expect, it } from 'vitest';
import {
  formatFromContentType,
  hashBuffer,
  isAllowedUploadType,
  maxBytesForType,
  mimeFromFileName,
  normalizeContentType,
  UploadValidationError
} from '@shared/lib/storage/assetHelpers';

describe('database asset helpers', () => {
  it('hashes buffers deterministically', () => {
    const data = Buffer.from('hello');
    expect(hashBuffer(data)).toHaveLength(64);
    expect(hashBuffer(data)).toBe(hashBuffer(data));
  });

  it('resolves content types from file names', () => {
    expect(mimeFromFileName('hero.webp')).toBe('image/webp');
    expect(normalizeContentType(undefined, 'gallery.jpg')).toBe('image/jpeg');
    expect(normalizeContentType('image/png; charset=binary', 'x.bin')).toBe('image/png');
  });

  it('allows images and optional PDFs', () => {
    expect(isAllowedUploadType('image/png')).toBe(true);
    expect(isAllowedUploadType('application/pdf')).toBe(true);
    expect(isAllowedUploadType('application/pdf', false)).toBe(false);
    expect(isAllowedUploadType('application/zip')).toBe(false);
  });

  it('applies size limits by type', () => {
    expect(maxBytesForType('image/jpeg')).toBe(10 * 1024 * 1024);
    expect(maxBytesForType('application/pdf')).toBe(25 * 1024 * 1024);
  });

  it('maps content types to product_media format', () => {
    expect(formatFromContentType('image/jpeg')).toBe('jpeg');
    expect(formatFromContentType('image/webp')).toBe('webp');
  });

  it('exposes validation error codes', () => {
    const err = new UploadValidationError('file_too_large');
    expect(err.code).toBe('file_too_large');
  });
});
