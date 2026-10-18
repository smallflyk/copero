import {site} from '@/data/site'
import Guide from '@/views/Guide'
import {guides} from '@/data/guides'
import {getGuides} from '@/data/localized-content'
import {localeMetadata} from '@/lib/i18n/metadata'
import {isLocale} from '@/lib/i18n/config'
import {notFound} from 'next/navigation'
export const dynamicParams=false
export function generateStaticParams(){return guides.map(guide=>({slug:guide.slug}))}
export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}){const {locale,slug}=await params;if(!isLocale(locale))return {};const guide=getGuides(locale).find(item=>item.slug===slug);if(!guide)return {};const metadata=localeMetadata(`${guide.title} | Copero`,guide.description,`/guides/${slug}`,locale);return {...metadata,openGraph:{...metadata.openGraph,type:'article',publishedTime:site.updated,modifiedTime:site.updated}}}
export default async function Page({params}:{params:Promise<{locale:string;slug:string}>}){const {locale,slug}=await params;if(!isLocale(locale)||!guides.some(item=>item.slug===slug))notFound();return <Guide slug={slug} locale={locale}/>}
