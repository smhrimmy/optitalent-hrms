import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OptiTalent',
    short_name: 'OptiTalent',
    description: 'Personnel files, leave, pay, and hiring.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4EFE6',
    theme_color: '#1F4D3A',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
