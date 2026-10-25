import {clamp} from './engine'
import type {Attribute,ChangeStep,Condition,Decision,GameState,StoryEffect} from './types'
export type EffectAdjustment={metric:Attribute|'fitness'|'morale'|'coachTrust';requested:number;applied:number}
export function previewAdjustments(state:GameState,decision:Decision,effect:StoryEffect):EffectAdjustment[] {
 const p=state.player,before:Condition={fitness:p.fitness,morale:p.morale,coachTrust:decision.transfer==='stay'?p.coachTrust:50,ovr:0}
 const after={...before,fitness:clamp(before.fitness+(effect.fitness??0)),morale:clamp(before.morale+(effect.morale??0)),coachTrust:clamp(before.coachTrust+(effect.coachTrust??0))}
 const attributes=effect.attribute?{[effect.attribute]:{before:p.attributes[effect.attribute],after:clamp(Math.min(p.potential,p.attributes[effect.attribute]+(effect.points??0)))}}:undefined
 return appliedAdjustments(effect,{source:'story',before,after,attributes})
}
export function appliedAdjustments(effect:StoryEffect,step:ChangeStep):EffectAdjustment[] {
 const adjustments:EffectAdjustment[]=[]
 for(const metric of ['fitness','morale','coachTrust'] as const){const requested=effect[metric],applied=step.after[metric]-step.before[metric];if(requested!==undefined&&requested!==applied)adjustments.push({metric,requested,applied})}
 if(effect.attribute){const a=step.attributes?.[effect.attribute],requested=effect.points??0,applied=a?a.after-a.before:0;if(requested!==applied)adjustments.push({metric:effect.attribute,requested,applied})}
 return adjustments
}
