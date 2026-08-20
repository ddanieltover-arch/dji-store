/**
 * Next.js 15 / Vite-edge compatible security primitives for djii.eu.
 * Intended for middleware, API routes, and webhook receivers.
 */

export const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site'
};

export const CONTENT_SECURITY_POLICY =
  "default-src 'self'; " +
  "script-src 'self' 'nonce-{NONCE}' https://js.stripe.com https://challenges.cloudflare.com; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https:; " +
  "connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.openai.com https://generativelanguage.googleapis.com; " +
  "frame-src https://js.stripe.com https://challenges.cloudflare.com; " +
  "base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

export interface RateLimitBucket {
  key: string;
  windowMs: number;
  max: number;
  hits: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

export function consumeRateLimit(key: string, max: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { key, windowMs, max, hits: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  existing.hits += 1;
  if (existing.hits > max) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: max - existing.hits };
}

export async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyWebhookSignature(
  secret: string,
  payload: string,
  providedHex: string,
  timestampSeconds: number,
  maxSkewSeconds = 300
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampSeconds) > maxSkewSeconds) {
    return false;
  }
  const expected = await hmacSha256Hex(secret, `${timestampSeconds}.${payload}`);
  if (expected.length !== providedHex.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ providedHex.charCodeAt(i);
  }
  return mismatch === 0;
}

export function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader?.startsWith('Bearer ')) return null;
  return authorizationHeader.slice(7).trim() || null;
}

export type ApiSurface = 'public' | 'admin' | 'ai' | 'webhook';

export const API_RATE_LIMITS: Record<ApiSurface, { max: number; windowMs: number }> = {
  public: { max: 60, windowMs: 60_000 },
  admin: { max: 120, windowMs: 60_000 },
  ai: { max: 20, windowMs: 60_000 },
  webhook: { max: 300, windowMs: 60_000 }
};
