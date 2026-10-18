import test from 'node:test'
import assert from 'node:assert/strict'
import { sourceModule } from '../scripts/source-module.mjs'
const engine=sourceModule('lib/game/engine.ts')
const {createCareer,nextSeason,careerResult,defaultDecision,overall,transferOffers,retireCareer}=engine
const {decodeSave}=sourceModule('lib/game/storage.ts')
const {ZERO_BONUSES,WEIGHTS,TEMPLATES}=sourceModule('lib/game/rules.ts')
const {POSITIONS,ATTRIBUTE_KEYS}=sourceModule('lib/game/types.ts')
const config=(overrides={})=>({name:'Test Player',nationality:'England',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{...ZERO_BONUSES},seed:'repeatable-test',clubId:'riverside',...overrides})
function finish(position='ST',seed='repeatable-test',training='balanced') {let state=createCareer(config({position,seed}));while(state.status==='playing')state=nextSeason(state,{...defaultDecision(state),training});return state}
test('every position completes 22 bounded seasons and reconciles retirement totals',()=>{
 for(const position of POSITIONS)for(let run=0;run<12;run++){
  const state=finish(position,`position-${position}-${run}`),result=careerResult(state)
  assert.equal(state.status,'retired');assert.equal(state.player.age,38);assert.equal(state.history.length,22)
  for(const key of ATTRIBUTE_KEYS)assert.ok(state.player.attributes[key]>=1&&state.player.attributes[key]<=99)
  for(const [key,field] of [['appearances','matches'],['goals','goals'],['assists','assists'],['cleanSheets','cleanSheets'],['trophies','trophies']])assert.equal(result[field],state.history.reduce((total,season)=>total+season[key],0))
  assert.ok(result.score>=0&&result.score<=100)
  assert.equal(result.score,result.breakdown.reduce((total,item)=>total+item.points,0))
  assert.deepEqual(decodeSave(JSON.stringify(state)),state)
 }
})
test('seed plus identical full decisions reproduce the exact complete career',()=>{assert.deepEqual(finish('ST','same'),finish('ST','same'));assert.notDeepEqual(finish('ST','same'),finish('ST','different'))})
test('training choices have a measurable effect under the same initial conditions',()=>{
 const initial=createCareer(config()),before=JSON.stringify(initial)
 const intense=nextSeason(initial,{...defaultDecision(initial),training:'intensive'}),recovery=nextSeason(initial,{...defaultDecision(initial),training:'recovery'})
 assert.ok(intense.player.fitness<recovery.player.fitness);assert.notDeepEqual(intense.player.attributes,recovery.player.attributes);assert.equal(JSON.stringify(initial),before)
})
test('OVR uses positional weights rather than a six-attribute average',()=>{
 for(const position of POSITIONS)assert.ok(Math.abs(Object.values(WEIGHTS[position]).reduce((a,b)=>a+b,0)-1)<1e-9)
 assert.ok(overall(TEMPLATES.ST,'ST')>overall(TEMPLATES.ST,'CB'))
 assert.ok(overall(TEMPLATES.GK,'GK')>overall(TEMPLATES.GK,'ST'))
})
test('there is no opening transfer or injury recovery event for a healthy prospect',()=>{
 const state=createCareer(config());assert.deepEqual(transferOffers(state),{})
 assert.throws(()=>nextSeason(state,{...defaultDecision(state),transfer:'bigger'}),/not available/)
 assert.throws(()=>nextSeason(state,{...defaultDecision(state),recovery:'early'}),/only available/)
})
test('only suitable larger club offers qualify and a transfer updates club and salary',()=>{
 let state=nextSeason(createCareer(config()),{training:'balanced',relationship:'follow',transfer:'stay'})
 state={...state,player:{...state.player,attributes:{pace:88,shooting:88,passing:88,dribbling:88,defending:88,physical:88}}}
 const offers=transferOffers(state);assert.equal(offers.bigger,'capital')
 const moved=nextSeason(state,{...defaultDecision(state),transfer:'bigger'}),stayed=nextSeason(state,defaultDecision(state))
 assert.equal(moved.player.clubId,'capital');assert.ok(moved.history.at(-1).salary>stayed.history.at(-1).salary)
 assert.ok(moved.history.at(-1).events.some((event)=>event.includes('Transferred')))
})
test('rehabilitation changes availability, fitness, and next-season risk',()=>{
 let fullFitness=0,earlyFitness=0,fullApps=0,earlyApps=0
 for(let run=0;run<100;run++){
  const state=createCareer(config({seed:`rehab-${run}`}));state.player.injuryStatus='major';state.player.fitness=50
  const full=nextSeason(state,{...defaultDecision(state),recovery:'full'}),early=nextSeason(state,{...defaultDecision(state),recovery:'early'})
  fullFitness+=full.player.fitness;earlyFitness+=early.player.fitness;fullApps+=full.history[0].appearances;earlyApps+=early.history[0].appearances
 }
 assert.ok(fullFitness>earlyFitness);assert.ok(earlyApps>fullApps)
})
test('ageing eventually reduces ability instead of allowing perpetual growth',()=>{
 const state=finish('CM','ageing');const at29=state.history.find((season)=>season.age===29)
 assert.ok(at29.endOvr>state.history.at(-1).endOvr)
 assert.throws(()=>nextSeason(state,defaultDecision(state)),/already complete/)
})
test('goalkeepers can earn a role contribution score without scoring goals',()=>{
 const state=finish('GK','keeper');const score=careerResult(state)
 assert.equal(score.goals,0);assert.ok(score.cleanSheets>0);assert.ok(score.breakdown.find((item)=>item.label==='Role contribution').points>0)
})
test('invalid setup and corrupt or incompatible saves fail safely',()=>{
 assert.throws(()=>createCareer(config({name:'x'})),/name/)
 assert.throws(()=>createCareer(config({jerseyNumber:0})),/number/)
 assert.throws(()=>createCareer(config({position:'XYZ'})),/position/)
 assert.throws(()=>createCareer(config({bonuses:{...ZERO_BONUSES,pace:4,shooting:4}})),/six/)
 assert.throws(()=>decodeSave('not json'))
 assert.throws(()=>decodeSave('{"version":0}'),/unsupported/)
 const state=finish();const invalid=JSON.parse(JSON.stringify(state));invalid.history[0].goals=-1
 assert.throws(()=>decodeSave(JSON.stringify(invalid)),/damaged/)
 const incomplete=JSON.parse(JSON.stringify(state));delete incomplete.history[0].decision
 assert.throws(()=>decodeSave(JSON.stringify(incomplete)),/damaged/)
})
test('saved progress restores the random sequence, decisions, and next season',()=>{
 const first=nextSeason(createCareer(config()),{training:'intensive',relationship:'ask',transfer:'stay'})
 const restored=decodeSave(JSON.stringify(first))
 assert.deepEqual(nextSeason(first,defaultDecision(first)),nextSeason(restored,defaultDecision(restored)))
})
test('voluntary retirement requires one season and gives a transparent ending',()=>{
 const state=createCareer(config());assert.throws(()=>retireCareer(state),/at least one/)
 const retired=retireCareer(nextSeason(state,defaultDecision(state)));assert.equal(retired.status,'retired');assert.equal(retired.history.length,1);assert.equal(careerResult(retired).breakdown.length,5)
})
test('blocked browser storage preserves the latest in-tab career instead of restoring a stale save',()=>{
 const storage=sourceModule('lib/game/storage.ts'),items=new Map();let blocked=false
 globalThis.window={localStorage:{getItem:(key)=>items.get(key)||null,setItem:(key,value)=>{if(blocked)throw new Error('quota');items.set(key,value)},removeItem:(key)=>items.delete(key)}}
 try {
  storage.clearCareer();const old=createCareer(config({seed:'old'}));storage.saveCareer(old)
  blocked=true;const fresh=createCareer(config({seed:'fresh'}));const warning=storage.saveCareer(fresh)
  assert.ok(warning.includes('unavailable or full'));assert.deepEqual(storage.readSave().state,fresh);assert.equal(storage.readSave().warning,warning)
  storage.clearCareer()
 }finally{delete globalThis.window}
})
test('the top retirement ending is reachable through normal decisions, without edited saves',()=>{
 let state=createCareer(config({seed:'balance-65',clubId:'capital',bonuses:{...ZERO_BONUSES,shooting:4,dribbling:2}}))
 while(state.status==='playing'){
  const offers=transferOffers(state)
  state=nextSeason(state,{...defaultDecision(state),training:state.player.fitness<50?'recovery':'intensive',transfer:offers.bigger?'bigger':'stay'})
 }
 assert.equal(careerResult(state).ending,'Football Legend');assert.ok(careerResult(state).score>=85)
})
