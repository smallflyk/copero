import {clubs} from '../../data/clubs'
import {getNation,nations} from '../../data/nations'
import {clamp} from './effects'
import {generator,hashSeed} from './random'
import type {CompetitionRound,CupCampaign,Decision,Fixture,GameState,MatchStats,NationalSeason,Player,Position,Season} from './types'
export const cupSides=[...clubs.map(c=>({id:c.id,name:c.name,strength:c.strength})),{id:'meadow',name:'Meadow Park',strength:60}]
export const roundLabels:Record<CompetitionRound,string>={last32:'Round of 32',last16:'Round of 16',quarter:'Quarter-finals',semi:'Semi-finals',final:'Final',friendly:'Friendly'}
export const nationalReasons={selected:'Selected for national duty',rating:'Your rating is below the squad threshold.',minutes:'Play at least 12 club matches to earn consideration.',fitness:'Finish with at least 55 fitness to be available.',injury:'Unavailable for national duty after injury.',rest:'You declined this call-up to protect your club fitness.'} as const
export const internationalKind=(season:number):NationalSeason['kind']=>season%4===0?'global':season%4===2?'regional':'friendly'
export const competitionLabels={friendly:'International friendlies',regional:'Regional Nations Cup',global:'Global Nations Cup'} as const
const zero=():MatchStats=>({appearances:0,goals:0,assists:0,cleanSheets:0})
export function fixtureStats(fixtures:Fixture[]):MatchStats {return fixtures.reduce((t,m)=>({appearances:t.appearances+(m.played?1:0),goals:t.goals+m.goals,assists:t.assists+m.assists,cleanSheets:t.cleanSheets+m.cleanSheets}),zero())}
const scoringShare:Record<Position,number>={ST:.36,LW:.22,RW:.22,CAM:.16,CM:.08,CDM:.04,LB:.03,RB:.03,CB:.04,GK:0}
const assistShare:Record<Position,number>={ST:.12,LW:.24,RW:.24,CAM:.36,CM:.3,CDM:.12,LB:.12,RB:.12,CB:.06,GK:.02}
type Side={id:string;strength:number}
type Contribution={team:string;player:Player;rating:number;chance:number}
function match(home:Side,away:Side,round:CompetitionRound,rng:ReturnType<typeof generator>,user:Contribution):Fixture {
 const score=(delta:number)=>Array.from({length:4},()=>rng.next()<clamp(.3+delta/300,.12,.65)?1:0).reduce<number>((a,b)=>a+b,0)
 const homeGoals=score(home.strength-away.strength),awayGoals=score(away.strength-home.strength)
 let homePens:number|undefined,awayPens:number|undefined
 if(homeGoals===awayGoals&&round!=='friendly'){homePens=3+Math.floor(rng.next()*3);awayPens=homePens+(rng.next()<.5?-1:1)}
 const winner=homeGoals===awayGoals?round==='friendly'?'':homePens!>awayPens!?home.id:away.id:homeGoals>awayGoals?home.id:away.id
 const own=home.id===user.team||away.id===user.team,played=own&&rng.next()<user.chance
 let goals=0,assists=0;const teamGoals=home.id===user.team?homeGoals:awayGoals
 if(played)for(let i=0;i<teamGoals;i++){if(rng.next()<scoringShare[user.player.position]*(.8+user.rating/250))goals++;else if(rng.next()<assistShare[user.player.position])assists++}
 return {round,home:home.id,away:away.id,homeGoals,awayGoals,...(homePens!==undefined?{homePens,awayPens}:{}),winner,played,goals,assists,cleanSheets:played&&['GK','CB','LB','RB','CDM'].includes(user.player.position)&&(home.id===user.team?awayGoals:homeGoals)===0?1:0}
}
function knockout(sides:Side[],seed:string,user:Contribution):CupCampaign {
 const rng=generator(hashSeed(seed)),remaining=[...sides]
 for(let i=remaining.length-1;i>0;i--){const j=Math.floor(rng.next()*(i+1));[remaining[i],remaining[j]]=[remaining[j],remaining[i]]}
 const fixtures:Fixture[]=[];let field=remaining
 while(field.length>1){const round:CompetitionRound=field.length===32?'last32':field.length===16?'last16':field.length===8?'quarter':field.length===4?'semi':'final',next:Side[]=[]
  for(let i=0;i<field.length;i+=2){const result=match(field[i],field[i+1],round,rng,user);fixtures.push(result);next.push(field[i].id===result.winner?field[i]:field[i+1])}field=next
 }
 const stats=fixtureStats(fixtures),winner=field[0].id
 return {...stats,fixtures,winner,medal:winner===user.team&&stats.appearances>0}
}
export function domesticCup(state:GameState,player:Player,decision:Decision,rating:number,role:number,availability:number):CupCampaign {
 const plan=decision.cupPlan??'balanced',strength=plan==='push'?6:plan==='rotate'?-7:0,chance=clamp(role+(plan==='push'?.12:plan==='rotate'?-.25:0),0,.98)*availability
 const sides=cupSides.map(c=>({id:c.id,strength:c.strength+(c.id===player.clubId?strength+(rating-65)*.15:0)}))
 return knockout(sides,`${state.seed}:cup:${state.history.length+1}`,{team:player.clubId,player,rating,chance})
}
export function nationalThreshold(state:GameState):number {
 const caps=state.history.reduce((n,s)=>n+(s.competitions?.national.appearances??0),0),declines=state.history.slice(-3).filter(s=>s.competitions?.national.status==='declined').length
 return getNation(state.player.nationality).threshold-Math.min(2,Math.floor(caps/20))+declines
}
export function nationalSeason(state:GameState,player:Player,decision:Decision,rating:number,clubApps:number):NationalSeason {
 const nation=getNation(player.nationality),threshold=nationalThreshold(state),kind=internationalKind(state.history.length+1)
 const reason:NationalSeason['reason']=player.injuryStatus!=='healthy'?'injury':player.fitness<55?'fitness':clubApps<12?'minutes':rating<threshold?'rating':decision.internationalPlan==='rest'?'rest':'selected'
 const status:NationalSeason['status']=reason==='selected'?'called':reason==='rest'?'declined':'not-selected'
 const base:NationalSeason={...zero(),country:nation.name,kind,status,reason,threshold,rating,fitness:player.fitness,clubApps,injury:player.injuryStatus,fixtures:[],medal:false,fatigue:0}
 if(status!=='called')return base
 const user={team:nation.name,player,rating,chance:clamp(.68+(rating-threshold)*.025,.4,.95)},seed=`${state.seed}:national:${nation.name}:${state.history.length+1}`
 if(kind==='friendly'){
  const rng=generator(hashSeed(seed)),opponents=nations.filter(n=>n.name!==nation.name);for(let i=opponents.length-1;i>0;i--){const j=Math.floor(rng.next()*(i+1));[opponents[i],opponents[j]]=[opponents[j],opponents[i]]}
  const fixtures=opponents.slice(0,2).map(other=>match({id:nation.name,strength:nation.strength+(rating-65)*.1},{id:other.name,strength:other.strength},'friendly',rng,user)),stats=fixtureStats(fixtures)
  return {...base,...stats,fixtures,fatigue:stats.appearances*2}
 }
 const pool=nations.filter(n=>kind==='global'||n.region===nation.region).map(n=>({id:n.name,strength:n.strength+(n.name===nation.name?(rating-65)*.1:0)})),campaign=knockout(pool,seed,user)
 return {...base,...campaign,fatigue:campaign.appearances*2}
}
export function cupStage(campaign:{fixtures:Fixture[];winner?:string},team:string):string {if(campaign.winner===team)return 'Champions';const last=campaign.fixtures.filter(m=>m.home===team||m.away===team).at(-1);return last?roundLabels[last.round]:'No tournament appearance'}
export function competitionRecords(state:GameState) {
 const seasons=state.history.filter(s=>s.competitions),sum=(key:keyof MatchStats)=>seasons.reduce((n,s)=>n+s.competitions!.national[key],0)
 return {recordedSeasons:seasons.length,firstSeason:seasons[0]?.number,cupMedals:seasons.filter(s=>s.competitions!.cup.medal).length,cupGoals:seasons.reduce((n,s)=>n+s.competitions!.cup.goals,0),cupAssists:seasons.reduce((n,s)=>n+s.competitions!.cup.assists,0),cupCleanSheets:seasons.reduce((n,s)=>n+s.competitions!.cup.cleanSheets,0),cupAppearances:seasons.reduce((n,s)=>n+s.competitions!.cup.appearances,0),national:{country:state.player.nationality,appearances:sum('appearances'),goals:sum('goals'),assists:sum('assists'),cleanSheets:sum('cleanSheets'),titles:seasons.filter(s=>s.competitions!.national.medal).length,callUps:seasons.filter(s=>s.competitions!.national.status==='called').length,declines:seasons.filter(s=>s.competitions!.national.status==='declined').length},seasons}
}
export function competitionMilestones(state:GameState):{id:string;label:string;season:Season;target:number;metric:string}[] {
 const found:{id:string;label:string;season:Season;target:number;metric:string}[]=[],seen=new Set<string>();let caps=0
 for(const season of state.history){const c=season.competitions;if(!c)continue;caps+=c.national.appearances
  for(const [id,label,hit,target] of [['cup-debut','Domestic cup debut',c.cup.appearances>0,1],['cup-medal','First domestic cup medal',c.cup.medal,1],['national-debut','Senior international debut',c.national.appearances>0,1],['national-title','First national team title',c.national.medal,1],...([10,25,50] as const).map(n=>[`caps-${n}`,`${n} international caps`,caps>=n,n])] as [string,string,boolean,number][]){if(hit&&!seen.has(id)){seen.add(id);found.push({id,label,season,target,metric:id.startsWith('caps')?'caps':'competition'})}}
 }
 return found
}
