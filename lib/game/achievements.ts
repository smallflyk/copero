import type {GameState,Season,StageGoal} from './types'
export type Achievement={id:string;label:string;season:Season;target:number;metric:string}
const thresholds={appearances:[100,300,500],goals:[100,200,300,400,500],assists:[50,100,200],cleanSheets:[50,100,200]} as const
export function achievements(state:GameState):Achievement[] {
 const found:Achievement[]=[]
 for(const metric of Object.keys(thresholds) as (keyof typeof thresholds)[]){let total=0;const seen=new Set<number>();for(const season of state.history){total+=season[metric];for(const target of thresholds[metric])if(total>=target&&!seen.has(target)){seen.add(target);found.push({id:`${metric}-${target}`,label:`${target} career ${metric==='appearances'?'appearances':metric==='cleanSheets'?'clean sheets':metric}`,season,target,metric})}}}
 let club='',run=0;const loyal=new Set<number>()
 for(const season of state.history){run=season.clubId===club?run+1:1;club=season.clubId;for(const target of [5,10])if(run>=target&&!loyal.has(target)){loyal.add(target);found.push({id:`loyalty-${target}`,label:`${target} consecutive seasons at one club`,season,target,metric:'loyalty'})}}
 return found.sort((a,b)=>a.season.number-b.season.number||a.id.localeCompare(b.id))
}
export function stageGoal(state:GameState):Pick<StageGoal,'id'|'target'> {return state.player.age<=22?{id:'breakthrough',target:22}:state.player.age<=29?{id:'regular',target:30}:{id:'longevity',target:60}}
export function evaluateGoal(state:GameState,season:Season):StageGoal {const goal=stageGoal(state),actual=goal.id==='longevity'?season.injury==='healthy'?season.fitness:0:season.appearances;return {...goal,actual,achieved:actual>=goal.target}}
export const goalLabels={breakthrough:'Establish yourself: play 22 matches this season.',regular:'Become a regular: play 30 matches this season.',longevity:'Stay available: finish healthy with at least 60 fitness.'} as const
export function nextMilestones(state:GameState) {
 const defensive=['GK','CB','LB','RB','CDM'].includes(state.player.position),metrics=defensive?['appearances','cleanSheets','assists'] as const:['appearances','goals','assists'] as const
 return metrics.flatMap(metric=>{const actual=state.history.reduce((sum,s)=>sum+s[metric],0),target=thresholds[metric].find(n=>n>actual);return target?[{metric,actual,target,label:`${target} career ${metric==='appearances'?'appearances':metric==='cleanSheets'?'clean sheets':metric}`}]:[]})
}
