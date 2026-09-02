import { NextResponse } from 'next/server';
import { fetchPublishedCatalog } from '@/lib/catalog/repository';
import { productCacheTags } from '@shared/lib/performance/cacheTopology';

export async function GET() {
  const { rows, source } = await fetchPublishedCatalog();
  if (source === 'prototype_seed') {
    return NextResponse.json({ error: 'prototype_seed_forbidden_on_api' }, { status: 503 });
  }
  const res = NextResponse.json({ source, products: rows });
  const tags = rows.slice(0, 1).flatMap((r) => productCacheTags(r.sku, r.category, 'en'));
  res.headers.set('Cache-Tag', tags.join(','));
  res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return res;
}
