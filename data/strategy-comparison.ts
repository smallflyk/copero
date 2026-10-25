import {seasonStory} from '@/lib/game/stories'
import {academies} from './clubs'
import {createCareer,nextSeason,defaultDecision,careerResult} from '@/lib/game/engine'
import {RULE_VERSION,ZERO_BONUSES} from '@/lib/game/rules'
import type {Training} from '@/lib/game/types'
export const comparisonSetup={seed:'copero-strategy-v1',ruleVersion:RULE_VERSION,position:'ST',nationality:'England',jerseyNumber:10,preferredFoot:'Right',bonuses:{...ZERO_BONUSES,shooting:4,physical:2},coach:'follow',transfer:'stay'} as const
export const comparisonRows=academies.flatMap(club=>(['balanced','intensive','recovery'] as Training[]).map(training=>{
 let state=createCareer({name:'Copero Lab',seed:comparisonSetup.seed,position:'ST',nationality:'England',jerseyNumber:10,preferredFoot:'Right',bonuses:{...comparisonSetup.bonuses},clubId:club.id})
 while(state.status==='playing')state=nextSeason(state,{...defaultDecision(state),story:seasonStory(state).choices[0].id,storyEvent:seasonStory(state).id,training})
 const result=careerResult(state)
 return {clubId:club.id,club:club.name,training,seasons:state.history.length,matches:result.matches,goals:result.goals,peakOvr:result.peakOvr,trophies:result.trophies,score:result.score,injuredSeasons:state.history.filter(season=>season.injury!=='healthy').length}
}))
