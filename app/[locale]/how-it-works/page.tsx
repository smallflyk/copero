import Documents from '@/views/Documents'
import {getDocument} from '@/data/localized-content'
import {localeMetadata} from '@/lib/i18n/metadata'
import {isLocale} from '@/lib/i18n/config'
import {notFound} from 'next/navigation'
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))return {};const doc=getDocument('how-it-works',locale);return localeMetadata(`${doc.title} | Copero`,doc.description,'/how-it-works',locale)}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <Documents kind="how-it-works" locale={locale}/>}
