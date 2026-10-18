import GuideIndex from '@/views/GuideIndex'
import {localeMetadata} from '@/lib/i18n/metadata'
import {isLocale} from '@/lib/i18n/config'
import {notFound} from 'next/navigation'
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return isLocale(locale)?localeMetadata('Copero Guides – Positions, Decisions, Transfers & Legacy','Explore the Copero playbook. Learn how player positions, training, transfers, injury recovery, and legacy scoring shape your football career.','/guides',locale):{}}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <GuideIndex locale={locale}/>}
