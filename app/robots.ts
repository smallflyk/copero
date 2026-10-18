import type { MetadataRoute } from 'next'
import { site } from '@/data/site'
export const dynamic='force-static'
// Allow crawling the career page so crawlers can see its noindex meta tag.
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/'},sitemap:`${site.url}/sitemap.xml`,host:site.url}}
