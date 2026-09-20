import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Keep the first paint lighter on mobile — a single ~2.6MB module often whitescreens on slow links.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('officialStoreMediaCache') ||
              id.includes('productDatabaseMediaCache') ||
              id.includes('officialUsdPriceCache')
            ) {
              return 'media-cache';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://localhost:3015',
          changeOrigin: true
        }
      }
    },
  };
});
