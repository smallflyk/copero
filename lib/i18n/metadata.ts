import {site} from '@/data/site'
import {pageMetadata,publicUrl} from '@/lib/seo'
import {LOCALES,LANGUAGE_TAGS,localizedPath,type Locale} from './config'
import {t} from './translate'
const ogLocales:Record<Locale,string>={es:'es_ES',en:'en_US',it:'it_IT',pt:'pt_BR',zh:'zh_CN',de:'de_DE'}
export function localeMetadata(title:string,description:string,path:string,locale:Locale,index=true){
 const result=pageMetadata(t(title,locale),t(description,locale),localizedPath(path,locale),index)
 return {...result,metadataBase:new URL(site.url),applicationName:'Copero',icons:{icon:'/icon.svg'},alternates:{canonical:publicUrl(localizedPath(path,locale)),languages:Object.fromEntries([...LOCALES.map(lang=>[LANGUAGE_TAGS[lang],publicUrl(localizedPath(path,lang))]),['x-default',publicUrl(localizedPath(path,'es'))]])},openGraph:{...result.openGraph,locale:ogLocales[locale],images:[{url:`${site.url}/opengraph-image`,width:1200,height:630,alt:t('Copero Football Career Simulator',locale)}],alternateLocale:LOCALES.filter(lang=>lang!==locale).map(lang=>ogLocales[lang])}}
}
