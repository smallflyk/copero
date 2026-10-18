import type {Locale} from './config'
export function ordinal(value:number,locale:Locale):string {
 if(locale==='zh')return `第${value}名`
 if(locale==='de')return `${value}.`
 if(locale==='it')return `${value}°`
 if(locale==='es'||locale==='pt')return `${value}.º`
 const tail=value%100
 return `${value}${tail>=11&&tail<=13?'th':value%10===1?'st':value%10===2?'nd':value%10===3?'rd':'th'}`
}
