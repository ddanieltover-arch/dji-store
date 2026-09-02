export default function OfflinePage() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: 480 }}>
      <h1>DJI Store EU</h1>
      <p style={{ background: '#1D1D1F', color: '#fff', padding: '0.75rem 1rem', borderRadius: 12 }}>
        You&apos;re offline. Showing recently viewed catalog data.
      </p>
      <p style={{ color: '#4b5563', fontSize: 14 }}>
        Stock, price, payment status, order status, and shipping estimates are not live while offline.
      </p>
    </main>
  );
}
