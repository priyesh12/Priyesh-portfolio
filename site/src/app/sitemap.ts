import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://priyeshgupta.netlify.app';
  return [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/work/alphacalendar/`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
