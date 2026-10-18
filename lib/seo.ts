import type { Metadata } from 'next'
import { site } from '@/data/site'
export function publicUrl(path:string):string {const url=new URL(path,site.url);return url.pathname==='/'&&!url.search&&!url.hash?site.url:url.toString()}
export function pageMetadata(title: string, description: string, path: string, index=true): Metadata {
 const url=publicUrl(path)
 return { title:{absolute:title},description,alternates:{canonical:url},robots:{index,follow:true,googleBot:{index,follow:true,'max-image-preview':'large','max-snippet':-1}},openGraph:{title,description,url,siteName:site.name,type:'website',locale:'en_US',images:[{url:`${site.url}/opengraph-image`,width:1200,height:630,alt:'Copero football career simulator: from academy to legacy'}]},twitter:{card:'summary_large_image',title,description,images:[`${site.url}/opengraph-image`]} }
}
export function jsonLd(value: unknown): string { return JSON.stringify(value).replace(/</g,'\\u003c') }
export function breadcrumbSchema(items: {name:string;path:string}[]) { return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:publicUrl(item.path)}))} }
