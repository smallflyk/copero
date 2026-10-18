import type {MetadataRoute} from 'next'
import {publicUrl} from '@/lib/seo'
import {site} from '@/data/site'
import {guides} from '@/data/guides'
import {LOCALES,LANGUAGE_TAGS,localizedPath} from '@/lib/i18n/config'
export const dynamic='force-static'
export default function sitemap():MetadataRoute.Sitemap{return LOCALES.flatMap(locale=>['/','/how-it-works','/guides','/about','/privacy-policy','/terms',...guides.map(guide=>`/guides/${guide.slug}`)].map(path=>({url:publicUrl(localizedPath(path,locale)),lastModified:new Date(`${site.updated}T00:00:00Z`),changeFrequency:path==='/'?'weekly' as const:'monthly' as const,priority:path==='/'?1:path.startsWith('/guides')?.8:.5,alternates:{languages:Object.fromEntries([...LOCALES.map(lang=>[LANGUAGE_TAGS[lang],publicUrl(localizedPath(path,lang))]),['x-default',publicUrl(localizedPath(path,'es'))]])}})))}
