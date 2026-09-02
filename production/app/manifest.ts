import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DJI Store EU',
    short_name: 'DJI EU',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F9FB',
    theme_color: '#1D1D1F',
    icons: [
      { src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  };
}
