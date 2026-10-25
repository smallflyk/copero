import {competitionRecords} from './competitions'
import {achievements} from './achievements'
import type {GameState,Season} from './types'

export function careerRecords(state:GameState) {
 const stints:{clubId:string;firstAge:number;lastAge:number;seasons:number;matches:number;goals:number;assists:number;cleanSheets:number;trophies:number;earnings:number}[]=[]
 for(const s of state.history){
  let stint=stints.at(-1)
  if(!stint||stint.clubId!==s.clubId){stint={clubId:s.clubId,firstAge:s.age,lastAge:s.age,seasons:0,matches:0,goals:0,assists:0,cleanSheets:0,trophies:0,earnings:0};stints.push(stint)}
  stint.lastAge=s.age;stint.seasons++;stint.matches+=s.appearances;stint.goals+=s.goals;stint.assists+=s.assists;stint.cleanSheets+=s.cleanSheets;stint.trophies+=s.trophies;stint.earnings+=s.salary+(s.review?.bonus??0)
 }
 // Best season means highest end-of-season rating, then appearances, then earliest season.
 const bestSeason=[...state.history].sort((a,b)=>b.endOvr-a.endOvr||b.appearances-a.appearances||a.number-b.number)[0]
 const first=(test:(s:Season)=>boolean)=>state.history.find(test)
 return {stints,bestSeason,competitions:competitionRecords(state),achievements:achievements(state),earnings:stints.reduce((sum,s)=>sum+s.earnings,0),peakValue:Math.max(0,...state.history.map(s=>s.marketValue)),milestones:[
  {label:'Senior debut',season:first(s=>s.appearances>0)},
  {label:'First senior goal',season:first(s=>s.goals>0)},
  {label:'First clean sheet',season:first(s=>s.cleanSheets>0)},
  {label:'First team trophy',season:first(s=>s.trophies>0)},
 ].filter(item=>item.season)}
}
