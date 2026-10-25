import { clubs } from '../../data/clubs'
import { ATTRIBUTE_KEYS, POSITIONS, CHANGE_SOURCES, type GameState } from './types'
import {storyCatalog} from './stories'
import { MAX_AGE, NATIONALITIES } from './rules'
export const SAVE_KEY = 'copero.career.v1'
let session: GameState | null = null
let sessionWarning = ''
const finite=(value: unknown,min: number,max: number) => typeof value==='number' && Number.isFinite(value) && value>=min && value<=max
const integer=(value: unknown,min: number,max: number)=>finite(value,min,max)&&Number.isInteger(value)
const clubIds=new Set(clubs.map((club)=>club.id))
const storyIds:Record<string,string[]>={'extra-session':['specialist','analysis','rest'],selection:['minutes','practice','support'],sponsor:['appearance','training','team'],mentor:['mentor','focus','recover']}
const validCondition=(c:unknown)=>{if(!c||typeof c!=='object')return false;const v=c as Record<string,unknown>;return ['fitness','morale','coachTrust','ovr'].every(key=>finite(v[key],1,99))}
function validReview(s:GameState['history'][number],index:number,previousClub:string,state:GameState) {
 const r=s.review,story=r?.story
 if(s.decision.story===undefined)return r===undefined&&s.decision.storyEvent===undefined
 if(typeof s.decision.story!=='string'||!r||!story||!validCondition(r.before)||!validCondition(r.after)||!integer(r.expectedApps,0,44)||r.fromClubId!==previousClub||!integer(r.bonus,0,1e9)||r.after.fitness!==s.fitness||r.after.morale!==s.morale||r.after.ovr!==s.endOvr)return false
 const modern=s.decision.storyEvent!==undefined,eventId=modern?s.decision.storyEvent!:Object.keys(storyIds)[index%4],catalog=storyCatalog(state).find(e=>e.id===eventId)
 if(typeof eventId!=='string'||story.eventId!==eventId||!(modern?catalog?.choices.some(c=>c.id===story.choiceId):storyIds[eventId]?.includes(story.choiceId))||story.choiceId!==s.decision.story||typeof story.title!=='string'||story.title.length>200||typeof story.label!=='string'||story.label.length>200)return false
 if(modern?!validChanges(s):r.changes!==undefined||r.matchFactors!==undefined)return false
 const e=story.effect
 if(!e||typeof e!=='object'||Object.keys(e).some(k=>!['fitness','morale','coachTrust','attribute','points','role','growth','bonus'].includes(k)))return false
 for(const k of ['fitness','morale','coachTrust'] as const)if(e[k]!==undefined&&!integer(e[k],-99,99))return false
 return (e.attribute===undefined||ATTRIBUTE_KEYS.includes(e.attribute))&&(e.points===undefined||integer(e.points,0,10))&&(e.role===undefined||finite(e.role,-1,1))&&(e.growth===undefined||finite(e.growth,0,3))&&(e.bonus===undefined||integer(e.bonus,0,1e9))&&r.bonus===(e.bonus??0)
}
function validChanges(s:GameState['history'][number]) {
 const r=s.review!,steps=r.changes,f=r.matchFactors
 if(!Array.isArray(steps)||steps.length!==8||!f||!finite(f.base,.12,.98)||!finite(f.story,-1,1)||!finite(f.coach,0,.08)||!finite(f.final,.12,.98)||!finite(f.availability,0,1)||Math.abs(f.final-Math.min(.98,Math.max(.12,f.base+f.story+f.coach)))>1e-9)return false
 const expected=[['transfer'],['story'],['coach-follow','coach-accepted','coach-refused','coach-position'],['training'],['rehab-full','rehab-early','rehab-none'],['injury-healthy','injury-minor','injury-major'],['development'],['matches']]
 const keys=['fitness','morale','coachTrust','ovr'] as const
 for(const [i,step]of steps.entries()){
  if(!step||!CHANGE_SOURCES.includes(step.source)||!expected[i].includes(step.source)||!validCondition(step.before)||!validCondition(step.after)||keys.some(k=>step.before[k]!==(i?steps[i-1].after:r.before)[k]))return false
  if(step.attributes!==undefined&&(!step.attributes||typeof step.attributes!=='object'||Object.entries(step.attributes).some(([key,v])=>!ATTRIBUTE_KEYS.includes(key as typeof ATTRIBUTE_KEYS[number])||!v||!integer(v.before,1,99)||!integer(v.after,1,99))))return false
 }
 return keys.every(k=>steps.at(-1)!.after[k]===r.after[k])
}
export function decodeSave(raw: string): GameState {
 if (raw.length>250000) throw new Error('The saved career is too large to load.')
 const state=JSON.parse(raw)
 if (!state || state.version!==1) throw new Error('This saved career uses an unsupported format. Start a new career to continue.')
 const p=state.player
 if (!p || typeof p.name!=='string' || p.name.trim().length<2 || p.name.length>28 || !NATIONALITIES.includes(p.nationality) || !POSITIONS.includes(p.position) || !['Left','Right'].includes(p.preferredFoot) || !integer(p.jerseyNumber,1,99) || !integer(p.age,16,MAX_AGE) || !p.attributes || ATTRIBUTE_KEYS.some((key)=>!integer(p.attributes[key],1,99)) || !integer(p.potential,1,99) || !finite(p.fitness,1,99) || !finite(p.morale,1,99) || !finite(p.coachTrust,1,99) || !['healthy','minor','major'].includes(p.injuryStatus) || !clubIds.has(p.clubId)) throw new Error('The saved player is damaged. Start a new career to continue.')
 if(p.contract!==undefined&&(!p.contract||!integer(p.contract.salary,0,1e9)||!integer(p.contract.yearsLeft,0,3)))throw new Error('The saved contract is damaged.')
 if (!['playing','retired'].includes(state.status) || (p.age===38 && state.status!=='retired') || typeof state.id!=='string' || state.id.length>80 || typeof state.seed!=='string' || !state.seed.length || state.seed.length>40 || !integer(state.rng,1,4294967295) || !Array.isArray(state.history) || state.history.length>22 || (state.status==='retired' && state.history.length===0) || p.age!==16+state.history.length) throw new Error('The saved career progress is damaged.')
 for (const [index,s] of state.history.entries()) {
  if (!s || s.number!==index+1 || s.age!==16+index || !clubIds.has(s.clubId) || !POSITIONS.includes(s.position) || !integer(s.ovr,1,99) || !integer(s.endOvr,1,99) || !integer(s.appearances,0,44) || !integer(s.goals,0,Math.min(50,s.appearances*2)) || !integer(s.assists,0,Math.min(35,s.appearances)) || !integer(s.cleanSheets,0,s.appearances) || !integer(s.trophies,0,2) || !integer(s.standing,1,20) || !finite(s.marketValue,0,1e10) || !finite(s.salary,0,1e9) || !finite(s.fitness,1,99) || !finite(s.morale,1,99) || !['healthy','minor','major'].includes(s.injury) || typeof s.summary!=='string' || s.summary.length>2000 || !Array.isArray(s.events) || s.events.length>12 || s.events.some((event: unknown)=>typeof event!=='string' || event.length>500) || !s.decision || !['intensive','balanced','recovery'].includes(s.decision.training) || !['follow','ask','position'].includes(s.decision.relationship) || !['stay','bigger','minutes'].includes(s.decision.transfer) || (s.decision.recovery!==undefined && !['full','early'].includes(s.decision.recovery))) throw new Error('The saved season history is damaged.')
  if(!validReview(s,index,index?state.history[index-1].clubId:s.review?.fromClubId,state)|| (s.review&&!clubIds.has(s.review.fromClubId)))throw new Error('The saved decision review is damaged.')
 }
 return state as GameState
}
export function readSave(): { state: GameState | null; warning: string } {
 if (session) return {state:session,warning:sessionWarning}
 try {
  const raw=window.localStorage.getItem(SAVE_KEY)
  if (!raw) return {state:session,warning:''}
  const state=decodeSave(raw);session=state;return {state,warning:''}
 } catch(error) { return {state:session,warning:error instanceof Error?error.message:'Your saved career could not be read.'} }
}
export function saveCareer(state: GameState): string {
 session=state
 try { window.localStorage.setItem(SAVE_KEY,JSON.stringify(state));sessionWarning='';return '' }
 catch { sessionWarning='Browser storage is unavailable or full. You can keep playing in this tab, but this career may not survive a refresh.';return sessionWarning }
}
export function clearCareer(): void { session=null;sessionWarning='';try { window.localStorage.removeItem(SAVE_KEY) } catch { /* Session-only play is still possible. */ } }
