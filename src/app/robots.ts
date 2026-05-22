import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://keelcare.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/parent-dashboard/',
          '/api/',
          '/auth/callback',
          '/auth/reset-password',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
