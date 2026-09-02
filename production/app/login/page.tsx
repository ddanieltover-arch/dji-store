import React, { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading…</main>}>
      <LoginClient />
    </Suspense>
  );
}
