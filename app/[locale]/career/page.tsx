import CareerGame from '@/components/CareerGame'
import {localeMetadata} from '@/lib/i18n/metadata'
import {isLocale} from '@/lib/i18n/config'
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return isLocale(locale)?localeMetadata('Your Copero Career – Football Career Simulator','Make your next career decision, review your seasons, and build your football legacy. Your save stays in this browser.','/career',locale,false):{}}
export default function Page(){return <CareerGame/>}
