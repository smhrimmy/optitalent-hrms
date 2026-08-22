import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/[role]/'] },
    sitemap: 'https://optitalent.example/sitemap.xml',
  };
}
