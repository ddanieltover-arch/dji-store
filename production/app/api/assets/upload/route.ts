import { NextRequest, NextResponse } from 'next/server';
import { badRequest } from '@/lib/api/helpers';
import {
  ingestUploadedFile,
  linkProductMedia,
  linkSupportAttachment,
  UploadValidationError
} from '@/lib/storage/assets';

const PRODUCT_MEDIA_ROLES = new Set(['hero', 'gallery', 'cutout', 'video', 'spin360']);

/** Upload images/files into Postgres db_assets (BYTEA). */
export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return badRequest('invalid_form_data');
  }

  const fileField = formData.get('file');
  if (!fileField || typeof fileField === 'string') {
    return badRequest('missing_file');
  }

  const fileName = fileField.name || undefined;
  const allowPdf = formData.get('allowPdf') !== 'false';

  try {
    const buffer = Buffer.from(await fileField.arrayBuffer());
    const asset = await ingestUploadedFile({
      data: buffer,
      contentType: fileField.type || undefined,
      fileName,
      allowPdf
    });

    const productId = String(formData.get('productId') ?? '').trim();
    const role = String(formData.get('role') ?? '').trim();
    const ownerType = String(formData.get('ownerType') ?? '').trim();
    const ownerId = String(formData.get('ownerId') ?? '').trim();
    const sourceUrl = String(formData.get('sourceUrl') ?? '').trim() || undefined;

    let productMediaId: string | undefined;
    if (productId && role) {
      if (!PRODUCT_MEDIA_ROLES.has(role)) {
        return badRequest('invalid_role');
      }
      const linked = await linkProductMedia({
        productId,
        assetId: asset.id,
        role,
        contentHash: asset.contentHash,
        contentType: asset.contentType,
        sourceUrl
      });
      productMediaId = linked.id;
    }

    let attachmentId: string | undefined;
    if (ownerType && ownerId) {
      const linked = await linkSupportAttachment({
        ownerType,
        ownerId,
        assetId: asset.id,
        fileName: asset.fileName ?? fileName ?? 'upload',
        mimeType: asset.contentType
      });
      attachmentId = linked.id;
    }

    return NextResponse.json({
      ok: true,
      asset,
      productMediaId,
      attachmentId
    });
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return badRequest(err.code);
    }
    throw err;
  }
}
