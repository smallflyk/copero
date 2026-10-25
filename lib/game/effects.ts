import {clubs,getClub} from '../../data/clubs'
import {WEIGHTS} from './rules'
import {ATTRIBUTE_KEYS,type Attributes,type Position,type GameState,type Decision,type StoryEffect} from './types'

export const clamp = (value: number, min=1, max=99) => Math.min(max, Math.max(min, value))
export function overall(attributes: Attributes, position: Position): number { return Math.round(ATTRIBUTE_KEYS.reduce((total,key)=>total+attributes[key]*WEIGHTS[position][key],0)) }
export function transferOffers(state: GameState): { bigger?: string; minutes?: string } {
 if (!state.history.length || state.status==='retired') return {}
 const club=getClub(state.player.clubId), ovr=overall(state.player.attributes,state.player.position)
 const bigger=clubs.find((item)=>item.tier===club.tier+1 && ovr>=item.competition-12)
 const minutes=clubs.filter((item)=>item.id!==club.id && item.tier<=club.tier && item.opportunity>club.opportunity+8).sort((a,b)=>b.tier-a.tier)[0]
 return { bigger:bigger?.id,minutes:minutes?.id }
}
export function selection(opportunity:number,ovr:number,competition:number,trust:number,morale:number) {return clamp((opportunity+(ovr-competition)*.85+(trust-50)*.25+(morale-50)*.1)/100,.12,.98)}
export const adjacent: Record<Position,Position>={ ST:'LW',LW:'RW',RW:'ST',CAM:'CM',CM:'CDM',CDM:'CM',LB:'RB',RB:'LB',CB:'CDM',GK:'GK' }

/** The same pre-match ordering as the engine, with no random roll or mutation. */
export function hasStoryBenefit(state:GameState,decision:Decision,effect:StoryEffect):boolean {
 const p=state.player,trust=decision.transfer==='stay'?p.coachTrust:50
 if((effect.fitness??0)>0&&p.fitness<99||(effect.morale??0)>0&&p.morale<99||(effect.coachTrust??0)>0&&trust<99)return true
 if(effect.attribute&&(effect.points??0)>0&&p.attributes[effect.attribute]<Math.min(99,p.potential))return true
 if((effect.bonus??0)>0)return true
 if((effect.growth??1)>1&&p.age<33&&ATTRIBUTE_KEYS.some(k=>p.attributes[k]<p.potential))return true
 if((effect.role??0)>0){
  const club=getClub(decision.transfer==='stay'?p.clubId:transferOffers(state)[decision.transfer]??p.clubId)
  const attributes={...p.attributes};if(effect.attribute)attributes[effect.attribute]=clamp(Math.min(p.potential,attributes[effect.attribute]+(effect.points??0)))
  let coachTrust=clamp(trust+(effect.coachTrust??0)),morale=clamp(p.morale+(effect.morale??0)),position=p.position,coachRole=0
  if(decision.relationship==='follow'){coachTrust=clamp(coachTrust+9);morale=clamp(morale+3)}
  if(decision.relationship==='ask'){const accepted=overall(p.attributes,p.position)>=club.competition-6;coachTrust=clamp(coachTrust+(accepted?3:-10));morale=clamp(morale+(accepted?9:-6));coachRole=accepted?.08:0}
  if(decision.relationship==='position'){position=adjacent[position];coachTrust=clamp(coachTrust-5)}
  const base=selection(club.opportunity,overall(attributes,position),club.competition,coachTrust,morale)+coachRole
  return clamp(base+(effect.role??0),.12,.98)>clamp(base,.12,.98)
 }
 return false
}
export function hasStoryCost(effect:StoryEffect):boolean {return ['fitness','morale','coachTrust','role'].some(k=>(effect[k as keyof StoryEffect] as number??0)<0)||(effect.growth??1)<1}
