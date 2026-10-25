import {t} from './translate'
import type {Locale} from './config'
export function ordinal(value:number,locale:Locale):string {
 if(locale==='zh')return `第${value}名`
 if(locale==='de')return `${value}.`
 if(locale==='it')return `${value}°`
 if(locale==='es'||locale==='pt')return `${value}.º`
 const tail=value%100
 return `${value}${tail>=11&&tail<=13?'th':value%10===1?'st':value%10===2?'nd':value%10===3?'rd':'th'}`
}

export type CountUnit='season'|'match'|'goal'|'assist'|'clean sheet'|'trophy'
const forms:Record<CountUnit,[string,string]>={season:['1 season','{n} seasons'],match:['1 match','{n} matches'],goal:['1 goal','{n} goals'],assist:['1 assist','{n} assists'],'clean sheet':['1 clean sheet','{n} clean sheets'],trophy:['1 trophy','{n} trophies']}
export function countLabel(n:number,unit:CountUnit,locale:Locale):string {return t(forms[unit][n===1?0:1],locale,{n:new Intl.NumberFormat(locale).format(n)})}
