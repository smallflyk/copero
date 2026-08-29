import type { MetadataRoute } from 'next'
import { pokemon } from '@/data/pokemon'
import { site } from '@/lib/seo'

export const dynamic = 'force-static'

const pages = [
  '', '/codes', '/tier-list', '/best-teams', '/replica-teams', '/pokemon', '/team-builder',
  '/gameplay', '/release-date', '/mobile', '/pc',
  '/beginner-guide', '/download', '/regulation-guide', '/regulation-set-m-b',
  '/best-regulation-m-b-teams', '/best-mega-pokemon', '/about', '/privacy-policy', '/terms',
]
const localizedPages = ['/ja', '/ja/pokemon', '/ja/pokemon/metagross']
const contentUpdatedAt = new Date('2026-08-29T00:00:00.000Z')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((path) => ({
      url: new URL(path || '/', site.url).toString(),
      lastModified: contentUpdatedAt,
      changeFrequency: path === '/codes' ? 'daily' as const : 'weekly' as const,
      priority: path === '' ? 1 : ['/privacy-policy','/terms'].includes(path) ? 0.3 : 0.8,
    })),
    ...pokemon.map((entry) => ({
      url: `${site.url}/pokemon/${entry.slug}`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...localizedPages.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: contentUpdatedAt,
      changeFrequency: 'weekly' as const,
      priority: path === '/ja' ? 0.9 : 0.7,
    })),
  ]
}
