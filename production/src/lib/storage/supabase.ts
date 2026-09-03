import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getStorageBackend(): 'database' | 'supabase' {
  const backend = (process.env.STORAGE_BACKEND ?? 'database').toLowerCase();
  if (backend === 'supabase') return 'supabase';
  if (backend === 'database') return 'database';
  throw new Error(`Unsupported STORAGE_BACKEND="${backend}" — use "database" or "supabase"`);
}

export function getSupabaseStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'assets';
}

/** Server-only Supabase client (service role) for Storage uploads. */
export function createSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      'Supabase Storage requires NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return client;
}

export function extensionForContentType(contentType: string, fileName?: string): string {
  const fromName = fileName?.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/i.test(fromName) && fromName.length <= 5) {
    return fromName === 'jpg' ? 'jpeg' : fromName;
  }
  const subtype = contentType.split('/')[1]?.split('+')[0] ?? 'bin';
  return subtype === 'jpeg' ? 'jpeg' : subtype;
}
