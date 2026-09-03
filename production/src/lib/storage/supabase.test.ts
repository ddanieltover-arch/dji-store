import { describe, expect, it, afterEach } from 'vitest';
import { extensionForContentType, getStorageBackend } from './supabase';

describe('supabase storage helpers', () => {
  const original = process.env.STORAGE_BACKEND;

  afterEach(() => {
    if (original === undefined) delete process.env.STORAGE_BACKEND;
    else process.env.STORAGE_BACKEND = original;
  });

  it('defaults to database backend', () => {
    delete process.env.STORAGE_BACKEND;
    expect(getStorageBackend()).toBe('database');
  });

  it('accepts supabase backend', () => {
    process.env.STORAGE_BACKEND = 'supabase';
    expect(getStorageBackend()).toBe('supabase');
  });

  it('maps content types to file extensions', () => {
    expect(extensionForContentType('image/jpeg', 'receipt.jpg')).toBe('jpeg');
    expect(extensionForContentType('application/pdf', 'wire.pdf')).toBe('pdf');
    expect(extensionForContentType('image/png')).toBe('png');
  });
});
