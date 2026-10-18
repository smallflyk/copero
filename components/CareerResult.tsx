'use client'
import {useLanguage} from './LanguageProvider'
import {localize} from '@/lib/i18n/render'
import {t} from '@/lib/i18n/translate'
import { useState } from 'react'
import Link from 'next/link'
import { careerResult } from '@/lib/game/engine'
import { getClub } from '@/data/clubs'
import type { GameState } from '@/lib/game/types'
import { site } from '@/data/site'

export default function CareerResult({state,warning,onRestart}:{state:GameState;warning:string;onRestart:()=>void}) {
 const locale=useLanguage()
 const result=careerResult(state),[error,setError]=useState(''),[downloading,setDownloading]=useState(false)
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
   ctx.fillStyle='#c1d0b9';ctx.font='23px sans-serif';ctx.fillText(t('{n} seasons · Fictional career · Your decisions',locale,{n:state.history.length}),90,1190)
   ctx.fillStyle='#d5ec80';ctx.font='bold 28px sans-serif';ctx.fillText(new URL(site.url).hostname,90,1260)
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error('Could not create your image.')),'image/png'))
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`copero-career-${state.id}.png`;document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),10000)
  }catch(problem){setError(problem instanceof Error?problem.message:'Could not download the result card.')}finally{setDownloading(false)}
 }
 const chart=state.history.map((season,index)=>`${50+index/Math.max(1,state.history.length-1)*800},${255-(season.endOvr-20)/80*200}`).join(' ')
 return localize(<div className="container result-page">
  <div className="result-intro"><p className="eyebrow">THE FINAL WHISTLE / {state.history.length} SEASONS</p><h1><span translate="no">{state.player.name}</span>,<br/><em>{result.ending}.</em></h1><p>{state.player.nationality} · {state.player.position} · Retired at {state.player.age}</p></div>
  {warning&&<p role="status" className="error-message">{warning}</p>}
  <section className="result-card"><div className="legacy-score"><span>YOUR LEGACY</span><strong>{result.score}<small>/100</small></strong><p>One player. A lifetime of decisions.</p></div><div className="result-stats">{[['Matches',result.matches],['Goals',result.goals],['Assists',result.assists],['Trophies',result.trophies],['Peak OVR',result.peakOvr],['Clean sheets',result.cleanSheets]].map(([label,value])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>
  <div className="button-row"><button className="button" onClick={download} disabled={downloading}>{downloading?'Creating your card…':'Download result card ↓'}</button><button className="button secondary" onClick={onRestart}>Play again ↗</button></div><p className="field-help">Downloads a 1080 × 1350 PNG. Your career remains saved in this browser. Public result links and cross-device saves are not available.</p>{error&&<p className="error-message" role="alert">{error}</p>}
  <section className="panel score-explainer"><p className="eyebrow">HOW YOU GOT HERE</p><h2>Your legacy, explained.</h2><p>Every position has a way to leave its mark. Defensive roles use clean sheets in their contribution score, rather than being penalised for fewer goals.</p>{result.breakdown.map((item)=><div className="score-row" key={item.label}><div><strong>{item.label}</strong><p>{item.explanation}</p></div><b>{item.points}<small>/{item.maximum}</small></b></div>)}<p className="field-help">85+ Legend · 70–84 World-Class Star · 55–69 Club Hero · 35–54 Professional Veteran · 0–34 Unfulfilled Potential. <Link href="/how-it-works#legacy">Read the full model →</Link></p></section>
  <section className="panel"><p className="eyebrow">THE DEVELOPMENT CURVE</p><h2>Your rating over time.</h2><svg className="career-chart" viewBox="0 0 900 310" role="img" aria-label={`Overall rating across ${state.history.length} seasons. Peak ${result.peakOvr}.`}><path d="M50 40V255H850" fill="none" stroke="#b3c0a9"/><text x="12" y="55">99</text><text x="12" y="255">20</text><polyline points={chart} fill="none" stroke="#315f47" strokeWidth="4"/>{state.history.map((season,index)=><g key={season.number}><circle cx={50+index/Math.max(1,state.history.length-1)*800} cy={255-(season.endOvr-20)/80*200} r="4" fill="#315f47"><title>Age {season.age}: {season.endOvr} OVR</title></circle>{index%4===0&&<text x={50+index/Math.max(1,state.history.length-1)*800} y="290">{season.age}</text>}</g>)}</svg></section>
  <section className="panel"><p className="eyebrow">THE SHIRTS YOU WORE</p><h2>Clubs played for</h2><div className="summary-tags">{result.clubs.map((id)=><span key={id}>{getClub(id).name}</span>)}</div></section>
  <section className="career-timeline"><p className="eyebrow">YOUR CAREER STORY</p><h2>The moments that made it.</h2><ol>{state.history.map((season)=><li key={season.number}><span className="timeline-age">{season.age}</span><div><h3>{getClub(season.clubId).name} <span>{season.endOvr} OVR</span></h3><p>{season.summary}</p><ul>{season.events.map((event,index)=><li key={index}>{event}</li>)}</ul></div></li>)}<li><span className="timeline-age">{state.player.age}</span><div><h3>The final whistle</h3><p>Retired as a {result.ending.toLowerCase()} with a legacy score of {result.score}/100.</p></div></li></ol></section>
 </div>,locale)
}
