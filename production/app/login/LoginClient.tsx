'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error === 'invalid_credentials' ? 'Incorrect email or password.' : 'Sign in failed.');
      return;
    }
    router.replace(next);
  };

  return (
    <main style={{ maxWidth: 420, margin: '4rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Sign in</h1>
      <p style={{ color: '#666', marginTop: 8 }}>
        Use the same email and password for customer accounts and admin access.
      </p>
      <form onSubmit={submit} style={{ marginTop: 24, display: 'grid', gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 4, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
        </label>
        {error && <p style={{ color: '#b91c1c', fontSize: 14 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#E30613',
            color: '#fff',
            border: 0,
            borderRadius: 10,
            padding: '12px 16px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        No account? <a href="/signup">Create one</a>
      </p>
    </main>
  );
}
