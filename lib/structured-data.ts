import {publicUrl} from './seo'
import {site} from '@/data/site'
import {LANGUAGE_TAGS,LOCALES,localizedPath,type Locale} from './i18n/config'
import {t} from './i18n/translate'
import {RULE_VERSION} from './game/rules'
// One domain-level publisher/site/game identity across all real language editions.
export function homeSchema(locale:Locale){const url=publicUrl(localizedPath('/',locale)),description=t(site.description,locale);return {'@context':'https://schema.org','@graph':[
 {'@type':'Organization','@id':`${site.url}/#organization`,name:'Copero',url:site.url,email:site.contactEmail,logo:`${site.url}/icon.svg`},
 {'@type':'WebSite','@id':`${site.url}/#website`,name:'Copero',alternateName:'Copero.pro',url:site.url,publisher:{'@id':`${site.url}/#organization`},inLanguage:LOCALES.map(lang=>LANGUAGE_TAGS[lang])},
 {'@type':'WebPage','@id':`${url}#webpage`,url,name:t(site.title,locale),description,inLanguage:LANGUAGE_TAGS[locale],isPartOf:{'@id':`${site.url}/#website`},mainEntity:{'@id':`${site.url}/#game`}},
 {'@type':['VideoGame','WebApplication'],'@id':`${site.url}/#game`,name:'Copero',url:site.url,description,publisher:{'@id':`${site.url}/#organization`},softwareVersion:RULE_VERSION,gamePlatform:'Web browser',applicationCategory:'GameApplication',operatingSystem:'Any',browserRequirements:'JavaScript required for gameplay',playMode:'https://schema.org/SinglePlayer',genre:['Sports','Simulation'],inLanguage:LOCALES.map(lang=>LANGUAGE_TAGS[lang]),isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD',url}}
]}}
