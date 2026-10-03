import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilehubbd.tech';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/account', '/account/*', '/checkout', '/cart'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
