'use client';

import { FormEvent, useState } from 'react';

type Props = { locale?: string; productId?: string; productName?: string; productSlug?: string };

export function AlertSubscribeForm({ locale = 'en', productId = '', productName = '', productSlug = '' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function onSubmit(e: FormEvent, type: 'restock' | 'price') {
    e.preventDefault();
    if (!email || !productId) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify({ email, customerEmail: email, productId, type, locale })
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (!productId) return null;

  return (
    <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e4e4e7', borderRadius: '8px' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Stock & price alerts — {productName || productId}</h3>
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', maxWidth: '320px', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button type="button" onClick={(e) => onSubmit(e, 'restock')} disabled={status === 'loading'}>
          Restock alert
        </button>
        <button type="button" onClick={(e) => onSubmit(e, 'price')} disabled={status === 'loading'}>
          Price alert
        </button>
      </div>
      {status === 'done' && <p style={{ color: '#16a34a', fontSize: '0.875rem' }}>Subscribed — confirmation email sent when triggered.</p>}
      {status === 'error' && <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>Subscription failed. Try again.</p>}
      {productSlug ? <input type="hidden" name="productSlug" value={productSlug} readOnly /> : null}
    </section>
  );
}
