import { fetchPublishedCatalog } from '../../../../src/lib/catalog/repository';

export const revalidate = 60;

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { category } = await params;
  let rows: { id: string; model_name: string; category: string }[] = [];
  try {
    const result = await fetchPublishedCatalog();
    rows = result.rows.filter((r) => r.category === category || category === 'all');
  } catch {
    rows = [];
  }
  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>Category: {category}</h1>
      <ul>
        {rows.map((p) => (
          <li key={p.id}>{p.model_name}</li>
        ))}
      </ul>
    </main>
  );
}
