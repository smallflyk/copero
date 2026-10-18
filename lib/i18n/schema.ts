import {site} from '@/data/site'
import {LANGUAGE_TAGS,localizedPath,type Locale} from './config'
import {t} from './translate'
export function localizeSchema(value:unknown,locale:Locale):unknown {
 if(Array.isArray(value))return value.map(item=>localizeSchema(item,locale))
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,key==='inLanguage'?LANGUAGE_TAGS[locale]:localizeSchema(item,locale)]))
 if(typeof value==='string') {
  if([`${site.url}/#organization`,`${site.url}/#website`,`${site.url}/#game`].includes(value))return value
  if(value.startsWith(site.url)){const url=new URL(value);return site.url+localizedPath(url.pathname+url.hash,locale)}
  return t(value,locale)
 }
 return value
}
