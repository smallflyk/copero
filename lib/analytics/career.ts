import type {GameState} from '../game/types'
import {localizedPath,type Locale} from '../i18n/config'

const KEY='copero.measurement.v1',TTL=10*60*1000,VERSION='career-v1'
type Origin='new'|'replay'|'existing'
type Run={careerId:string;token:string;origin:Origin;lastSeason:number;started:boolean;completed:boolean;pendingUntil:number;target:string}
type Ledger={version:1;run?:Run;restart?:{at:number;completed:boolean}}
type AnalyticsWindow=Window & {gtag?:(...args:unknown[])=>void;'ga-disable-G-4JYX8WF2SZ'?:boolean}
const fallback=new WeakMap<object,Ledger>()
function read():Ledger {
 try {
  const raw=window.localStorage.getItem(KEY)
  if(raw&&raw.length>4096)return {version:1}
  if(!raw)return fallback.get(window)??{version:1}
  const value=JSON.parse(raw) as Ledger,r=value.run
  if(value.version!==1||(r&&(!['new','replay','existing'].includes(r.origin)||typeof r.careerId!=='string'||typeof r.token!=='string'||!Number.isInteger(r.lastSeason)||r.lastSeason<0||r.lastSeason>22||typeof r.started!=='boolean'||typeof r.completed!=='boolean'||!Number.isFinite(r.pendingUntil)||typeof r.target!=='string'))||(value.restart&&(!Number.isFinite(value.restart.at)||typeof value.restart.completed!=='boolean')))return {version:1}
  return value
 }catch{return fallback.get(window)??{version:1}}
}
function write(value:Ledger){fallback.set(window,value);try{window.localStorage.setItem(KEY,JSON.stringify(value))}catch{/* Analytics cannot block session-only play. */}}
function quiet(action:()=>void){try{if(typeof window!=='undefined')action()}catch{/* Analytics must never affect the game. */}}
function emit(event:string,locale:Locale,params:Record<string,string|number>={}) {
 const target=window as AnalyticsWindow
 if(target['ga-disable-G-4JYX8WF2SZ']||typeof target.gtag!=='function')return
 // No player names, seed, save, career/run ID, URL, choices or free text are sent.
 try{target.gtag('event',event,{send_to:'G-4JYX8WF2SZ',measurement_version:VERSION,game_mode:'career',site_language:locale,...params})}catch{/* Blocked tags do not block play. */}
}
function existing(state:GameState):Run{return {careerId:state.id,token:typeof crypto.randomUUID==='function'?crypto.randomUUID():`${Date.now()}-${Math.random()}`,origin:'existing',lastSeason:state.history.length,started:false,completed:state.status==='retired',pendingUntil:0,target:''}}
function bind(ledger:Ledger,state:GameState) {
 if(!ledger.run||ledger.run.careerId!==state.id||ledger.run.lastSeason>state.history.length)ledger.run=existing(state)
 return ledger.run
}
/** Called only after confirmation, before clearing the original game save. */
export function restartRequested(state:GameState){quiet(()=>{const l=read();l.restart={at:Date.now(),completed:state.status==='retired'};write(l)})}
/** Prepare a short-lived handoff; creating a save is not yet a loaded new game. */
export function prepareCareer(state:GameState,previous:GameState|null,locale:Locale){quiet(()=>{
 if(state.status!=='playing'||state.history.length)return
 const l=read(),now=Date.now(),intent=l.restart
 const replay=previous?.status==='retired'||Boolean(intent&&now>=intent.at&&now-intent.at<=TTL&&intent.completed)
 l.run={...existing(state),origin:replay?'replay':'new',pendingUntil:now+TTL,target:localizedPath('/career',locale)}
 delete l.restart;write(l)
})}
/** Restore never backfills starts, completed seasons or historical retirements. */
export function careerLoaded(state:GameState,locale:Locale){quiet(()=>{
 const l=read(),r=bind(l,state),now=Date.now(),path=window.location.pathname.replace(/\/$/,'')
 if(!r.started&&r.pendingUntil>=now&&r.pendingUntil-now<=TTL&&r.target===path&&state.status==='playing'&&!state.history.length){
  r.started=true;r.pendingUntil=0;write(l)
  emit('career_start',locale,{career_type:r.origin,season_number:0})
  if(r.origin==='replay')emit('career_restart',locale,{career_type:'replay',season_number:0})
 }else{if(!r.started&&r.pendingUntil&&r.pendingUntil<now){r.origin='existing';r.pendingUntil=0}write(l)}
})}
/** Accepted engine transitions only. Deduplication receipts remain local. */
export function careerAdvanced(before:GameState,next:GameState,locale:Locale){quiet(()=>{
 if(before.status!=='playing'||before.id!==next.id)return
 const season=next.history.length===before.history.length+1&&next.player.age===before.player.age+1
 const manual=next.status==='retired'&&next.history.length>0&&next.history.length===before.history.length
 if(!season&&!manual)return
 const l=read(),r=l.run?.careerId===before.id?l.run:bind(l,before),events:{name:string;params:Record<string,string|number>}[]=[]
 if(season&&r.lastSeason<next.history.length){
  r.lastSeason=next.history.length;events.push({name:'season_complete',params:{career_type:r.origin,season_number:next.history.length}})
  if(r.origin==='replay'&&next.history.length===1)events.push({name:'career_continue',params:{career_type:'replay',season_number:1}})
 }
 if(next.status==='retired'&&!r.completed){r.completed=true;events.push({name:'career_complete',params:{career_type:r.origin,season_number:next.history.length,completion_type:manual?'manual':'age_limit'}})}
 write(l);for(const event of events)emit(event.name,locale,event.params)
})}
/** A valid local Blob was handed to the browser, not proof of a disk write. */
export function careerExported(state:GameState,locale:Locale,format:'png'|'json'){quiet(()=>{
 const l=read(),r=bind(l,state);write(l);emit('career_export',locale,{career_type:r.origin,season_number:state.history.length,export_format:format})
})}
export function careerError(locale:Locale,step:'profile'|'season'|'export'){quiet(()=>emit('career_error',locale,{error_step:step}))}
