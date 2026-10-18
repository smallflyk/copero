import NotFound from '../not-found'
import {isLocale} from '@/lib/i18n/config'
import {localeMetadata} from '@/lib/i18n/metadata'
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return isLocale(locale)?localeMetadata('Page not found','This page is not in the current Copero playbook.','/404',locale,false):{}}
export default function Page(){return <NotFound/>}
