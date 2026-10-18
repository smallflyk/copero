import type {ReactNode} from 'react'
import type {Metadata,Viewport} from 'next'
import {notFound} from 'next/navigation'
import SiteLayout from '@/components/SiteLayout'
import {isLocale,LOCALES} from '@/lib/i18n/config'
import {localeMetadata} from '@/lib/i18n/metadata'
import '../globals.css'
import '../interface.css'
export const dynamicParams=false
export const viewport:Viewport={themeColor:'#0b2118',colorScheme:'dark',width:'device-width',initialScale:1,viewportFit:'cover'}
export function generateStaticParams(){return LOCALES.map(locale=>({locale}))}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;return isLocale(locale)?localeMetadata('Copero – Free Football Career Simulator Online','Play Copero, a free football career simulator. Create your player, make career decisions, transfer clubs, win trophies, and build your football legacy.','/',locale):{metadataBase:new URL('https://copero.pro')}}
export default async function Layout({children,params}:{children:ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <SiteLayout locale={locale}>{children}</SiteLayout>}
