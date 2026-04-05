import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MedReminder',
    short_name: 'MedReminder',
    description: 'Medication reminder app - never miss a dose',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#2563eb',
    orientation: 'portrait',
    icons: [
      { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
