import {usesProgression} from './types'
import {getClub} from '../../data/clubs'
import {transferOffers} from './effects'
import type {Decision,GameState,StoryThread} from './types'
export function pendingThread(state:GameState):StoryThread|undefined {const thread=state.history.at(-1)?.review?.thread;return thread?.status==='pending'?thread:undefined}
export function threadOutcome(state:GameState,decision:Decision):StoryThread|undefined {
 const pending=pendingThread(state);if(!pending)return
 const clubId=decision.transfer==='stay'?state.player.clubId:transferOffers(state)[decision.transfer]??state.player.clubId
 const left=clubId!==pending.clubId
 const status=pending.kind==='recovery'?(state.player.injuryStatus==='healthy'&&state.player.fitness>=60?'fulfilled':'missed'):left?'left':pending.kind==='loyalty'||state.history.at(-1)!.appearances>=22?'fulfilled':'missed'
 return {...pending,status}
}
export function nextThread(state:GameState,decision:Decision):StoryThread|undefined {
 if(!usesProgression(decision))return
 const closing=threadOutcome(state,decision);if(closing)return closing
 if(state.player.age>=37)return
 const kind=decision.storyEvent==='breakthrough'&&decision.story==='minutes'?'minutes':decision.storyEvent==='rehab'&&decision.story==='protect'?'recovery':decision.storyEvent==='renewal'&&decision.story==='stability'?'loyalty':undefined
 if(!kind)return
 return {kind,origin:state.history.length+1,clubId:decision.transfer==='stay'?state.player.clubId:transferOffers(state)[decision.transfer]??state.player.clubId,status:'pending'}
}
export function threadClub(thread:StoryThread){return getClub(thread.clubId).name}
export const threadMessages={pending:'Next season will revisit this decision.',fulfilled:'Commitment fulfilled',missed:'Target missed — a new response is needed',left:'Club move ended the previous commitment'} as const
