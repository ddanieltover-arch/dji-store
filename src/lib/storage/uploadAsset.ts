import { resolveApiBaseUrl } from './apiBase';

export type UploadedAsset = {
  id: string;
  url: string;
  contentType: string;
  fileName: string | null;
  contentHash: string;
  byteSize: number;
};

export type UploadAssetOptions = {
  file: File;
  productId?: string;
  role?: string;
  ownerType?: string;
  ownerId?: string;
  sourceUrl?: string;
  allowPdf?: boolean;
};

export async function uploadAsset(options: UploadAssetOptions): Promise<UploadedAsset> {
  const formData = new FormData();
  formData.append('file', options.file);
  if (options.productId) formData.append('productId', options.productId);
  if (options.role) formData.append('role', options.role);
  if (options.ownerType) formData.append('ownerType', options.ownerType);
  if (options.ownerId) formData.append('ownerId', options.ownerId);
  if (options.sourceUrl) formData.append('sourceUrl', options.sourceUrl);
  if (options.allowPdf === false) formData.append('allowPdf', 'false');

  const response = await fetch(`${resolveApiBaseUrl()}/api/assets/upload`, {
    method: 'POST',
    body: formData
  });

  const payload = (await response.json()) as { error?: string; asset?: UploadedAsset };
  if (!response.ok || !payload.asset) {
    throw new Error(payload.error ?? 'upload_failed');
  }

  return payload.asset;
}
