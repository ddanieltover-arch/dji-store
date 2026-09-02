import { WAVE12_LOCALES } from '../../../src/data/wave12ProductionData';

export function generateStaticParams() {
  return WAVE12_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div data-locale={locale}>
      <header style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb', fontWeight: 800 }}>
        DJI Store EU · {locale.toUpperCase()}
      </header>
      {children}
    </div>
  );
}
