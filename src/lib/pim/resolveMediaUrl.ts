import staticAssetManifestJson from '../../data/staticAssetManifest.json';

const staticAssetManifest = staticAssetManifestJson as Record<string, string>;

const ASSET_ID_RE = /\/api\/assets\/([0-9a-f-]{36})/i;

function extensionForAsset(assetId: string): string | undefined {
  return staticAssetManifest[assetId];
}

/** Map a database asset reference to a URL the storefront can load. */
export function resolveMediaUrl(url?: string): string | undefined {
  if (!url) return undefined;

  const match = url.match(ASSET_ID_RE);
  if (!match) {
    if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
      const relative = url.replace(/^https?:\/\/[^/]+/, '');
      return resolveMediaUrl(relative);
    }
    return url;
  }

  const assetId = match[1];
  const ext = extensionForAsset(assetId);
  if (ext) {
    return `/media/assets/${assetId}.${ext}`;
  }

  const apiBase =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
    '';

  if (apiBase) {
    return `${String(apiBase).replace(/\/$/, '')}/api/assets/${assetId}`;
  }

  return `/api/assets/${assetId}`;
}

export function resolveMediaUrls(urls: string[] | undefined): string[] {
  if (!urls?.length) return [];
  return urls.map((url) => resolveMediaUrl(url)).filter((url): url is string => Boolean(url));
}

export function hasStaticAsset(assetId: string): boolean {
  return Boolean(extensionForAsset(assetId));
}
