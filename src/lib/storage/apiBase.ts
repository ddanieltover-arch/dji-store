/** Resolve the production API origin for uploads and asset URLs. */
export function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  const fromEnv =
    (typeof process !== 'undefined' && process.env.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL);

  const base = String(fromEnv ?? '').trim();
  if (base) return base.replace(/\/$/, '');

  return 'http://localhost:3015';
}

export function assetUrl(assetId: string): string {
  return `${resolveApiBaseUrl()}/api/assets/${assetId}`;
}
