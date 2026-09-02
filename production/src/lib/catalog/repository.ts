import {
  CatalogRow,
  loadCatalog,
  mapProductToCatalogRow,
  resolveDataMode
} from '../../../../src/lib/migration/wave12Production';
import { createDb } from '../db/client';

/**
 * Production catalog reader.
 * DATA_MODE=production never falls back to Vite DJI_PRODUCTS module.
 */
export async function fetchPublishedCatalog(): Promise<{ rows: CatalogRow[]; source: string }> {
  const dataMode = resolveDataMode(process.env.DATA_MODE);

  if (dataMode === 'production' || dataMode === 'migration') {
    try {
      const sql = createDb();
      const data = await sql`
        SELECT id, slug, sku, model_name, category, base_price_eur, published
        FROM products
        WHERE published = TRUE
      `;
      const rows = data as CatalogRow[];
      const loaded = loadCatalog({ dataMode: 'production', supabaseRows: rows });
      if (loaded.mockUsed) {
        throw new Error('Mock catalog forbidden in production path');
      }
      return { rows: loaded.rows, source: loaded.source };
    } catch (err) {
      if (dataMode === 'production') {
        throw err instanceof Error ? err : new Error('Catalog fetch failed');
      }
      // migration only: allow empty until credentials exist
      return { rows: [], source: 'pending_credentials' };
    }
  }

  // prototype mode — explicit, never used for djii.eu production traffic
  const { DJI_PRODUCTS } = await import('../../../../src/data/products');
  return {
    rows: DJI_PRODUCTS.map(mapProductToCatalogRow),
    source: 'prototype_seed'
  };
}

export async function fetchProductBySlug(slug: string): Promise<CatalogRow | null> {
  const { rows } = await fetchPublishedCatalog();
  return rows.find((r) => r.slug === slug) ?? null;
}
