'use client'
import {useLanguage} from './LanguageProvider'
import {localize} from '@/lib/i18n/render'
import {localizedPath} from '@/lib/i18n/config'
import {t} from '@/lib/i18n/translate'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PlayerShirt, { countryFlag } from './PlayerShirt'
import { academies } from '@/data/clubs'
import { BONUS_POINTS, NATIONALITIES, POSITION_NAMES, TEMPLATES, ZERO_BONUSES } from '@/lib/game/rules'
import { ATTRIBUTE_KEYS, POSITIONS, type Attributes, type Position } from '@/lib/game/types'
import { createCareer, overall, validateConfig } from '@/lib/game/engine'
import { readSave, saveCareer } from '@/lib/game/storage'

export default function CreatePlayer() {
 const locale=useLanguage()
 const academyHeading=useRef<HTMLHeadingElement>(null)
 const router=useRouter(),[name,setName]=useState(''),[nationality,setNationality]=useState('England'),[position,setPosition]=useState<Position>('ST'),[foot,setFoot]=useState<'Left'|'Right'>('Right'),[number,setNumber]=useState(10),[seed,setSeed]=useState('kickoff-10'),[bonuses,setBonuses]=useState<Attributes>({...ZERO_BONUSES}),[club,setClub]=useState('riverside'),[step,setStep]=useState<'player'|'academy'>('player'),[error,setError]=useState(''),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false),[countrySearch,setCountrySearch]=useState('')
 useEffect(()=>{setSaved(Boolean(readSave().state))},[])
 useEffect(()=>{if(step==='academy')academyHeading.current?.focus()},[step])
 const spent=ATTRIBUTE_KEYS.reduce((sum,key)=>sum+bonuses[key],0)
 const attributes=Object.fromEntries(ATTRIBUTE_KEYS.map((key)=>[key,TEMPLATES[position][key]+bonuses[key]])) as Attributes
 function submit(event:React.FormEvent<HTMLFormElement>) {
  event.preventDefault();setError('')
  try {
   const config={name,nationality,position,preferredFoot:foot,jerseyNumber:number,seed,bonuses,clubId:club}
   validateConfig(config)
   if (step==='player') {setStep('academy');return}
   if (saved && !window.confirm(t('Replace your saved Copero career? The previous local save will be removed.',locale))) return
   setBusy(true);saveCareer(createCareer(config));router.push(localizedPath('/career',locale))
  } catch(problem) { setError(problem instanceof Error?problem.message:'Check your player details and try again.');setBusy(false) }
 }
 const countryOptions=NATIONALITIES.filter(item=>(t(item,locale)+' '+item).toLocaleLowerCase().includes(countrySearch.trim().toLocaleLowerCase()))
 const coordinates:Record<Position,[number,number]>={ST:[50,9],LW:[18,21],RW:[82,21],CAM:[50,26],CM:[50,43],CDM:[50,60],LB:[18,73],RB:[82,73],CB:[50,77],GK:[50,94]}
 return localize(<div className="player-workbench">
  <div className="workbench-heading"><div><h1 id="game-title">Copero Football Career Simulator</h1></div><div>{saved&&<Link className="resume-link" href="/career">Continue your saved career →</Link>}</div></div>
  <form noValidate onSubmit={submit} className="workbench-form" aria-label="Create your Copero player">
   <div className="form-step"><span aria-current={step==='player'?'step':undefined} className={step==='player'?'current':''}>Player profile</span><span aria-hidden="true">→</span><span aria-current={step==='academy'?'step':undefined} className={step==='academy'?'current':''}>Choose your academy</span></div>
   {step==='player'?<>
    <div className="creation-panels">
     <section className="creation-panel identity-panel" aria-labelledby="identity-heading"><h3 id="identity-heading"><span>01</span> Identity</h3><div className="kit-caption"><span>YOUR SHIRT</span><span>{countryFlag(nationality)} {nationality}</span></div><div className="kit-stage" data-caption={t('YOUR FIRST SHIRT',locale)}><PlayerShirt name={name} number={number} nationality={nationality}/></div><div className="identity-fields"><label>Player name<input value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={28} placeholder="Your name" required autoComplete="off"/></label><label>Shirt number<input type="number" min={1} max={99} required value={Number.isFinite(number)?number:''} onChange={e=>setNumber(e.target.valueAsNumber)}/></label></div><fieldset><legend>Preferred foot</legend><div className="segmented">{(['Left','Right'] as const).map(item=><button type="button" key={item} aria-pressed={foot===item} className={foot===item?'selected':''} onClick={()=>setFoot(item)}>{item}</button>)}</div></fieldset></section>
     <section className="creation-panel nationality-panel" aria-labelledby="nationality-heading"><h3 id="nationality-heading"><span>02</span> Nationality</h3><label>CHOOSE YOUR COUNTRY<input type="search" aria-label="Search nationalities" value={countrySearch} onChange={e=>setCountrySearch(e.target.value)} placeholder="Search country"/></label><div className="country-list" role="group" aria-label="Nationality">{countryOptions.map(item=><button type="button" key={item} aria-label={item} aria-pressed={nationality===item} className={nationality===item?'selected':''} onClick={()=>setNationality(item)}><span aria-hidden="true">{countryFlag(item)}</span>{item}{nationality===item&&<span className="country-check" aria-hidden="true">✓</span>}</button>)}{!countryOptions.length&&<p className="country-empty" role="status">No countries match. Try another search.</p>}</div><p className="country-note"><strong>Your country. Your identity.</strong> Choose from {NATIONALITIES.length} nationalities. Your club, training, and decisions shape your career results.</p></section>
     <section className="creation-panel position-panel" aria-labelledby="position-heading"><h3 id="position-heading"><span>03</span> Position</h3><p className="control-label">CHOOSE YOUR PLACE ON THE PITCH</p><div className="tactical-pitch" role="group" aria-label="Player position"><svg viewBox="0 0 300 440" preserveAspectRatio="none" aria-hidden="true"><path d="M1 1H299V439H1Z M1 220H299 M70 1V65H230V1 M113 1V23H187V1 M70 439V375H230V439 M113 439V417H187V439"/><circle cx="150" cy="220" r="42"/><circle cx="150" cy="220" r="2"/><path d="M116 65a40 40 0 0 0 68 0 M116 375a40 40 0 0 1 68 0"/></svg>{POSITIONS.map(item=><button type="button" key={item} className={position===item?'selected':''} aria-pressed={position===item} onClick={()=>setPosition(item)} title={POSITION_NAMES[item]} style={{left:`${coordinates[item][0]}%`,top:`${coordinates[item][1]}%`}}>{item}</button>)}</div><div className="selected-position"><span>SELECTED POSITION</span><strong aria-live="polite">{POSITION_NAMES[position]}</strong></div></section>
    </div>
    <details className="attribute-editor"><summary>Make it yours <span>{BONUS_POINTS-spent} attribute points left · {overall(attributes,position)} OVR</span></summary><p>Optional: add up to four points to any attribute, six in total. Your position determines how much each attribute affects OVR.</p><div className="attribute-allocations">{ATTRIBUTE_KEYS.map((key)=><div key={key}><span>{key}</span><div><button type="button" aria-label={`Decrease ${key}`} disabled={!bonuses[key]} onClick={()=>setBonuses({...bonuses,[key]:bonuses[key]-1})}>−</button><output aria-label={`${key} value`}>{attributes[key]}</output><button type="button" aria-label={`Increase ${key}`} disabled={spent>=BONUS_POINTS||bonuses[key]>=4} onClick={()=>setBonuses({...bonuses,[key]:bonuses[key]+1})}>+</button></div></div>)}</div><label>Career seed<input aria-label="Career seed" value={seed} onChange={(e)=>setSeed(e.target.value)} minLength={1} maxLength={40} required/><small>The same seed, player setup, and decisions reproduce the same career.</small></label></details>
    <div className="creation-footer"><div><strong>{POSITION_NAMES[position]} <span>· {overall(attributes,position)} OVR</span></strong><p>Start at 16. Free to play. Saved in this browser.</p></div><button className="button" type="submit">Find my first club <span aria-hidden="true">→</span></button></div>
   </>:<div className="academy-step">
    <h3 ref={academyHeading} tabIndex={-1}>Three doors. One first step.</h3><p className="muted">Each academy changes your starting opportunity. All clubs in this edition are fictional.</p><div className="academy-list">{academies.map((item)=><button type="button" className={`academy-option ${club===item.id?'selected':''}`} key={item.id} aria-pressed={club===item.id} onClick={()=>setClub(item.id)}><span className="club-initial" style={{background:item.color}}>{item.name[0]}</span><span className="academy-copy"><strong>{item.name}</strong><small>{item.identity}</small><small><span>{item.league}</span> · <span translate="no">{new Intl.NumberFormat(locale,{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(Math.round(item.salary*(.8+overall(attributes,position)/100)))}</span><span>/year</span> · <span>2-year contract</span></small><span className="club-metrics"><span>Training <b>{item.quality}/100</b></span><span>Opportunity <b>{item.opportunity}/100</b></span></span></span><span className="radio-dot" aria-hidden="true"/></button>)}</div><div className="button-row"><button type="button" className="button secondary" onClick={()=>setStep('player')}>← Edit player</button><button className="button" type="submit" disabled={busy}>{busy?'Signing contract…':'Sign my first contract →'}</button></div>
   </div>}{error&&<p role="alert" className="error-message">{error}</p>}
  </form>
 </div>,locale)
}
