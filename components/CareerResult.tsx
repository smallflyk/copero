'use client'
import {useLanguage} from './LanguageProvider'
import {localize} from '@/lib/i18n/render'
import {countLabel} from '@/lib/i18n/format'
import {t} from '@/lib/i18n/translate'
import { useState } from 'react'
import Link from 'next/link'
import {careerRecords} from '@/lib/game/records'
import {AchievementRecord} from './CareerProgress'
import {SeasonFeedback} from './CareerChoices'
import { careerResult } from '@/lib/game/engine'
import { getClub } from '@/data/clubs'
import type { GameState } from '@/lib/game/types'
import { site } from '@/data/site'

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
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350
   const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image download is unavailable in this browser.')
   ctx.fillStyle='#153f32';ctx.fillRect(0,0,1080,1350)
   ctx.strokeStyle='#577151';ctx.lineWidth=2;ctx.strokeRect(48,48,984,1254);ctx.strokeRect(90,550,900,650)
   ctx.beginPath();ctx.arc(540,875,130,0,Math.PI*2);ctx.stroke()
   ctx.fillStyle='#d5ec80';ctx.font='bold 54px sans-serif';ctx.fillText('copero.',90,150)
   ctx.fillStyle='#c1d0b9';ctx.font='24px sans-serif';ctx.fillText(t('THE FINAL CHAPTER / FOOTBALL CAREER',locale),90,225)
   ctx.fillStyle='#f4f5e9';ctx.font='bold 70px sans-serif'
   let name=state.player.name;while(ctx.measureText(name).width>890 && name.length>2)name=name.slice(0,-2)+'…'
   ctx.fillText(name,90,345);ctx.font='30px sans-serif';ctx.fillText(`${t(state.player.nationality,locale)} · ${t(state.player.position,locale)} · #${state.player.jerseyNumber}`,90,407)
   ctx.fillStyle='#d5ec80';ctx.font='bold 46px sans-serif';ctx.fillText(t(result.ending,locale),90,495)
   ctx.fillStyle='#d5ec80';ctx.font='bold 190px sans-serif';ctx.fillText(String(result.score).padStart(2,'0'),90,720)
   ctx.fillStyle='#f4f5e9';ctx.font='30px sans-serif';ctx.fillText(t('/ 100 LEGACY SCORE',locale),330,700)
   const stats=[['MATCHES',result.matches],['GOALS',result.goals],['ASSISTS',result.assists],['TROPHIES',result.trophies],['PEAK OVR',result.peakOvr],['CLEAN SHEETS',result.cleanSheets]]
   stats.forEach(([label,value],index)=>{const x=90+(index%3)*300,y=860+Math.floor(index/3)*160;ctx.fillStyle='#f4f5e9';ctx.font='bold 58px sans-serif';ctx.fillText(String(value),x,y);ctx.fillStyle='#c1d0b9';ctx.font='22px sans-serif';ctx.fillText(t(String(label),locale),x,y+43)})
   ctx.fillStyle='#d5ec80';ctx.font='20px sans-serif';ctx.fillText(records.achievements.slice(-3).map(a=>t(a.label,locale)).join(' · '),90,1140,900)
   ctx.fillStyle='#c1d0b9';ctx.font='23px sans-serif';ctx.fillText(t('{seasons} · Fictional career · Your decisions',locale,{seasons:countLabel(state.history.length,'season',locale)}),90,1190)
   ctx.fillStyle='#d5ec80';ctx.font='bold 28px sans-serif';ctx.fillText(new URL(site.url).hostname,90,1260)
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error('Could not create your image.')),'image/png'))
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`copero-career-${state.id}.png`;document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),10000)
  }catch(problem){setError(problem instanceof Error?problem.message:'Could not download the result card.')}finally{setDownloading(false)}
 }
 const chart=state.history.map((season,index)=>`${50+index/Math.max(1,state.history.length-1)*800},${255-(season.endOvr-20)/80*200}`).join(' ')
 return localize(<div className="container result-page">
  <div className="result-intro"><p className="eyebrow"><span translate="no">{t('The final whistle',locale)} / {countLabel(state.history.length,'season',locale)}</span></p><h1><span translate="no">{state.player.name}</span>,<br/><em>{result.ending}.</em></h1><p>{state.player.nationality} · {state.player.position} · <span translate="no">{t('Retired at {age}',locale,{age:state.player.age})}</span></p></div>
  {warning&&<p role="status" className="error-message">{warning}</p>}
  <section className="result-card"><div className="legacy-score"><span>YOUR LEGACY</span><strong>{result.score}<small>/100</small></strong><p>One player. A lifetime of decisions.</p></div><div className="result-stats">{[['Matches',result.matches],['Goals',result.goals],['Assists',result.assists],['Trophies',result.trophies],['Peak OVR',result.peakOvr],['Clean sheets',result.cleanSheets]].map(([label,value])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
  <div className="button-row"><button className="button" onClick={download} disabled={downloading}>{downloading?'Creating your card…':'Download result card ↓'}</button><button className="button secondary download-record" onClick={downloadRecord}>Download career record ↓</button><button className="button secondary" onClick={onRestart}>Play again ↗</button></div><p className="field-help">Downloads a 1080 × 1350 PNG. Your career remains saved in this browser. Public result links and cross-device saves are not available.</p>{error&&<p className="error-message" role="alert">{error}</p>}
  <section className="panel score-explainer"><p className="eyebrow">HOW YOU GOT HERE</p><h2>Your legacy, explained.</h2><p>Every position has a way to leave its mark. Defensive roles use clean sheets in their contribution score, rather than being penalised for fewer goals.</p>{result.breakdown.map((item)=><div className="score-row" key={item.label}><div><strong>{item.label}</strong><p>{item.explanation}</p></div><b>{item.points}<small>/{item.maximum}</small></b></div>)}<p className="field-help">85+ Legend · 70–84 World-Class Star · 55–69 Club Hero · 35–54 Professional Veteran · 0–34 Unfulfilled Potential. <Link href="/how-it-works#legacy">Read the full model →</Link></p></section>
  <section className="panel"><p className="eyebrow">THE DEVELOPMENT CURVE</p><h2>Your rating over time.</h2><svg className="career-chart" viewBox="0 0 900 310" role="img" aria-label={`Overall rating across ${state.history.length} seasons. Peak ${result.peakOvr}.`}><path d="M50 40V255H850" fill="none" stroke="#b3c0a9"/><text x="12" y="55">99</text><text x="12" y="255">20</text><polyline points={chart} fill="none" stroke="#315f47" strokeWidth="4"/>{state.history.map((season,index)=><g key={season.number}><circle cx={50+index/Math.max(1,state.history.length-1)*800} cy={255-(season.endOvr-20)/80*200} r="4" fill="#315f47"><title>Age {season.age}: {season.endOvr} OVR</title></circle>{index%4===0&&<text x={50+index/Math.max(1,state.history.length-1)*800} y="290">{season.age}</text>}</g>)}</svg></section>
  <section className="panel retirement-record"><p className="eyebrow">THE SHIRTS YOU WORE</p><h2>Your career record</h2><dl className="record-highlights"><div><dt>Career earnings</dt><dd translate="no">{money(records.earnings)}</dd></div><div><dt>Peak market value</dt><dd translate="no">{money(records.peakValue)}</dd></div></dl><p className="field-help">Earnings include recorded annual salaries and story bonuses. All figures are fictional.</p>{records.bestSeason&&<p>{`Best rated season: ${records.bestSeason.number} · ${getClub(records.bestSeason.clubId).name} · ${records.bestSeason.endOvr} OVR`}</p>}<p className="field-help">Best season uses end-of-season rating, then appearances; ties go to the earliest season.</p><div className="club-stints">{records.stints.map((stint,index)=><article key={`${stint.clubId}-${index}`}><h3>{getClub(stint.clubId).name}</h3><p translate="no">{stint.firstAge===stint.lastAge?t('Age {n}',locale,{n:stint.firstAge}):t('Age {from}–{to}',locale,{from:stint.firstAge,to:stint.lastAge})} · {countLabel(stint.seasons,'season',locale)}</p><div className="summary-tags"><span translate="no">{countLabel(stint.matches,'match',locale)}</span><span translate="no">{countLabel(stint.goals,'goal',locale)}</span><span translate="no">{countLabel(stint.assists,'assist',locale)}</span><span translate="no">{countLabel(stint.cleanSheets,'clean sheet',locale)}</span><span translate="no">{countLabel(stint.trophies,'trophy',locale)}</span></div></article>)}</div><h3>Career milestones</h3><ul>{records.milestones.map(item=><li key={item.label}>{item.label} · <span>Season {item.season!.number}</span> · {getClub(item.season!.clubId).name}</li>)}</ul></section>
  <AchievementRecord state={state}/>
  <section className="career-timeline"><p className="eyebrow">YOUR CAREER STORY</p><h2>The moments that made it.</h2><ol>{state.history.map((season)=><li key={season.number}><span className="timeline-age">{season.age}</span><div><h3>{getClub(season.clubId).name} <span>{season.endOvr} OVR</span></h3><p>{season.summary}</p><SeasonFeedback season={season}/><details><summary>Season events</summary><ul>{season.events.map((event,index)=><li key={index}>{event}</li>)}</ul></details></div></li>)}<li><span className="timeline-age">{state.player.age}</span><div><h3>The final whistle</h3><p translate="no">{t('Retired as a {ending} with a legacy score of {score}/100.',locale,{ending:t(result.ending,locale),score:result.score})}</p></div></li></ol></section>
 </div>,locale)
}
