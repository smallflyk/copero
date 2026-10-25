import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {sourceModule} from '../scripts/source-module.mjs'
const {createCareer,nextSeason,defaultDecision,clubOffers}=sourceModule('lib/game/engine.ts')
const {seasonStory,storyCatalog}=sourceModule('lib/game/stories.ts')
const {achievements,stageGoal,evaluateGoal,nextMilestones}=sourceModule('lib/game/achievements.ts')
const {nextThread,pendingThread,threadOutcome}=sourceModule('lib/game/threads.ts')
const {stepSummary}=sourceModule('lib/game/feedback.ts')
const {hasStoryBenefit,hasStoryCost}=sourceModule('lib/game/effects.ts')
const {decodeSave}=sourceModule('lib/game/storage.ts')
const {POSITIONS}=sourceModule('lib/game/types.ts')
const {t}=sourceModule('lib/i18n/translate.ts')
const old=JSON.parse(fs.readFileSync('tests/fixtures/contextual-v12-save.json','utf8'))
const config={name:'Progress test',nationality:'England',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{pace:0,shooting:0,passing:0,dribbling:0,defending:0,physical:0},seed:'progress-test',clubId:'harbor'}
const modern=s=>({...defaultDecision(s),rules:'1.3'})
function play(s,extra={},pick=0){const d={...modern(s),...extra},event=seasonStory(s,d.transfer,d),choices=event.choices.filter(c=>!c.unavailableReason);return nextSeason(s,{...d,storyEvent:event.id,story:choices[pick%choices.length].id})}
test('rules 1.2 save and saturated next decision retain their exact historical replay',()=>{
 assert.deepEqual(decodeSave(JSON.stringify(old.state)),old.state)
 assert.deepEqual(nextSeason(old.state,old.decision),old.next)
 const continued=play(old.state);assert.deepEqual(continued.history.slice(0,-1),old.state.history);assert.deepEqual(decodeSave(JSON.stringify(continued)),continued)
})
test('the real age-34 zero-benefit option is disabled and cannot charge fitness',()=>{
 const s=structuredClone(old.state),d=modern(s),event=seasonStory(s,'stay',d),specialist=event.choices.find(c=>c.id==='specialist')
 assert.equal(s.player.age,34);assert.ok(specialist.unavailableReason);assert.equal(hasStoryBenefit(s,d,specialist.effect),false)
 const before=JSON.stringify(s);assert.throws(()=>nextSeason(s,{...d,storyEvent:event.id,story:'specialist'}),/valid story/);assert.equal(JSON.stringify(s),before)
 assert.ok(event.choices.some(c=>!c.unavailableReason))
})
test('fully saturated veterans have a free continuation, never a required pure cost',()=>{
 const s=structuredClone(old.state);s.player.fitness=s.player.morale=s.player.coachTrust=s.player.potential=99;for(const k of Object.keys(s.player.attributes))s.player.attributes[k]=99
 const d=modern(s),event=seasonStory(s,'stay',d);assert.ok(event.choices.some(c=>c.id==='hold'&&!c.unavailableReason));assert.deepEqual(event.choices.find(c=>c.id==='hold').effect,{})
 for(const c of event.choices)if(hasStoryCost(c.effect)&&!hasStoryBenefit(s,d,c.effect))assert.ok(c.unavailableReason)
 const result=nextSeason(s,{...d,storyEvent:event.id,story:'hold'});assert.deepEqual(result.history.at(-1).review.changes[1].before,result.history.at(-1).review.changes[1].after);assert.deepEqual(decodeSave(JSON.stringify(result)),result)
})
test('a selected transfer resets the trust used to assess usable gains',()=>{
 let s=nextSeason(createCareer(config),defaultDecision(createCareer(config)));s.player.coachTrust=99;s.player.morale=99;s.player.fitness=99;for(const k of Object.keys(s.player.attributes))s.player.attributes[k]=s.player.potential
 assert.equal(hasStoryBenefit(s,{...modern(s),transfer:'bigger'},{coachTrust:8,fitness:-6}),true)
 assert.equal(hasStoryBenefit(s,modern(s),{coachTrust:8,fitness:-6}),false)
})
test('minutes, recovery and continuity open distinct next-season branches, including leaving',()=>{
 const base=structuredClone(old.state)
 for(const [kind,event,choice] of [['minutes','breakthrough','minutes'],['recovery','rehab','protect'],['loyalty','renewal','stability']]){
  const d={...modern(base),storyEvent:event,story:choice};const thread=nextThread(base,d);assert.equal(thread.kind,kind);assert.equal(thread.status,'pending')
  const s=structuredClone(base);s.history.at(-1).review.thread={...thread,origin:s.history.length,clubId:s.player.clubId};s.player.fitness=85;s.player.injuryStatus='healthy';s.history.at(-1).appearances=30
  const fulfilled=seasonStory(s,'stay',modern(s));assert.equal(fulfilled.id,`followup-${kind}-fulfilled`)
  assert.equal(threadOutcome(s,modern(s)).status,'fulfilled')
  if(kind!=='recovery')assert.equal(threadOutcome(s,{...modern(s),transfer:'minutes'}).status,'left')
  if(kind==='minutes')s.history.at(-1).appearances=10;else if(kind==='recovery')s.player.injuryStatus='minor';else continue
  assert.equal(seasonStory(s,'stay',modern(s)).id,`followup-${kind}-missed`)
 }
})
test('follow-ups close once, survive reload and are not opened at the final season',()=>{
 let s=createCareer(config);s.player.injuryStatus='minor';s=play(s,{},0)
 assert.equal(pendingThread(s)?.kind,'recovery');s=decodeSave(JSON.stringify(s));const previous=structuredClone(s)
 s=play(s);assert.notEqual(s.history.at(-1).review.thread.status,'pending');assert.equal(pendingThread(s),undefined)
 assert.deepEqual(nextSeason(previous,s.history.at(-1).decision),s)
 const last=structuredClone(old.state);last.player.age=37;assert.equal(nextThread(last,{...modern(last),storyEvent:'renewal',story:'stability'}),undefined)
})
test('achievement thresholds are awarded on first crossing, role metrics and consecutive loyalty are accurate',()=>{
 const s=structuredClone(old.state);s.history=s.history.slice(0,8).map((x,i)=>({...x,number:i+1,clubId:i<3?'harbor':i<6?'capital':'harbor',appearances:40,goals:20,assists:10,cleanSheets:15}))
 const a=achievements(s);assert.equal(a.find(x=>x.id==='appearances-100').season.number,3);assert.equal(a.find(x=>x.id==='appearances-300').season.number,8);assert.equal(a.find(x=>x.id==='goals-100').season.number,5);assert.equal(a.find(x=>x.id==='cleanSheets-100').season.number,7);assert.ok(!a.some(x=>x.id==='loyalty-5'));assert.equal(new Set(a.map(x=>x.id)).size,a.length)
 assert.deepEqual(achievements(structuredClone(s)),a);s.player.position='GK';assert.ok(nextMilestones(s).some(m=>m.metric==='cleanSheets'));assert.ok(!nextMilestones(s).some(m=>m.metric==='goals'))
 s.history.forEach(x=>x.clubId='harbor');assert.equal(achievements(s).find(x=>x.id==='loyalty-5').season.number,5)
})
test('stage targets have explicit boundaries and injured veterans do not get a healthy-season award',()=>{
 const s=createCareer(config),season=old.state.history[0]
 assert.equal(stageGoal(s).target,22);s.player.age=23;assert.equal(stageGoal(s).target,30);s.player.age=30;assert.equal(stageGoal(s).id,'longevity')
 assert.equal(evaluateGoal(s,{...season,injury:'minor',fitness:99}).achieved,false);assert.equal(evaluateGoal(s,{...season,injury:'healthy',fitness:60}).achieved,true)
})
test('modern careers finish and replay across all roles, valid choices, cooldown and saved goal/thread validation',()=>{
 for(const position of POSITIONS)for(let route=0;route<3;route++){
  const initial=createCareer({...config,position,seed:`progress-${position}-${route}`});let s=initial
  while(s.status==='playing'){
   const offers=clubOffers(s),transfer=route===1&&offers.some(o=>o.kind==='bigger')?'bigger':route===2&&offers.some(o=>o.kind==='minutes')?'minutes':'stay',d={...modern(s),transfer,training:s.player.fitness<55?'recovery':'balanced'},event=seasonStory(s,transfer,d)
   assert.ok(!s.history.slice(-4).some(x=>x.review?.story.eventId===event.id))
   assert.ok(event.choices.some(c=>!c.unavailableReason));for(const c of event.choices)assert.ok(c.unavailableReason||!hasStoryCost(c.effect)||hasStoryBenefit(s,d,c.effect))
   s=play(s,d,route);assert.deepEqual(decodeSave(JSON.stringify(s)),s)
  }
  let replay=initial;for(const season of s.history)replay=nextSeason(replay,season.decision);assert.deepEqual(replay,s)
  assert.equal(new Set(achievements(s).map(a=>a.id)).size,achievements(s).length)
 }
})
test('damaged rules, goals and thread references are rejected',()=>{
 let s=createCareer(config);s.player.injuryStatus='minor';s=play(s)
 for(const mutate of [x=>x.history[0].decision.rules='2',x=>x.history[0].review.goal.achieved=!x.history[0].review.goal.achieved,x=>delete x.history[0].review.goal,x=>x.history[0].review.thread.origin=2,x=>x.history[0].review.thread.clubId='missing',x=>x.history[0].review.thread.status='fulfilled']){
  const bad=structuredClone(s);mutate(bad);assert.throws(()=>decodeSave(JSON.stringify(bad)),/damaged/)
 }
})
test('all new event and achievement labels have complete translations',()=>{
 const s=createCareer(config);s.history=old.state.history
 for(const locale of ['es','it','pt','zh','de']){
  for(const event of storyCatalog(s))for(const text of [event.title,event.description,...event.choices.flatMap(c=>[c.label,c.detail])])assert.notEqual(t(text,locale),text,`${locale}: ${text}`)
  for(const a of achievements(s))assert.notEqual(t(a.label,locale),a.label)
 }
})

test('compact feedback preserves attribute gains beside their fitness cost',()=>{
 const before={fitness:90,morale:80,coachTrust:99,ovr:75},after={...before,fitness:87}
 const summary=stepSummary({source:'story',before,after,attributes:{passing:{before:70,after:71}}})
 assert.deepEqual(summary.items,[{metric:'fitness',delta:-3},{metric:'passing',delta:1}]);assert.equal(summary.extraAttributes,0)
})
