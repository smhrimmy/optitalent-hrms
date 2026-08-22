import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://optitalent.example';
  return ['', '/login', '/setup', '/privacy', '/terms', '/cookies', '/walkin-drive'].map((path) => ({
    url: `${base}${path || '/'}`,
    lastModified: new Date(),
  }));
}
