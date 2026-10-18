import type { Locale } from './config'
import { messages } from './messages'
const caseKeys=new Map(Object.keys(messages).map(key=>[key.toLocaleLowerCase(),key]))
const patterns: [RegExp,string[]][]=[]
for(const key of Object.keys(messages)) {
 if(!key.includes('{'))continue
 const names:string[]=[]
 const source=key.split(/(\{\w+\})/g).map(part=>{if(/^\{\w+\}$/.test(part)){names.push(part.slice(1,-1));return '(.+?)'}return part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}).join('')
 patterns.push([new RegExp(`^${source}$`),[key,...names]])
}
export function t(text:string,locale:Locale,values?:Record<string,string|number>):string {
 // Saved narrative stays in the engine's original language; render each sentence locally.
 if(locale!=='en' && /^\d+ appearances at .+\. .+ Rating [+-]?\d+\.$/.test(text))return text.split(/(?<=\.)\s+/).map(sentence=>t(sentence,locale)).join(' ')
 let result=text
 const key=text.trim(),entry=messages[key]||messages[caseKeys.get(key.toLocaleLowerCase())||'']
 if(locale!=='en') {
  if(entry)result=text.replace(key,entry[locale]||key)
  else for(const [pattern,[template,...names]] of patterns) {
   const match=key.match(pattern);if(!match)continue
   result=text.replace(key,(messages[template][locale]||template).replace(/\{(\w+)\}/g,(_,name)=>t(match[names.indexOf(name)+1],locale)));break
  }
 }
 if(values)result=result.replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??`{${name}}`))
 return result
}
