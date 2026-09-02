import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../src')
    }
  },
  test: {
    environment: 'node',
    include: ['src/lib/email/**/*.test.ts', 'src/lib/storage/**/*.test.ts']
  }
});
