import Link from 'next/link';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main style={{ padding: '2rem 1.25rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>DJI Store EU</h1>
      <p style={{ color: '#6b7280' }}>Production Next.js 15 storefront — catalog via Neon Postgres.</p>
      <ul style={{ lineHeight: 1.9 }}>
        <li>
          <Link href={`/${locale}/products`}>Products</Link>
        </li>
        <li>
          <Link href={`/${locale}/cart`}>Cart</Link>
        </li>
        <li>
          <Link href={`/${locale}/account`}>Account</Link>
        </li>
        <li>
          <Link href={`/${locale}/account/service`}>Service</Link>
        </li>
        <li>
          <Link href={`/${locale}/account/notifications`}>Notifications</Link>
        </li>
      </ul>
    </main>
  );
}
