import {nextThread} from './threads'
import {evaluateGoal} from './achievements'
import {clamp,overall,transferOffers,selection,adjacent} from './effects'
export {clamp,overall,transferOffers} from './effects'
import { academies, getClub } from '../../data/clubs'
import { ATTRIBUTE_KEYS, POSITIONS, type Attributes, type CareerResult, type Decision, type GameState, type PlayerConfig, type Position, type Season, type ClubOffer, type ChangeSource, type ChangeStep } from './types'
import {seasonStory,legacyContextStory,legacySeasonStory,storyChoice} from './stories'
import { BONUS_POINTS, MAX_AGE, NATIONALITIES, TEMPLATES, WEIGHTS } from './rules'

export function hashSeed(seed: string): number { let hash=2166136261; for (const char of seed) hash=Math.imul(hash ^ char.charCodeAt(0),16777619); return hash >>> 0 || 1 }
function generator(seed: number) { let cursor=seed; return { next: () => { cursor ^= cursor << 13; cursor ^= cursor >>> 17; cursor ^= cursor << 5; cursor >>>=0; return cursor/4294967296 }, state: () => cursor } }
export function validateConfig(config: PlayerConfig): void {
 if (!config || typeof config.name !== 'string' || config.name.trim().length < 2 || config.name.trim().length > 28) throw new Error('Use a player name between 2 and 28 characters.')
 if (!NATIONALITIES.includes(config.nationality) || !POSITIONS.includes(config.position) || !['Left','Right'].includes(config.preferredFoot)) throw new Error('Choose a valid nationality, position, and preferred foot.')
 if (!Number.isInteger(config.jerseyNumber) || config.jerseyNumber < 1 || config.jerseyNumber > 99) throw new Error('Choose a shirt number from 1 to 99.')
 if (typeof config.seed !== 'string' || !config.seed.trim() || config.seed.length > 40) throw new Error('Use a career seed between 1 and 40 characters.')
 if (!config.bonuses || ATTRIBUTE_KEYS.some((key)=>!Number.isInteger(config.bonuses[key]) || config.bonuses[key]<0 || config.bonuses[key]>4) || ATTRIBUTE_KEYS.reduce((sum,key)=>sum+config.bonuses[key],0)>BONUS_POINTS) throw new Error('Allocate at most six bonus points, with no more than four per attribute.')
 if (!academies.some((club)=>club.id===config.clubId)) throw new Error('Choose one of the three starting academies.')
}
export function createCareer(config: PlayerConfig): GameState {
 validateConfig(config)
 const rng=generator(hashSeed(config.seed.trim()))
 const potential=77+Math.floor(rng.next()*18)
 const attributes = Object.fromEntries(ATTRIBUTE_KEYS.map((key)=>[key,TEMPLATES[config.position][key]+config.bonuses[key]])) as Attributes
 return { version:1,id:`career-${hashSeed(JSON.stringify(config)).toString(36)}`,seed:config.seed.trim(),rng:rng.state(),status:'playing',history:[],player:{ name:config.name.trim(),nationality:config.nationality,position:config.position,preferredFoot:config.preferredFoot,jerseyNumber:config.jerseyNumber,age:16,attributes,potential,fitness:92,morale:72,coachTrust:55,injuryStatus:'healthy',clubId:config.clubId } }
}
export function defaultDecision(state: GameState): Decision { return { training:'balanced',relationship:'follow',transfer:'stay',...(state.player.injuryStatus!=='healthy'?{recovery:'full' as const}:{}) } }
export function clubOffers(state:GameState):ClubOffer[] {
 const current=getClub(state.player.clubId),p=state.player,ovr=overall(p.attributes,p.position),offers=transferOffers(state)
 return (['stay','bigger','minutes'] as const).flatMap(kind=>{
  const id=kind==='stay'?current.id:offers[kind];if(!id)return []
  const club=getClub(id),trust=kind==='stay'?p.coachTrust:50
  return [{kind,clubId:id,salary:kind==='stay'&&p.contract&&p.contract.yearsLeft>0?p.contract.salary:Math.round(club.salary*(.8+ovr/100)),years:kind==='stay'&&p.contract&&p.contract.yearsLeft>0?p.contract.yearsLeft:kind==='bigger'?3:2,projectedApps:Math.round(44*selection(club.opportunity,ovr,club.competition,trust,p.morale)*.94),quality:club.quality,competition:club.competition,trust,upside:kind==='bigger'?'Stronger facilities and a bigger stage.':kind==='minutes'?'More room to compete for regular matches.':'Keep your existing coach relationship.',tradeoff:kind==='bigger'?'More competition; your coach trust resets to 50.':kind==='minutes'?'Facilities and trophy chances may be lower; trust resets to 50.':'Your current facilities and competition stay the same.'}]
 })
}
function validateDecision(state: GameState, decision: Decision) {
 if (!decision || !['intensive','balanced','recovery'].includes(decision.training) || !['follow','ask','position'].includes(decision.relationship) || !['stay','bigger','minutes'].includes(decision.transfer)) throw new Error('Complete the season decisions before continuing.')
 if(decision.rules!==undefined&&decision.rules!=='1.3')throw new Error('Choose a valid story decision for this season.')
 if (state.player.injuryStatus==='healthy' && decision.recovery!==undefined) throw new Error('Rehabilitation is only available while injured.')
 if (state.player.injuryStatus!=='healthy' && !['full','early'].includes(decision.recovery || '')) throw new Error('Choose an injury recovery plan.')
 if (decision.transfer!=='stay' && !transferOffers(state)[decision.transfer]) throw new Error('That transfer offer is not available this season.')
 storyChoice(state,decision.story,decision.storyEvent,decision.transfer,decision)
}
const goalRate: Record<Position,number>={ ST:.61,LW:.36,RW:.36,CAM:.24,CM:.12,CDM:.055,LB:.035,RB:.035,CB:.025,GK:0 }
const assistRate: Record<Position,number>={ ST:.12,LW:.26,RW:.26,CAM:.38,CM:.29,CDM:.15,LB:.18,RB:.18,CB:.035,GK:.006 }
export function nextSeason(state: GameState, decision: Decision): GameState {
 if (state.status!=='playing' || state.player.age>=MAX_AGE) throw new Error('This career is already complete.')
 validateDecision(state,decision)
 const rng=generator(state.rng), player={ ...state.player,attributes:{...state.player.attributes} }, events: string[]=[]
 const chosenStory=storyChoice(state,decision.story,decision.storyEvent,decision.transfer,decision),effect=chosenStory?.effect
 const before={fitness:player.fitness,morale:player.morale,coachTrust:player.coachTrust,ovr:overall(player.attributes,player.position)}
 const changes:ChangeStep[]=[]
 const condition=()=>({fitness:player.fitness,morale:player.morale,coachTrust:player.coachTrust,ovr:overall(player.attributes,player.position)})
 const track=(source:ChangeSource,action:()=>void)=>{
  const before=condition(),attributes={...player.attributes};action()
  const changed=ATTRIBUTE_KEYS.filter(key=>attributes[key]!==player.attributes[key]||(source==='story'&&effect?.attribute===key))
  changes.push({source,before,after:condition(),...(changed.length?{attributes:Object.fromEntries(changed.map(key=>[key,{before:attributes[key],after:player.attributes[key]}]))}:{})})
 }
 const contract=clubOffers(state).find(item=>item.kind===decision.transfer)!
 const startingOvr=overall(player.attributes,player.position)
 const offer=decision.transfer==='stay'?undefined:transferOffers(state)[decision.transfer]
 track('transfer',()=>{if (offer) { const previous=getClub(player.clubId); player.clubId=offer;player.coachTrust=50;events.push(`Transferred from ${previous.name} to ${getClub(offer).name}.`) }})
 track('story',()=>{if(chosenStory){
  player.contract={salary:contract.salary,yearsLeft:contract.years}
  player.fitness=clamp(player.fitness+(effect?.fitness??0));player.morale=clamp(player.morale+(effect?.morale??0));player.coachTrust=clamp(player.coachTrust+(effect?.coachTrust??0))
  if(effect?.attribute)player.attributes[effect.attribute]=clamp(Math.min(player.potential,player.attributes[effect.attribute]+(effect.points??0)))
  events.push('Story decision recorded in your season review.')
 }})
 const club=getClub(player.clubId)
 let coachRole=0
 const coachOutcome:ChangeSource=decision.relationship==='follow'?'coach-follow':decision.relationship==='position'?'coach-position':startingOvr>=club.competition-6?'coach-accepted':'coach-refused'
 track(coachOutcome,()=>{
 if (decision.relationship==='follow') { player.coachTrust=clamp(player.coachTrust+9); player.morale=clamp(player.morale+3) }
 if (decision.relationship==='ask') { const success=startingOvr>=club.competition-6;if(chosenStory&&success)coachRole=.08;player.coachTrust=clamp(player.coachTrust+(success?3:-10));player.morale=clamp(player.morale+(success?9:-6));events.push(success?'Your coach accepted a larger role.':'Your request for minutes strained the coach relationship.') }
 if (decision.relationship==='position') { const previous=player.position;player.position=adjacent[previous];player.coachTrust=clamp(player.coachTrust-5);events.push(previous===player.position?'The coach kept you in goal to develop your specialist role.':`Changed position from ${previous} to ${player.position}; a new role changes your rating weights.`) }
 })
 const fatigue=decision.training==='intensive'?22:decision.training==='balanced'?10:-12
 track('training',()=>{player.fitness=clamp(player.fitness-fatigue+(player.age<28?7:2))})
 const priorInjury=player.injuryStatus
 let availability=1, recoveryPenalty=0
 track(priorInjury==='healthy'?'rehab-none':decision.recovery==='full'?'rehab-full':'rehab-early',()=>{if (priorInjury!=='healthy') { const full=decision.recovery==='full';availability=priorInjury==='major'?(full?.48:.72):(full?.78:.92);recoveryPenalty=full?0:.12;player.fitness=clamp(player.fitness+(full?13:-12));events.push(full?'Full rehabilitation reduced match availability and protected long-term fitness.':'An early return increased available matches but raised reinjury risk.') }})
 const injuryRisk=.035+(decision.training==='intensive'?.12:decision.training==='recovery'?-.02:.025)+(99-player.fitness)*.0015+(player.age>30?.03:0)+recoveryPenalty
 const injuryRoll=rng.next()
 player.injuryStatus=injuryRoll<injuryRisk*.22?'major':injuryRoll<injuryRisk?'minor':'healthy'
 track(player.injuryStatus==='healthy'?'injury-healthy':player.injuryStatus==='major'?'injury-major':'injury-minor',()=>{if (player.injuryStatus!=='healthy') { availability*=player.injuryStatus==='major'?.5:.79;player.fitness=clamp(player.fitness-(player.injuryStatus==='major'?24:12));events.push(`${player.injuryStatus==='major'?'Major':'Minor'} injury reduced your available matches.`) }})
 const ovr=overall(player.attributes,player.position)
 const baseSelection=selection(club.opportunity,ovr,club.competition,player.coachTrust,player.morale)
 const role=clamp(baseSelection+(effect?.role??0)+coachRole,.12,.98)
 const appearances=Math.round(clamp(44*role*availability*(.85+rng.next()*.18),0,44))
 const form=.75+rng.next()*.5, skill=.45+ovr/100
 const goals=Math.round(clamp(appearances*goalRate[player.position]*skill*form,0,Math.min(50,appearances*2)))
 const assists=Math.round(clamp(appearances*assistRate[player.position]*skill*(.75+rng.next()*.5),0,Math.min(35,appearances)))
 const defensive=['GK','CB','LB','RB','CDM'].includes(player.position)
 const cleanSheets=defensive?Math.round(clamp(appearances*(.12+club.strength/330+player.attributes.defending/600)*(.7+rng.next()*.5),0,appearances)):0
 const standing=Math.round(clamp(18-club.strength*.12-(ovr-60)*.045+(rng.next()-.5)*10,1,20))
 const titleRoll=rng.next(),trophies=(standing===1?1:0)+(titleRoll<(.015+club.strength/1100)*(appearances>10?1:.25)?1:0)
 const trainingFactor=decision.training==='intensive'?1.35:decision.training==='balanced'?1:.42
 const ageFactor=player.age<=22?1.65:player.age<=26?1.1:player.age<=29?.6:player.age<=32?.08:-.55-(player.age-33)*.13
 track('development',()=>{for (const key of ATTRIBUTE_KEYS) {
  const capacity=Math.max(0,(player.potential-player.attributes[key])/12)
  const experience=chosenStory ? .75+appearances/44*.5 : 1
  const baseGrowth=ageFactor>0?ageFactor*trainingFactor*capacity*(.55+club.quality/120)*(availability*.65+.35)*(effect?.growth??1)*experience:ageFactor
  const relevant=WEIGHTS[player.position][key]>.15?1:.58
  const growth=Math.round(baseGrowth*relevant+(rng.next()-.5)*1.3-(decision.recovery==='early'?.3:0))
  player.attributes[key]=clamp(Math.min(player.potential,player.attributes[key]+growth))
 }
 })
 const endOvr=overall(player.attributes,player.position)
 track('matches',()=>{player.morale=clamp(player.morale+(appearances>=22?5:-6)+(trophies?7:0))})
 const marketValue=Math.round(Math.max(10000,Math.pow(Math.max(1,endOvr-35),3)*36*(player.age<28?1.25:Math.max(.2,1-(player.age-28)*.07)))/1000)*1000
 events.push(state.history.length===0?`Academy debut for ${club.name}.`:`${decision.training[0].toUpperCase()+decision.training.slice(1)} training shaped this season's development.`)
 if (trophies) events.push(`${trophies} team ${trophies===1?'trophy':'trophies'} won with ${club.name}.`)
 if (endOvr>Math.max(startingOvr,...state.history.map((season)=>season.endOvr))) events.push(`New career peak: ${endOvr} OVR.`)
 if(goals>0 && state.history.every((season)=>season.goals===0)) events.push('First senior goal: the start of your scoring record.')
 if(cleanSheets>0 && state.history.every((season)=>season.cleanSheets===0)) events.push('First recorded clean sheet: a defensive milestone.')
 const summary=`${appearances} appearances at ${club.name}. ${decision.training==='intensive'?'Intensive work traded fitness for growth.':decision.training==='recovery'?'Recovery training prioritised fitness over growth.':'Balanced training supported steady development.'} ${club.opportunity<50?'Strong facilities came with competition for minutes.':'Playing opportunity helped build experience.'} Rating ${endOvr>=startingOvr?'+':''}${endOvr-startingOvr}.`
 const season: Season={number:state.history.length+1,age:player.age,clubId:player.clubId,position:player.position,ovr,endOvr,appearances,goals,assists,cleanSheets,standing,trophies,marketValue,salary:Math.round(club.salary*(.8+endOvr/100)),fitness:player.fitness,morale:player.morale,injury:player.injuryStatus,summary,decision:{...decision},events}
 if(chosenStory){
  season.salary=contract.salary
  season.review={before,after:{fitness:player.fitness,morale:player.morale,coachTrust:player.coachTrust,ovr:endOvr},expectedApps:contract.projectedApps,fromClubId:state.player.clubId,story:{eventId:decision.storyEvent??legacySeasonStory(state).id,title:(decision.storyEvent?(decision.rules==='1.3'?seasonStory(state,decision.transfer,decision):legacyContextStory(state,decision.transfer)):legacySeasonStory(state)).title,choiceId:chosenStory.id,label:chosenStory.label,effect:{...chosenStory.effect}},bonus:effect?.bonus??0}
  if(decision.storyEvent){season.review.changes=changes;season.review.matchFactors={base:baseSelection,story:effect?.role??0,coach:coachRole,final:role,availability}}
  if(decision.rules==='1.3'){season.review.goal=evaluateGoal(state,season);const thread=nextThread(state,decision);if(thread)season.review.thread=thread}
  player.contract={salary:contract.salary,yearsLeft:Math.max(0,contract.years-1)}
 }
 player.age+=1
 return {...state,player,rng:rng.state(),history:[...state.history,season],status:player.age>=MAX_AGE?'retired':'playing'}
}
export function retireCareer(state: GameState): GameState { if (!state.history.length) throw new Error('Play at least one season before retiring.');return {...state,status:'retired'} }
export function careerResult(state: GameState): CareerResult {
 const history=state.history, sum=(key:'appearances'|'goals'|'assists'|'trophies'|'cleanSheets')=>history.reduce((total,season)=>total+season[key],0)
 const matches=sum('appearances'),goals=sum('goals'),assists=sum('assists'),trophies=sum('trophies'),cleanSheets=sum('cleanSheets')
 const peakOvr=Math.max(overall(state.player.attributes,state.player.position),...history.map((season)=>Math.max(season.ovr,season.endOvr)))
 const production=history.length?history.reduce((total,season)=>{ const defensive=['GK','CB','LB','RB','CDM'].includes(season.position);const contribution=defensive?season.cleanSheets/Math.max(1,season.appearances):((season.goals+season.assists)/Math.max(1,season.appearances))/(goalRate[season.position]+assistRate[season.position]);return total+Math.min(1,contribution/(defensive?.48:1.15)) },0)/history.length:0
 const breakdown=[
  {label:'Peak ability',points:Math.round(clamp((peakOvr-40)/55,0,1)*35),maximum:35,explanation:'Best positional rating; 95 OVR earns all 35 points.'},
  {label:'Role contribution',points:Math.round(production*20),maximum:20,explanation:'Attacking output for forwards and midfielders; clean sheets for defensive roles, measured season by season.'},
  {label:'Team honours',points:Math.round(Math.min(1,trophies/8)*15),maximum:15,explanation:'Eight team trophies earn all 15 points.'},
  {label:'Consistency',points:Math.round(Math.min(1,matches/Math.max(1,history.length*32))*15),maximum:15,explanation:'Average 32 appearances per season for all 15 points.'},
  {label:'Career length',points:Math.round(Math.min(1,history.length/20)*15),maximum:15,explanation:'Twenty completed seasons earn all 15 points.'},
 ]
 const score=breakdown.reduce((total,item)=>total+item.points,0)
 const ending: CareerResult['ending']=score>=85?'Football Legend':score>=70?'World-Class Star':score>=55?'Club Hero':score>=35?'Professional Veteran':'Unfulfilled Potential'
 return {matches,goals,assists,cleanSheets,trophies,peakOvr,clubs:[...new Set(history.map((season)=>season.clubId))],score,ending,breakdown}
}
