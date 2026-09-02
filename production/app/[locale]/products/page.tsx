import Link from 'next/link';
import { fetchPublishedCatalog } from '../../../src/lib/catalog/repository';

export const revalidate = 60;

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let rows: { id: string; slug: string; model_name: string; category: string; base_price_eur: number }[] = [];
  let source = 'error';
  let errorMsg = '';
  try {
    const result = await fetchPublishedCatalog();
    rows = result.rows;
    source = result.source;
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : 'catalog_unavailable';
  }

  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>Products</h1>
      <p style={{ fontSize: 12, color: '#6b7280' }}>Source: {source || errorMsg}</p>
      <ul>
        {rows.map((p) => (
          <li key={p.id}>
            <Link href={`/${locale}/products/${p.slug}`}>
              {p.model_name} — €{p.base_price_eur} ({p.category})
            </Link>
          </li>
        ))}
      </ul>
      {!rows.length && <p>No published products (check DATABASE_URL / DATA_MODE).</p>}
    </main>
  );
}
