'use client'
import {useLanguage} from './LanguageProvider'
import {localize} from '@/lib/i18n/render'
import {countLabel} from '@/lib/i18n/format'
import {t} from '@/lib/i18n/translate'
import { useState } from 'react'
import Link from 'next/link'
import {careerRecords} from '@/lib/game/records'
import {CompetitionRecord,SeasonCompetitions} from './Competitions'
import {AchievementRecord} from './CareerProgress'
import {SeasonFeedback} from './CareerChoices'
import { careerResult } from '@/lib/game/engine'
import { getClub } from '@/data/clubs'
import type { GameState } from '@/lib/game/types'
import { site } from '@/data/site'
import {CAREER_CARD_SIZE,drawCareerCard} from '@/lib/game/result-card'

export default function CareerResult({state,warning,onRestart}:{state:GameState;warning:string;onRestart:()=>void}) {
 const locale=useLanguage()
 const records=careerRecords(state),money=(n:number)=>new Intl.NumberFormat(locale,{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n)
 const result=careerResult(state),[error,setError]=useState(''),[downloading,setDownloading]=useState(false)
 function downloadRecord() {
  const blob=new Blob([JSON.stringify({format:'copero-career-record-v1',career:state,result,records},null,2)],{type:'application/json'})
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`copero-record-${state.id}.json`;link.click();window.setTimeout(()=>URL.revokeObjectURL(url),10000)
 }
 async function download() {
  setDownloading(true);setError('')
  try {
   const canvas=document.createElement('canvas');canvas.width=CAREER_CARD_SIZE.width;canvas.height=CAREER_CARD_SIZE.height
   const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image download is unavailable in this browser.')
   drawCareerCard(ctx,state,locale,new URL(site.url).hostname)
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error('Could not create your image.')),'image/png'))
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`copero-career-${state.id}.png`;document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),10000)
  }catch(problem){setError(problem instanceof Error?problem.message:'Could not download the result card.')}finally{setDownloading(false)}
 }
 const chart=state.history.map((season,index)=>`${50+index/Math.max(1,state.history.length-1)*800},${255-(season.endOvr-20)/80*200}`).join(' ')
 return localize(<div className="container result-page">
  <div className="result-intro"><p className="eyebrow"><span translate="no">{t('The final whistle',locale)} / {countLabel(state.history.length,'season',locale)}</span></p><h1 translate="no">{state.player.name}</h1><p className="result-ending">{result.ending}</p><p>{state.player.nationality} · {state.player.position} · <span translate="no">{t('Retired at {age}',locale,{age:state.player.age})}</span></p></div>
  {warning&&<p role="status" className="error-message">{warning}</p>}
  <div className="result-actions" role="group" aria-label="Retirement actions"><button className="button secondary download-card" aria-label="Download result card ↓" onClick={download} disabled={downloading}><span>{downloading?'Creating your card…':'Result card'}</span><small>PNG ↓</small></button><button className="button download-record" aria-label="Download career record ↓" onClick={downloadRecord}><span>Career record</span><small>JSON ↓</small></button><button className="button secondary restart-career" aria-label="Play again ↗" onClick={onRestart}><span>Play again ↗</span><small>New career</small></button></div>
  <p className="result-save-note">Save your result card or full career record before starting a new career.</p>{error&&<p className="error-message" role="alert">{error}</p>}
  <section className="result-card" aria-label="Club career totals"><h2 className="result-section-label">Club career totals</h2><div className="legacy-score"><span>YOUR LEGACY</span><strong>{result.score}<small>/100</small></strong><p>One player. A lifetime of decisions.</p></div><div className="result-stats">{[['Matches',result.matches],['Goals',result.goals],['Assists',result.assists],['Club trophies',result.trophies],['Peak OVR',result.peakOvr],['Clean sheets',result.cleanSheets]].map(([label,value])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
  <p className="result-accounting">Club totals include league and domestic cup matches. National team statistics are shown separately below.</p>
  <CompetitionRecord state={state}/><AchievementRecord state={state}/>
  <div className="result-details">
  <details className="panel score-explainer"><summary>Your legacy, explained.</summary><p>Every position has a way to leave its mark. Defensive roles use clean sheets in their contribution score, rather than being penalised for fewer goals.</p>{result.breakdown.map((item)=><div className="score-row" key={item.label}><div><strong>{item.label}</strong><p>{item.explanation}</p></div><b>{item.points}<small>/{item.maximum}</small></b></div>)}<p className="field-help">85+ Legend · 70–84 World-Class Star · 55–69 Club Hero · 35–54 Professional Veteran · 0–34 Unfulfilled Potential. <Link href="/how-it-works#legacy">Read the full model →</Link></p></details>
  <details className="panel development-curve"><summary>Your rating over time.</summary><svg className="career-chart" viewBox="0 0 900 310" role="img" aria-label={`Overall rating across ${state.history.length} seasons. Peak ${result.peakOvr}.`}><path d="M50 40V255H850" fill="none" stroke="#b3c0a9"/><text x="12" y="55">99</text><text x="12" y="255">20</text><polyline points={chart} fill="none" stroke="#315f47" strokeWidth="4"/>{state.history.map((season,index)=><g key={season.number}><circle cx={50+index/Math.max(1,state.history.length-1)*800} cy={255-(season.endOvr-20)/80*200} r="4" fill="#315f47"><title>Age {season.age}: {season.endOvr} OVR</title></circle>{index%4===0&&<text x={50+index/Math.max(1,state.history.length-1)*800} y="290">{season.age}</text>}</g>)}</svg></details>
  <details className="panel retirement-record"><summary>Your career record</summary><dl className="record-highlights"><div><dt>Career earnings</dt><dd translate="no">{money(records.earnings)}</dd></div><div><dt>Peak market value</dt><dd translate="no">{money(records.peakValue)}</dd></div></dl><p className="field-help">Earnings include recorded annual salaries and story bonuses. All figures are fictional.</p>{records.bestSeason&&<p>{`Best rated season: ${records.bestSeason.number} · ${getClub(records.bestSeason.clubId).name} · ${records.bestSeason.endOvr} OVR`}</p>}<p className="field-help">Best season uses end-of-season rating, then appearances; ties go to the earliest season.</p><div className="club-stints">{records.stints.map((stint,index)=><article key={`${stint.clubId}-${index}`}><h3>{getClub(stint.clubId).name}</h3><p translate="no">{stint.firstAge===stint.lastAge?t('Age {n}',locale,{n:stint.firstAge}):t('Age {from}–{to}',locale,{from:stint.firstAge,to:stint.lastAge})} · {countLabel(stint.seasons,'season',locale)}</p><div className="summary-tags"><span translate="no">{countLabel(stint.matches,'match',locale)}</span><span translate="no">{countLabel(stint.goals,'goal',locale)}</span><span translate="no">{countLabel(stint.assists,'assist',locale)}</span><span translate="no">{countLabel(stint.cleanSheets,'clean sheet',locale)}</span><span translate="no">{countLabel(stint.trophies,'trophy',locale)}</span></div></article>)}</div><h3>Career milestones</h3><ul>{records.milestones.map(item=><li key={item.label}>{item.label} · <span>Season {item.season!.number}</span> · {getClub(item.season!.clubId).name}</li>)}</ul></details>
  <details className="panel download-help"><summary>About downloads</summary><p>Downloads a 1080 × 1350 PNG. Your career remains saved in this browser. Public result links and cross-device saves are not available.</p></details>
  </div>
  <details className="panel retirement-timeline"><summary>Season-by-season career</summary>
  <section className="career-timeline"><p className="eyebrow">YOUR CAREER STORY</p><h2>The moments that made it.</h2><ol>{state.history.map((season)=><li key={season.number}><span className="timeline-age">{season.age}</span><div><h3>{getClub(season.clubId).name} <span>{season.endOvr} OVR</span></h3><p>{season.summary}</p><SeasonFeedback season={season}/><SeasonCompetitions season={season}/><details><summary>Season events</summary><ul>{season.events.map((event,index)=><li key={index}>{event}</li>)}</ul></details></div></li>)}<li><span className="timeline-age">{state.player.age}</span><div><h3>The final whistle</h3><p translate="no">{t('Retired as a {ending} with a legacy score of {score}/100.',locale,{ending:t(result.ending,locale),score:result.score})}</p></div></li></ol></section>  </details>
 </div>,locale)
}
