import {careerResult} from './engine'
import {careerRecords} from './records'
import {t} from '../i18n/translate'
import {countLabel} from '../i18n/format'
import type {Locale} from '../i18n/config'
import type {GameState} from './types'

export const CAREER_CARD_SIZE={width:1080,height:1350} as const

/** Local PNG only: club totals include cups; international statistics stay separate. */
export function drawCareerCard(ctx:CanvasRenderingContext2D,state:GameState,locale:Locale,hostname:string) {
 const result=careerResult(state),records=careerRecords(state),competition=records.competitions
 const colors={background:'#0b2118',panel:'#142f25',line:'#496253',text:'#f4f5e9',muted:'#c1d0b9',accent:'#d5ec80'}
 const font=(size:number,bold=false)=>{ctx.font=`${bold?'700':'400'} ${size}px sans-serif`}
 // Fit complete translated labels first. Wrap by code point for both CJK and Latin text.
 function lines(value:string,x:number,y:number,width:number,size=20,maxLines=2,bold=false,color=colors.muted) {
  font(size,bold)
  while(size>16&&ctx.measureText(value).width>width*maxLines*.9){font(--size,bold)}
  function wrap() {
   const rows:string[]=[];let row=''
   for(const char of Array.from(value)){
    if(row&&ctx.measureText(row+char).width>width){
     const space=row.lastIndexOf(' ')
     if(space>0){rows.push(row.slice(0,space));row=row.slice(space+1)+char}else{rows.push(row);row=char}
    }else row+=char
   }
   if(row)rows.push(row)
   return rows
  }
  let rows=wrap()
  while(size>16&&rows.length>maxLines){font(--size,bold);rows=wrap()}
  ctx.fillStyle=color
  rows.slice(0,maxLines).forEach((text,index)=>{
   if(index===maxLines-1&&rows.length>maxLines){while(text&&ctx.measureText(text+'…').width>width)text=Array.from(text).slice(0,-1).join('');text+='…'}
   ctx.fillText(text.trim(),x,y+index*(size+5))
  })
 }
 function single(value:string,x:number,y:number,width:number,size=24,bold=false,color=colors.text) {
  font(size,bold);while(size>16&&ctx.measureText(value).width>width)font(--size,bold)
  if(ctx.measureText(value).width>width){while(value&&ctx.measureText(value+'…').width>width)value=Array.from(value).slice(0,-1).join('');value+='…'}
  ctx.fillStyle=color;ctx.fillText(value,x,y)
 }
 function panel(x:number,y:number,width:number,height:number){ctx.fillStyle=colors.panel;ctx.fillRect(x,y,width,height);ctx.strokeStyle=colors.line;ctx.lineWidth=1;ctx.strokeRect(x,y,width,height)}
 function metric(label:string,value:number,x:number,y:number,width:number,large=false){single(String(value),x,y,width,large?56:46,true,large?colors.accent:colors.text);lines(t(label,locale),x,y+28,width,20)}
 ctx.textBaseline='alphabetic';ctx.textAlign='left'
 ctx.fillStyle=colors.background;ctx.fillRect(0,0,1080,1350)
 ctx.strokeStyle=colors.line;ctx.lineWidth=2;ctx.strokeRect(32,32,1016,1286)
 single('copero.',64,104,340,48,true,colors.accent)
 single(t('The final whistle',locale),570,99,446,23,false,colors.muted)
 single(state.player.name,64,190,952,62,true)
 single(`${t(state.player.nationality,locale)} · ${t(state.player.position,locale)} · #${state.player.jerseyNumber} · ${t('Retired at {age}',locale,{age:state.player.age})}`,64,233,952,24,false,colors.muted)
 single(t(result.ending,locale),64,279,952,35,true,colors.accent)
 panel(64,312,952,108)
 single(`${result.score}/100`,86,392,250,66,true,colors.accent)
 single(t('YOUR LEGACY',locale),370,354,620,23,true)
 single(t('Personal milestones: {count}',locale,{count:records.achievements.length}),370,390,620,21,false,colors.muted)
 panel(64,442,952,250)
 single(t('Club career totals',locale),86,478,908,26,true)
 const stats=[['Matches',result.matches],['Goals',result.goals],['Assists',result.assists],['Club trophies',result.trophies],['Peak OVR',result.peakOvr],['Clean sheets',result.cleanSheets]] as const
 stats.forEach(([label,value],index)=>metric(label,value,86+(index%3)*310,536+Math.floor(index/3)*94,288))
 if(competition.recordedSeasons){
  panel(64,714,464,410);panel(552,714,464,410)
  single(t('Domestic Cup',locale),86,752,420,26,true)
  single(t('National team',locale),574,752,244,26,true)
  single(t(competition.national.country,locale),840,752,154,21,true,colors.accent)
  lines(t('Domestic cup medals',locale),86,790,420,21)
  lines(t('National team titles',locale),574,790,420,21)
  single(String(competition.cupMedals),86,866,420,56,true,colors.accent)
  single(String(competition.national.titles),574,866,420,56,true,colors.accent)
  const cup=[['Cup appearances',competition.cupAppearances],['Cup goals',competition.cupGoals],['Cup assists',competition.cupAssists],['Cup clean sheets',competition.cupCleanSheets]] as const
  const national=[['International caps',competition.national.appearances],['International goals',competition.national.goals],['International assists',competition.national.assists],['International clean sheets',competition.national.cleanSheets]] as const
  cup.forEach(([label,value],index)=>metric(label,value,86+(index%2)*220,922+Math.floor(index/2)*96,200))
  national.forEach(([label,value],index)=>metric(label,value,574+(index%2)*220,922+Math.floor(index/2)*96,200))
  for(const [index,kind] of (['regional','global'] as const).entries()){
   const count=competition.seasons.filter(s=>s.competitions!.national.medal&&s.competitions!.national.kind===kind).length
   single(t(kind==='regional'?'Regional titles: {count}':'Global titles: {count}',locale,{count}),574+index*220,1100,200,18,false,colors.accent)
  }
 }else{
  panel(64,714,952,410)
  single(t('Your cup and international career',locale),86,762,908,28,true)
  lines(t('No competition records were simulated in these historical seasons.',locale),86,836,908,26,3)
 }
 single(t('Competition records cover {recorded} of {total} seasons.',locale,{recorded:competition.recordedSeasons,total:state.history.length}),64,1157,952,19,false,colors.muted)
 lines(t('Recorded domestic cup medals are included in club trophies. National titles are separate.',locale),64,1190,952,19,3)
 single(t('{seasons} · Fictional career · Your decisions',locale,{seasons:countLabel(state.history.length,'season',locale)}),64,1280,710,20,false,colors.muted)
 single(hostname,806,1280,210,24,true,colors.accent)
}
