import type { MetadataRoute } from 'next'
import { pokemon } from '@/data/pokemon'
import { site } from '@/lib/seo'
export default function sitemap():MetadataRoute.Sitemap{const pages=['','/codes','/tier-list','/best-teams','/pokemon','/team-builder','/beginner-guide','/download','/regulation-guide','/about','/privacy-policy','/terms'];return[...pages.map(path=>({url:`${site.url}${path}`,lastModified:new Date('2026-06-21'),changeFrequency:path==='/codes'?'daily' as const:'weekly' as const,priority:path===''?1:path==='/privacy-policy'||path==='/terms'?.3:.8})),...pokemon.map(p=>({url:`${site.url}/pokemon/${p.slug}`,lastModified:new Date('2026-06-21'),changeFrequency:'weekly' as const,priority:.7}))]}
