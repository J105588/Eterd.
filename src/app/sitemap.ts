import { MetadataRoute } from 'next';
import { i18n } from '@/i18n-config';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eterd.vercel.app';
  const locales = i18n.locales;

  const routes = [
    '',
    '/about',
    '/members',
    '/events',
    '/contact',
    '/privacy',
    '/terms',
  ];

  // Fetch all public members
  const { data: members } = await supabase
    .from('members')
    .select('slug')
    .eq('is_public', true);

  const memberRoutes = members?.map(m => `/members/${m.slug}`) || [];
  const allRoutes = [...routes, ...memberRoutes];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  allRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ja: `${baseUrl}/ja${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
