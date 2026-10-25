import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {sourceModule} from '../scripts/source-module.mjs'
const {createCareer,nextSeason,defaultDecision,clubOffers,careerResult,retireCareer}=sourceModule('lib/game/engine.ts')
const {legacySeasonStory:seasonStory}=sourceModule('lib/game/stories.ts')
const {careerRecords}=sourceModule('lib/game/records.ts')
const {decodeSave}=sourceModule('lib/game/storage.ts')
const {ZERO_BONUSES}=sourceModule('lib/game/rules.ts')
const {POSITIONS}=sourceModule('lib/game/types.ts')
const {t}=sourceModule('lib/i18n/translate.ts')
const config={name:'Decision Test',nationality:'England',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{...ZERO_BONUSES},seed:'decision-pair',clubId:'riverside'}
const play=(s,index=0,extra={})=>nextSeason(s,{...defaultDecision(s),story:seasonStory(s).choices[index].id,...extra})
test('story options apply visible, deterministic effects without changing the input state',()=>{
 let state=createCareer(config)
 for(let event=0;event<4;event++){
  const original=JSON.stringify(state),story=seasonStory(state),outputs=story.choices.map((_,i)=>play(state,i))
  assert.equal(new Set(outputs.map(JSON.stringify)).size,3)
  for(let i=0;i<3;i++){
   const season=outputs[i].history.at(-1),review=season.review
   assert.deepEqual(review.story.effect,story.choices[i].effect);assert.equal(review.story.choiceId,story.choices[i].id)
   assert.equal(review.before.fitness,state.player.fitness);assert.equal(review.after.fitness,season.fitness)
   assert.equal(review.after.coachTrust,outputs[i].player.coachTrust)
   assert.deepEqual(play(state,i),outputs[i]);assert.deepEqual(decodeSave(JSON.stringify(outputs[i])),outputs[i])
  }
  assert.equal(JSON.stringify(state),original)
  state=outputs[0]
 }
})
test('same seed story trade-offs change attributes, fitness, trust and actual playing opportunity',()=>{
 const s=createCareer(config),specialist=play(s,0),rest=play(s,2)
 assert.ok(specialist.player.fitness<rest.player.fitness)
 assert.ok(specialist.player.attributes.shooting>rest.player.attributes.shooting)
 assert.ok(specialist.player.coachTrust>rest.player.coachTrust)
 const next=specialist,minutes=play(next,0),development=play(next,1)
 assert.ok(minutes.history.at(-1).appearances>development.history.at(-1).appearances)
 assert.ok(minutes.player.fitness<development.player.fitness)
 const sponsorState=minutes,paid=play(sponsorState,0),team=play(sponsorState,2)
 assert.ok(paid.history.at(-1).review.bonus>0);assert.equal(team.history.at(-1).review.bonus,0)
 assert.ok(paid.player.coachTrust<team.player.coachTrust)
})
test('club quotes fix salary and duration, price competition, renew and remain actionable',()=>{
 const s=decodeSave(fs.readFileSync('tests/fixtures/mobile-season.json','utf8')),offers=clubOffers(s)
 assert.ok(offers.length>=2)
 const big=offers.find(o=>o.kind==='bigger'),stay=offers[0]
 assert.ok(big.salary>stay.salary);assert.ok(big.competition>stay.competition)
 assert.ok(big.projectedApps<stay.projectedApps);assert.equal(big.trust,50)
 assert.equal(big.years,3)
 const moved=play(s,0,{transfer:'bigger'});assert.equal(moved.history.at(-1).salary,big.salary)
 assert.deepEqual(moved.player.contract,{salary:big.salary,yearsLeft:2})
 const next=play(moved,0);assert.equal(next.history.at(-1).salary,big.salary);assert.equal(next.player.contract.yearsLeft,1)
 const expiry=play(next,0);assert.equal(expiry.player.contract.yearsLeft,0)
 assert.equal(clubOffers(expiry)[0].years,2)
 assert.ok(clubOffers(s).every(o=>Number.isInteger(o.projectedApps)&&o.projectedApps>=0&&o.projectedApps<=44))
 assert.deepEqual(clubOffers(createCareer(config)).map(o=>o.kind),['stay'])
})
test('invalid and stale story choices cannot advance or charge a bonus',()=>{
 const s=createCareer(config)
 for(const story of ['appearance','not-a-choice','',null,{}])assert.throws(()=>nextSeason(s,{...defaultDecision(s),story}),/valid story/)
 const next=play(s);assert.throws(()=>nextSeason(next,{...defaultDecision(next),story:'specialist'}),/valid story/)
})
test('old saves continue with new decisions and new saves reject damaged contracts/reviews',()=>{
 const legacy=decodeSave(fs.readFileSync('tests/fixtures/mobile-season.json','utf8')),updated=play(legacy)
 assert.deepEqual(updated.history.slice(0,-1),legacy.history)
 assert.deepEqual(decodeSave(JSON.stringify(updated)),updated)
 for(const mutate of [s=>s.player.contract.yearsLeft=-1,s=>s.player.contract.salary='100',s=>s.history.at(-1).review.after.fitness=0,s=>s.history.at(-1).review.story.effect.role=9,s=>s.history.at(-1).review.story.choiceId='fake',s=>s.history.at(-1).review.bonus=-10,s=>s.history.at(-1).decision.story='fake',s=>delete s.history.at(-1).review]){
  const damaged=structuredClone(updated);mutate(damaged);assert.throws(()=>decodeSave(JSON.stringify(damaged)),/damaged/)
 }
})
test('all positions and story branches complete, reload and replay exactly with reconciled records',()=>{
 for(const position of POSITIONS)for(let route=0;route<3;route++){
  const initial=createCareer({...config,position,seed:`choices-${position}-${route}`});let s=initial
  while(s.status==='playing'){
   const offers=clubOffers(s),kind=route===0&&offers.some(o=>o.kind==='bigger')?'bigger':route===1&&offers.some(o=>o.kind==='minutes')?'minutes':'stay'
   s=play(s,route,{training:s.player.fitness<50?'recovery':'intensive',transfer:kind})
   assert.deepEqual(decodeSave(JSON.stringify(s)),s)
  }
  let replay=initial;for(const season of s.history)replay=nextSeason(replay,season.decision)
  assert.deepEqual(replay,s)
  const records=careerRecords(s),result=careerResult(s)
  assert.equal(records.stints.reduce((sum,x)=>sum+x.matches,0),result.matches)
  assert.equal(records.stints.reduce((sum,x)=>sum+x.seasons,0),22)
  assert.equal(records.earnings,s.history.reduce((sum,x)=>sum+x.salary+x.review.bonus,0))
  assert.equal(records.peakValue,Math.max(...s.history.map(x=>x.marketValue)))
  assert.equal(records.bestSeason.endOvr,Math.max(...s.history.map(x=>x.endOvr)))
  for(const m of records.milestones)assert.ok(m.season&&s.history.includes(m.season))
 }
})
test('retirement separates repeat visits to the same club and records early retirement',()=>{
 let s=createCareer(config);for(let i=0;i<3;i++)s=play(s)
 s.history[1].clubId='harbor'
 const record=careerRecords(retireCareer(s));assert.equal(record.stints.length,3)
 assert.equal(record.stints[0].clubId,record.stints[2].clubId)
 assert.equal(record.earnings,s.history.reduce((sum,x)=>sum+x.salary+x.review.bonus,0))
})
test('every story, choice and newly visible club explanation is translated in all supported languages',()=>{
 let s=createCareer(config)
 for(let i=0;i<4;i++){
  const story=seasonStory(s),strings=[story.title,story.description,...story.choices.flatMap(c=>[c.label,c.detail]),...clubOffers(s).flatMap(o=>[o.upside,o.tradeoff])]
  for(const locale of ['es','it','pt','zh','de'])for(const value of strings)assert.notEqual(t(value,locale),value,`${locale}: ${value}`)
  s=play(s)
 }
})
test('an accepted coaching request buys actual minutes while following the plan builds more trust',()=>{
 const s=decodeSave(fs.readFileSync('tests/fixtures/mobile-season.json','utf8'));s.player.injuryStatus='healthy';s.player.fitness=85
 const asked=play(s,1,{relationship:'ask'}),followed=play(s,1,{relationship:'follow'})
 assert.ok(asked.history.at(-1).events.includes('Your coach accepted a larger role.'))
 assert.ok(asked.history.at(-1).appearances>followed.history.at(-1).appearances)
 assert.ok(asked.player.coachTrust<followed.player.coachTrust)
})
