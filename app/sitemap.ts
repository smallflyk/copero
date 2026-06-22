import type { MetadataRoute } from 'next'
import { pokemon } from '@/data/pokemon'
import { site } from '@/lib/seo'

const pages = [
  '', '/codes', '/tier-list', '/best-teams', '/pokemon', '/team-builder',
  '/beginner-guide', '/download', '/regulation-guide', '/regulation-set-m-b',
  '/best-regulation-m-b-teams', '/best-mega-pokemon', '/about', '/privacy-policy', '/terms',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((path) => ({
      url: new URL(path || '/', site.url).toString(),
      lastModified: new Date('2026-06-22'),
      changeFrequency: path === '/codes' ? 'daily' as const : 'weekly' as const,
      priority: path === '' ? 1 : ['/privacy-policy','/terms'].includes(path) ? 0.3 : 0.8,
    })),
    ...pokemon.map((entry) => ({
      url: `${site.url}/pokemon/${entry.slug}`,
      lastModified: new Date('2026-06-22'),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
