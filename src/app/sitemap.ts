import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/api-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilehubbd.tech';
  const apiUrl = API_BASE_URL;

  // 1. Static storefront routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/phones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 2. Dynamic published products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/products?limit=1000&status=ACTIVE`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const products = Array.isArray(json) ? json : json.data || [];
      productRoutes = products
        .filter((p: any) => p && p.slug && p.status !== 'INACTIVE')
        .map((p: any) => ({
          url: `${baseUrl}/product/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  // 3. Dynamic published blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/blogs?limit=500&status=PUBLISHED`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const blogs = Array.isArray(json) ? json : json.data || [];
      blogRoutes = blogs
        .filter((b: any) => b && b.slug && b.status === 'PUBLISHED')
        .map((b: any) => ({
          url: `${baseUrl}/blog/${b.slug}`,
          lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    }
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error);
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
