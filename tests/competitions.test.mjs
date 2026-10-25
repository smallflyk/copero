import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {sourceModule} from '../scripts/source-module.mjs'
const {createCareer,nextSeason,competitionDecision,careerResult}=sourceModule('lib/game/engine.ts')
const {seasonStory}=sourceModule('lib/game/stories.ts')
const {domesticCup,nationalSeason,nationalThreshold,competitionRecords,competitionMilestones,cupSides,internationalKind}=sourceModule('lib/game/competitions.ts')
const {decodeSave}=sourceModule('lib/game/storage.ts')
const {nations,getNation}=sourceModule('data/nations.ts')
const {POSITIONS}=sourceModule('lib/game/types.ts')
const {NATIONALITIES}=sourceModule('lib/game/rules.ts')
const config={name:'Country QA',nationality:'Nigeria',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{pace:0,shooting:0,passing:0,dribbling:0,defending:0,physical:0},seed:'cups-qa',clubId:'riverside'}
function play(s,extra={},pick=0){const d={...competitionDecision(s),...extra},event=seasonStory(s,d.transfer,d),choices=event.choices.filter(c=>!c.unavailableReason);return nextSeason(s,{...d,storyEvent:event.id,story:choices[pick%choices.length].id})}
const legacy=JSON.parse(fs.readFileSync('tests/fixtures/progression-v13-save.json','utf8'))
test('recorded rules 1.3 decisions retain exact replay and old seasons are never backfilled',()=>{
 assert.deepEqual(decodeSave(JSON.stringify(legacy.state)),legacy.state);assert.deepEqual(nextSeason(legacy.state,legacy.decision),legacy.next)
 const next=play(legacy.state);assert.deepEqual(next.history.slice(0,-1),legacy.state.history);assert.ok(next.history.at(-1).competitions);assert.deepEqual(decodeSave(JSON.stringify(next)),next)
 const records=competitionRecords(next);assert.equal(records.recordedSeasons,1);assert.equal(records.firstSeason,7)
})
test('new seasons require valid competition plans while historical decisions still load',()=>{
 const s=createCareer(config),event=seasonStory(s);const d={...competitionDecision(s),storyEvent:event.id,story:event.choices[0].id}
 for(const extra of [{cupPlan:undefined},{cupPlan:'win'},{internationalPlan:undefined},{internationalPlan:'switch-country'}])assert.throws(()=>nextSeason(s,{...d,...extra}),/cup and international/)
})
test('all 16 playable nationalities have profiles and each regional field has eight unique teams',()=>{
 assert.equal(nations.length,32);assert.equal(new Set(nations.map(n=>n.name)).size,32)
 for(const country of NATIONALITIES)assert.equal(getNation(country).name,country)
 for(const region of ['Europe','Americas','Africa','Asia'])assert.equal(nations.filter(n=>n.region===region).length,8)
 assert.equal(cupSides.length,8)
})
test('nationality changes squad eligibility at the same ability, fitness and club minutes',()=>{
 const s=createCareer(config),d=competitionDecision(s),player={...s.player,fitness:80,injuryStatus:'healthy'}
 const japan=nationalSeason({...s,player:{...player,nationality:'Japan'}},{...player,nationality:'Japan'},d,65,25)
 const france=nationalSeason({...s,player:{...player,nationality:'France'}},{...player,nationality:'France'},d,65,25)
 assert.equal(japan.status,'called');assert.equal(japan.country,'Japan');assert.equal(france.status,'not-selected');assert.equal(france.reason,'rating')
})
test('injury, fitness and minutes block call-ups, and declining an actual invitation earns no caps',()=>{
 const s=createCareer(config),p={...s.player,fitness:80,injuryStatus:'healthy'},d=competitionDecision(s)
 for(const [extra,apps,reason] of [[{injuryStatus:'major'},30,'injury'],[{fitness:54},30,'fitness'],[{},11,'minutes']])assert.equal(nationalSeason(s,{...p,...extra},d,80,apps).reason,reason)
 const rested=nationalSeason(s,p,{...d,internationalPlan:'rest'},80,30);assert.equal(rested.status,'declined');assert.equal(rested.appearances,0);assert.equal(rested.medal,false);assert.equal(rested.fatigue,0);assert.deepEqual(rested.fixtures,[])
 assert.equal(nationalSeason(s,{...p,fitness:20},{...d,internationalPlan:'rest'},80,30).status,'not-selected')
})
test('caps and recent declined invitations affect later selection thresholds',()=>{
 const s=createCareer(config),base=nationalThreshold(s)
 s.history=[{competitions:{national:{appearances:20,status:'called'}}}];assert.equal(nationalThreshold(s),base-1)
 s.history=[1,2,3].map(()=>({competitions:{national:{appearances:0,status:'declined'}}}));assert.equal(nationalThreshold(s),base+3)
})
test('domestic brackets have coherent opponents, scorelines and winners; unused players earn no medal',()=>{
 for(const position of POSITIONS)for(let run=0;run<10;run++){
  const s=createCareer({...config,position,seed:`cup-${position}-${run}`}),p={...s.player,clubId:'aurora'}
  const cup=domesticCup(s,p,competitionDecision(s),85,.85,1);assert.equal(cup.fixtures.length,7);assert.equal(cup.winner,cup.fixtures.at(-1).winner)
  const own=cup.fixtures.filter(m=>m.home===p.clubId||m.away===p.clubId),opponents=own.map(m=>m.home===p.clubId?m.away:m.home);assert.equal(new Set(opponents).size,opponents.length)
  assert.ok(cup.appearances<=3);assert.ok(cup.cleanSheets<=cup.appearances);if(position==='GK')assert.equal(cup.goals,0)
  for(const m of cup.fixtures){assert.ok(cupSides.some(t=>t.id===m.home)&&cupSides.some(t=>t.id===m.away));if(m.homePens!==undefined)assert.equal(m.homeGoals,m.awayGoals);if(!m.played)assert.equal(m.goals+m.assists+m.cleanSheets,0)}
  const unused=domesticCup(s,p,{...competitionDecision(s),cupPlan:'rotate'},85,0,0);assert.equal(unused.appearances,0);assert.equal(unused.medal,false)
 }
})
test('cup ambitions create a real workload and selection trade-off across seeds',()=>{
 let push=0,rotate=0
 for(let i=0;i<150;i++){const s=createCareer({...config,seed:`tradeoff-${i}`});push+=domesticCup(s,s.player,{...competitionDecision(s),cupPlan:'push'},70,.75,1).appearances;rotate+=domesticCup(s,s.player,{...competitionDecision(s),cupPlan:'rotate'},70,.75,1).appearances}
 assert.ok(push>rotate)
})
test('regional opponents stay in region, global cups have 32 teams, and friendlies award no tournament title',()=>{
 for(const country of NATIONALITIES){
  const s=createCareer({...config,nationality:country}),p={...s.player,fitness:99,injuryStatus:'healthy'}
  for(const [length,kind,count] of [[0,'friendly',2],[1,'regional',7],[3,'global',31]]){
   s.history=Array.from({length},()=>({}));const n=nationalSeason(s,p,competitionDecision(s),90,35)
   assert.equal(n.kind,kind);assert.equal(n.fixtures.length,count);assert.equal(n.country,country)
   if(kind==='regional')for(const match of n.fixtures)assert.equal(getNation(match.home).region,getNation(country).region)
   if(kind==='friendly'){assert.equal(n.medal,false);assert.equal(n.winner,undefined)}
   assert.ok(n.appearances<=(kind==='global'?5:kind==='regional'?3:2))
  }
 }
 assert.deepEqual([1,2,3,4,5].map(internationalKind),['friendly','regional','friendly','global','friendly'])
})
test('accepting national duty changes actual fitness while club and international totals stay separate',()=>{
 let checked=false
 for(let i=0;i<20&&!checked;i++){
  const s=createCareer({...config,seed:`duty-${i}`});s.player.attributes={pace:70,shooting:70,passing:70,dribbling:70,defending:70,physical:70}
  const a=play(s,{training:'recovery',internationalPlan:'accept'}),r=play(s,{training:'recovery',internationalPlan:'rest'}),n=a.history[0].competitions.national
  if(n.status==='called'&&n.appearances){assert.equal(r.history[0].competitions.national.status,'declined');assert.equal(a.history[0].appearances,r.history[0].appearances);assert.equal(a.rng,r.rng);assert.ok(a.player.fitness<r.player.fitness);checked=true}
 }
 assert.ok(checked)
})
test('all nationalities and roles finish, reload and replay with reconciled club and national records',()=>{
 const routes=[...NATIONALITIES.flatMap(n=>['ST','GK'].map(p=>[n,p])),...POSITIONS.map(p=>['Nigeria',p])]
 for(const [nationality,position] of routes){let s=createCareer({...config,nationality,position,seed:`life-${nationality}-${position}`}),initial=s
  while(s.status==='playing'){
   s=play(s,{training:s.player.fitness<65?'recovery':'balanced',cupPlan:s.history.length%3===0?'rotate':'push',internationalPlan:s.history.length%5===0?'rest':'accept'},s.history.length)
   const season=s.history.at(-1),c=season.competitions;assert.ok(season.appearances<=41);assert.equal(season.appearances,c.league.appearances+c.cup.appearances);assert.equal(c.national.country,nationality);assert.equal(season.review.changes.length,10);assert.ok(JSON.stringify(s).length<250000)
   assert.deepEqual(decodeSave(JSON.stringify(s)),s)
  }
  let replay=initial;for(const season of s.history)replay=nextSeason(replay,season.decision);assert.deepEqual(replay,s)
  const records=competitionRecords(s),result=careerResult(s);assert.equal(records.recordedSeasons,22);assert.equal(result.matches,s.history.reduce((n,s)=>n+s.appearances,0));assert.equal(records.national.appearances,s.history.reduce((n,s)=>n+s.competitions.national.appearances,0));if(position==='GK')assert.equal(records.national.goals,0)
  for(const [key,stat] of [['cupGoals','goals'],['cupAssists','assists'],['cupCleanSheets','cleanSheets']])assert.equal(records[key],s.history.reduce((n,s)=>n+s.competitions.cup[stat],0))
  const milestones=competitionMilestones(s);assert.equal(new Set(milestones.map(m=>m.id)).size,milestones.length)
 }
})
test('forged opponents, brackets, scorelines, call-ups, honours and doubled totals cannot load',()=>{
 let s=createCareer(config);s.player.attributes={pace:80,shooting:80,passing:80,dribbling:80,defending:80,physical:80};s=play(s,{training:'recovery'})
 const mutations=[x=>x.history[0].competitions.cup.fixtures[0].home='foreign-team',x=>x.history[0].competitions.cup.fixtures[0].home=x.history[0].competitions.cup.fixtures[0].away,x=>x.history[0].competitions.cup.winner='harbor',x=>x.history[0].competitions.cup.fixtures[0].homeGoals=99,x=>x.history[0].competitions.national.country='France',x=>x.history[0].competitions.national.appearances+=1,x=>x.history[0].competitions.national.medal=!x.history[0].competitions.national.medal,x=>x.history[0].competitions.national.threshold=1,x=>x.history[0].competitions.national.kind='global',x=>x.history[0].appearances+=1,x=>delete x.history[0].competitions]
 for(const mutate of mutations){const bad=structuredClone(s);mutate(bad);assert.throws(()=>decodeSave(JSON.stringify(bad)),/damaged/)}
})
test('a genuine multi-assist cup match can reload even when assists exceed total appearances',()=>{
 const s=createCareer({...config,position:'CAM',seed:'low-cup-326',clubId:'capital'});Object.assign(s.player,{fitness:1,injuryStatus:'major',coachTrust:1,morale:1});s.player.attributes=Object.fromEntries(Object.keys(s.player.attributes).map(k=>[k,40]))
 const next=play(s,{cupPlan:'push',recovery:'early',training:'intensive'}),season=next.history[0]
 assert.ok(season.assists>season.appearances);assert.deepEqual(decodeSave(JSON.stringify(next)),next)
})
