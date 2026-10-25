import {getNation,nations} from '../../data/nations'
import {cupSides,fixtureStats,internationalKind,nationalReasons,nationalThreshold} from './competitions'
import type {Fixture,GameState,MatchStats,Season} from './types'
const int=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isInteger(n)&&n>=min&&n<=max
function validFixtures(value:unknown,pool:string[],team:string,season:Season,friendly=false):value is Fixture[] {
 if(!Array.isArray(value)||value.length!==(friendly?2:pool.length-1))return false
 let field=[...pool],offset=0
 const defend=['GK','CB','LB','RB','CDM'].includes(season.position)
 while(friendly?offset<2:field.length>1){
  const round=friendly?'friendly':field.length===32?'last32':field.length===16?'last16':field.length===8?'quarter':field.length===4?'semi':'final',count=friendly?2:field.length/2,rows=value.slice(offset,offset+count),seen=new Set<string>(),winners:string[]=[]
  for(const m of rows){
   if(!m||m.round!==round||!field.includes(m.home)||!field.includes(m.away)||m.home===m.away||!int(m.homeGoals,0,4)||!int(m.awayGoals,0,4)||typeof m.played!=='boolean')return false
   if(!friendly&&(seen.has(m.home)||seen.has(m.away)))return false;seen.add(m.home);seen.add(m.away)
   if(friendly&&m.home!==team)return false
   const tied=m.homeGoals===m.awayGoals
   if(tied&&!friendly){if(!int(m.homePens,2,6)||!int(m.awayPens,2,6)||Math.abs(m.homePens-m.awayPens)!==1||m.winner!==(m.homePens>m.awayPens?m.home:m.away))return false}
   else if(m.homePens!==undefined||m.awayPens!==undefined||m.winner!==(tied?'':m.homeGoals>m.awayGoals?m.home:m.away))return false
   const own=m.home===team||m.away===team,teamGoals=m.home===team?m.homeGoals:m.awayGoals,against=m.home===team?m.awayGoals:m.homeGoals
   if(m.played&&!own||!int(m.goals,0,m.played?teamGoals:0)||!int(m.assists,0,m.played?teamGoals-m.goals:0)||m.cleanSheets!==(m.played&&defend&&against===0?1:0)||season.position==='GK'&&m.goals!==0)return false
   winners.push(m.winner)
  }
  if(!friendly&&seen.size!==field.length)return false
  field=winners;offset+=count
 }
 return friendly?value[0].away!==value[1].away:offset===value.length
}
const statsMatch=(stats:MatchStats,fixtures:Fixture[])=>{const actual=fixtureStats(fixtures);return (['appearances','goals','assists','cleanSheets'] as const).every(k=>stats[k]===actual[k])}
export function validCompetitions(state:GameState,index:number):boolean {
 const s=state.history[index],c=s.competitions
 if(s.decision.rules!=='1.4')return c===undefined
 if(!c||!c.league||!c.cup||!c.national||!['balanced','push','rotate'].includes(s.decision.cupPlan??'')||!['accept','rest'].includes(s.decision.internationalPlan??''))return false
 const l=c.league,cup=c.cup,n=c.national,clubPool=cupSides.map(t=>t.id)
 if(!int(l.appearances,0,38)||!int(l.goals,0,Math.min(50,l.appearances*2))||!int(l.assists,0,Math.min(35,l.appearances))||!int(l.cleanSheets,0,l.appearances)||l.title!==(s.standing===1))return false
 if(!validFixtures(cup.fixtures,clubPool,s.clubId,s)||!statsMatch(cup,cup.fixtures)||cup.winner!==cup.fixtures.at(-1)!.winner||cup.medal!==(cup.winner===s.clubId&&cup.appearances>0))return false
 for(const k of ['appearances','goals','assists','cleanSheets'] as const)if(s[k]!==l[k]+cup[k])return false
 if(s.trophies!==(l.title?1:0)+(cup.medal?1:0)||n.country!==state.player.nationality||!nations.some(t=>t.name===n.country)||n.kind!==internationalKind(s.number)||!Object.keys(nationalReasons).includes(n.reason)||n.rating!==s.ovr||!int(n.fitness,1,99)||n.clubApps!==s.appearances||n.injury!==s.injury||n.threshold!==nationalThreshold({...state,history:state.history.slice(0,index)}))return false
 const reason=n.injury!=='healthy'?'injury':n.fitness<55?'fitness':n.clubApps<12?'minutes':n.rating<n.threshold?'rating':s.decision.internationalPlan==='rest'?'rest':'selected'
 if(s.fitness!==Math.max(1,n.fitness-n.fatigue))return false
 if(n.reason!==reason||n.status!==(reason==='selected'?'called':reason==='rest'?'declined':'not-selected'))return false
 if(n.status!=='called')return Array.isArray(n.fixtures)&&n.fixtures.length===0&&statsMatch(n,[])&&n.medal===false&&n.fatigue===0&&n.winner===undefined
 const nation=getNation(n.country),pool=nations.filter(t=>n.kind!=='regional'||t.region===nation.region).map(t=>t.name)
 if(!validFixtures(n.fixtures,pool,n.country,s,n.kind==='friendly')||!statsMatch(n,n.fixtures)||n.fatigue!==n.appearances*2)return false
 return n.kind==='friendly'?n.medal===false&&n.winner===undefined:n.winner===n.fixtures.at(-1)!.winner&&n.medal===(n.winner===n.country&&n.appearances>0)
}
