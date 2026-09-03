import { NextRequest, NextResponse } from 'next/server';
import { fetchAsset } from '@/lib/storage/assets';

/**
 * Serve an asset by id.
 * - Supabase-backed rows redirect to the public Storage URL
 * - Legacy Neon BYTEA rows stream bytes from Postgres
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const asset = await fetchAsset(id);
  if (!asset) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (asset.storageUrl) {
    return NextResponse.redirect(asset.storageUrl, 302);
  }

  if (!asset.data.byteLength) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return new NextResponse(asset.data, {
    status: 200,
    headers: {
      'Content-Type': asset.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      ...(asset.fileName ? { 'Content-Disposition': `inline; filename="${asset.fileName}"` } : {})
    }
  });
}
