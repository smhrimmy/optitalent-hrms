import type { MetadataRoute } from 'next';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://optitalent.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/login', '/signup', '/privacy', '/terms', '/cookies', '/help', '/contact', '/accessibility'];
  return paths.map((p) => ({
    url: `${site}${p || '/'}`,
    lastModified: new Date('2026-08-22'),
    changeFrequency: 'monthly' as const,
    priority: p === '' ? 1 : 0.6,
  }));
}
