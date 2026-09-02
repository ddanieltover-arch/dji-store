import { fetchProductBySlug } from '../../../../src/lib/catalog/repository';
import { AlertSubscribeForm } from '@/components/AlertSubscribeForm';

export const revalidate = 60;

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await fetchProductBySlug(slug).catch(() => null);
  if (!product) {
    return (
      <main style={{ padding: '1.5rem' }}>
        <h1>Product not found</h1>
        <p>Catalog must resolve from Neon Postgres products — no production mock catalog.</p>
      </main>
    );
  }
  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>{product.model_name}</h1>
      <p>SKU {product.sku}</p>
      <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>€{product.base_price_eur}</p>
      <p style={{ fontSize: 12, color: '#6b7280' }}>
        Live price/stock require online inventory API — never implied from offline cache.
      </p>
      <AlertSubscribeForm locale={locale} productId={product.id} productName={product.model_name} productSlug={product.slug} />
    </main>
  );
}
