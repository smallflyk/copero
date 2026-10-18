import {publicUrl} from '@/lib/seo'
import {site} from '@/data/site'
import {guides} from '@/data/guides'
import {LOCALES,localizedPath} from '@/lib/i18n/config'

export function sitemapXml():string {
 const paths=['/','/how-it-works','/guides','/about','/privacy-policy','/terms',...guides.map(guide=>`/guides/${guide.slug}`)]
 const escape=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
 // Language alternates remain in each page's HTML head. Keep the XML feed minimal.
 const entries=LOCALES.flatMap(locale=>paths.map(path=>[
  '  <url>',
  `    <loc>${escape(publicUrl(localizedPath(path,locale)))}</loc>`,
  `    <lastmod>${site.updated}</lastmod>`,
  '  </url>',
 ].join('\n')))
 return ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',...entries,'</urlset>',''].join('\n')
}
