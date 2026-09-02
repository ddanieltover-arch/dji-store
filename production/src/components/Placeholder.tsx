export default function Placeholder({ title }: { title: string }) {
  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>{title}</h1>
      <p style={{ color: '#6b7280', fontSize: 14 }}>
        Production route wired — data via Neon Postgres / existing Wave engines. Vite prototype remains migration
        reference.
      </p>
    </main>
  );
}
