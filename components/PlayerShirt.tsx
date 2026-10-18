'use client'
import {useLanguage} from './LanguageProvider'
import {t} from '@/lib/i18n/translate'
const KITS: Record<string, [string,string,string]> = {
 Argentina:['#78bbde','#f5f1df','🇦🇷'],Brazil:['#edda43','#258357','🇧🇷'],England:['#f5f1df','#243b61','🏴'],France:['#294b9b','#e9e7dc','🇫🇷'],Germany:['#eeeade','#252b2b','🇩🇪'],Italy:['#2f79c5','#ecebdc','🇮🇹'],Japan:['#31569a','#ecebdc','🇯🇵'],Mexico:['#27835c','#eeeade','🇲🇽'],Morocco:['#b93836','#33775b','🇲🇦'],Netherlands:['#ee8336','#263637','🇳🇱'],Nigeria:['#50b77b','#f1efdf','🇳🇬'],Portugal:['#b93f43','#33775b','🇵🇹'],'South Korea':['#e55d65','#263637','🇰🇷'],Spain:['#c54638','#e7c858','🇪🇸'],'United States':['#edeadd','#3e5684','🇺🇸'],Uruguay:['#84c7e7','#edeadd','🇺🇾']
}
export function countryFlag(country:string) {return country==='England'?'🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}':KITS[country]?.[2]||'⚽'}
export default function PlayerShirt({name,number,nationality}:{name:string;number:number;nationality:string}) {
 const locale=useLanguage()
 const [color,trim]=KITS[nationality]||KITS.England
 return <svg className="player-shirt" viewBox="0 0 320 330" role="img" aria-label={t('{country} shirt: {name}, number {n}',locale,{country:t(nationality,locale),name:name||t('Your name',locale),n:Number.isFinite(number)?number:10})}>
  <defs><linearGradient id="shirt-fabric" x1="0" x2="1"><stop stopColor="#000" stopOpacity=".25"/><stop offset=".3" stopColor="#fff" stopOpacity=".12"/><stop offset=".7" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".25"/></linearGradient><filter id="shirt-shadow"><feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity=".25"/></filter></defs>
  <g filter="url(#shirt-shadow)"><path d="M111 32 69 48 20 121 72 151 91 117 84 290Q160 309 236 290L229 117 248 151 300 121 251 48 209 32Q160 51 111 32Z" fill={color}/><path d="m69 48 22 69-19 34-52-30Z M251 48l-22 69 19 34 52-30Z" fill={trim}/><path d="m25 113 52 30-5 8-52-30Z M295 113l-52 30 5 8 52-30Z" fill={color}/><path d="M111 32q49 19 98 0l-14 25-35 20-35-20Z" fill={trim}/><path d="M125 35q35 12 70 0l-9 15-26 13-26-13Z" fill="#172d26"/><path d="M111 32 69 48 20 121 72 151 91 117 84 290Q160 309 236 290L229 117 248 151 300 121 251 48 209 32Q160 51 111 32Z" fill="url(#shirt-fabric)"/><path d="M89 281q71 15 142 0" fill="none" stroke={trim} strokeWidth="3" opacity=".5"/></g>
  <text x="160" y="111" textAnchor="middle" fontSize="24">{countryFlag(nationality)}</text><text x="160" y="144" textAnchor="middle" fill={trim} stroke="#142e28" strokeWidth=".3" fontSize={name.length>18?12:16} fontWeight="800" textLength={name.length>18?160:undefined} lengthAdjust="spacingAndGlyphs">{(name.trim()||t('YOUR NAME',locale)).toUpperCase()}</text><text x="160" y="252" textAnchor="middle" fill={trim} stroke="#142e28" strokeWidth=".5" fontSize="112" fontWeight="900" fontFamily="Impact, sans-serif">{Number.isFinite(number)?number:10}</text>
 </svg>
}
