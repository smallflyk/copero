import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {sourceModule} from '../scripts/source-module.mjs'
const {createCareer,nextSeason,defaultDecision,clubOffers}=sourceModule('lib/game/engine.ts')
const {legacyContextStory:seasonStory,storyCatalog}=sourceModule('lib/game/stories.ts')
const {previewAdjustments}=sourceModule('lib/game/feedback.ts')
const {decodeSave}=sourceModule('lib/game/storage.ts')
const {ZERO_BONUSES}=sourceModule('lib/game/rules.ts')
const {POSITIONS}=sourceModule('lib/game/types.ts')
const {t}=sourceModule('lib/i18n/translate.ts')
const {countLabel}=sourceModule('lib/i18n/format.ts')
const messages=JSON.parse(fs.readFileSync('lib/i18n/messages.json','utf8'))
const config={name:'Context test',nationality:'England',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{...ZERO_BONUSES},seed:'context-test',clubId:'harbor'}
const play=(s,index=0,extra={})=>{const d={...defaultDecision(s),...extra},event=seasonStory(s,d.transfer);return nextSeason(s,{...d,story:event.choices[index].id,storyEvent:event.id})}
const keys=['fitness','morale','coachTrust','ovr']
const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-story-save.json','utf8'))
test('rules 1.1 story saves load unchanged and their next recorded decision replays exactly',()=>{
 assert.deepEqual(decodeSave(JSON.stringify(legacy.state)),legacy.state)
 assert.deepEqual(nextSeason(legacy.state,legacy.decision),legacy.next)
 const updated=play(legacy.state)
 assert.deepEqual(updated.history.slice(0,-1),legacy.state.history)
 assert.equal(updated.history.at(-1).review.changes.length,8)
 assert.deepEqual(decodeSave(JSON.stringify(updated)),updated)
})
test('state triggers select relevant stories and explain why they were selected',()=>{
 const base=structuredClone(legacy.state)
 base.history=base.history.map(s=>({...s,review:undefined}))
 base.history.at(-1).appearances=30;base.history.at(-1).trophies=0;base.history.at(-1).ovr=60;base.history.at(-1).endOvr=60
 base.player.fitness=85;base.player.injuryStatus='healthy';base.player.contract.yearsLeft=2
 const cases=[['rehab',s=>s.player.injuryStatus='major'],['fatigue',s=>s.player.fitness=40],['honours',s=>s.history.at(-1).trophies=1],['breakthrough',s=>s.history.at(-1).appearances=12],['setback',s=>s.history.at(-1).endOvr=59],['veteran',s=>s.player.age=33],['renewal',s=>s.player.contract.yearsLeft=0]]
 for(const [id,change]of cases){const s=structuredClone(base);change(s);const story=seasonStory(s);assert.equal(story.id,id);assert.ok(story.reason);for(const locale of ['es','it','pt','zh','de'])assert.notEqual(t(story.reason,locale),story.reason)}
 assert.equal(seasonStory(base,'bigger').id,'new-club')
 assert.equal(seasonStory(createCareer(config)).id,'extra-session')
})
test('a recent trigger cools down instead of repeating the same story every injured season',()=>{
 let s=createCareer(config);s.player.injuryStatus='major'
 assert.equal(seasonStory(s).id,'rehab')
 s=play(s);s.player.injuryStatus='major'
 assert.notEqual(seasonStory(s).id,'rehab')
})
test('all positions finish contextual careers with cooldown, valid saves and exact decision replay',()=>{
 const seen=new Set()
 for(const position of POSITIONS)for(let route=0;route<3;route++){
  const initial=createCareer({...config,position,seed:`context-${position}-${route}`});let s=initial
  while(s.status==='playing'){
   const offers=clubOffers(s),transfer=route===0&&offers.some(o=>o.kind==='bigger')?'bigger':route===1&&offers.some(o=>o.kind==='minutes')?'minutes':'stay'
   const event=seasonStory(s,transfer),recent=s.history.slice(-4).map(x=>x.review?.story.eventId)
   assert.ok(!recent.includes(event.id),`${event.id}: ${recent}`);seen.add(event.id)
   const before=JSON.stringify(s),next=play(s,route,{transfer,training:s.player.fitness<55?'recovery':'intensive',relationship:s.history.length%4===0?'ask':'follow'})
   assert.equal(JSON.stringify(s),before)
   const review=next.history.at(-1).review;assert.equal(review.changes.length,8)
   for(const key of keys){assert.equal(review.changes[0].before[key],review.before[key]);assert.equal(review.changes.at(-1).after[key],review.after[key]);assert.equal(review.changes.reduce((sum,c)=>sum+c.after[key]-c.before[key],0),review.after[key]-review.before[key])}
   assert.deepEqual(decodeSave(JSON.stringify(next)),next);s=next
  }
  let replay=initial;for(const season of s.history)replay=nextSeason(replay,season.decision)
  assert.deepEqual(replay,s)
 }
 assert.ok(seen.size>=12,`covered ${[...seen]}`)
})
test('trust attribution separates a transfer reset, the chosen story and a rejected request',()=>{
 let s=nextSeason(createCareer(config),{training:'balanced',relationship:'follow',transfer:'stay'})
 s.player.attributes={pace:44,shooting:44,passing:44,dribbling:44,defending:44,physical:44};s.player.coachTrust=67;s.player.fitness=90;s.player.injuryStatus='healthy'
 const next=play(s,0,{transfer:'bigger',relationship:'ask'}),r=next.history.at(-1).review
 assert.equal(r.story.eventId,'new-club')
 assert.equal(r.changes[0].source,'transfer');assert.equal(r.changes[0].before.coachTrust,67);assert.equal(r.changes[0].after.coachTrust,50)
 assert.equal(r.changes[1].after.coachTrust-r.changes[1].before.coachTrust,12)
 assert.equal(r.changes[2].source,'coach-refused');assert.equal(r.changes[2].after.coachTrust-r.changes[2].before.coachTrust,-10)
 assert.equal(r.after.coachTrust,52)
})
test('effect previews expose capped gains and use the reset trust for a selected transfer',()=>{
 const s=createCareer(config);s.player.coachTrust=99;s.player.attributes.passing=s.player.potential
 const analysis=seasonStory(s).choices[1],notes=previewAdjustments(s,defaultDecision(s),analysis.effect)
 assert.ok(notes.some(n=>n.metric==='coachTrust'&&n.requested===7&&n.applied===0));assert.ok(notes.some(n=>n.metric==='passing'&&n.applied===0))
 assert.ok(!previewAdjustments(s,{...defaultDecision(s),transfer:'bigger'},analysis.effect).some(n=>n.metric==='coachTrust'))
 const next=play(s,1);const step=next.history.at(-1).review.changes[1]
 assert.equal(step.before.coachTrust,step.after.coachTrust);assert.deepEqual(step.attributes.passing,{before:s.player.potential,after:s.player.potential})
})
test('a club change invalidates a story picked for staying, and arbitrary event ids cannot advance',()=>{
 const s=nextSeason(createCareer(config),{training:'balanced',relationship:'follow',transfer:'stay'}),story=seasonStory(s)
 assert.throws(()=>nextSeason(s,{...defaultDecision(s),transfer:'bigger',story:story.choices[0].id,storyEvent:story.id}),/valid story/)
 for(const storyEvent of ['not-an-event',null,{},''])assert.throws(()=>nextSeason(s,{...defaultDecision(s),story:'adapt',storyEvent}),/valid story/)
})
test('damaged attribution, selection factors or event references cannot load',()=>{
 const s=play(createCareer(config))
 const mutations=[s=>s.history[0].review.changes.pop(),s=>s.history[0].review.changes[0].source='unknown',s=>s.history[0].review.changes[2].before.coachTrust=1,s=>s.history[0].review.changes.at(-1).after.ovr=1,s=>s.history[0].review.changes[1].attributes.shooting.after=100,s=>s.history[0].review.matchFactors.final=1,s=>s.history[0].review.matchFactors.availability=-1,s=>s.history[0].decision.storyEvent='missing',s=>delete s.history[0].review.changes]
 for(const mutation of mutations){const bad=structuredClone(s);mutation(bad);assert.throws(()=>decodeSave(JSON.stringify(bad)),/damaged/)}
})
test('all contextual stories, choices, triggers and count forms cover the five other languages',()=>{
 const s=createCareer(config)
 for(const locale of ['es','it','pt','zh','de']){
  for(const story of storyCatalog(s))for(const text of [story.title,story.description,...story.choices.flatMap(c=>[c.label,c.detail])])assert.notEqual(t(text,locale),text,`${locale}: ${text}`)
  for(const unit of ['season','match','goal','assist','clean sheet','trophy'])for(const n of [0,1,2]){const key=n===1?'1 '+unit:'{n} '+({season:'seasons',match:'matches',goal:'goals',assist:'assists','clean sheet':'clean sheets',trophy:'trophies'}[unit]);assert.ok(messages[key]?.[locale],`${locale}: ${key}`);assert.equal(countLabel(n,unit,locale),messages[key][locale].replace('{n}',String(n)))}
  assert.notEqual(t('Retired at {age}',locale,{age:38}),'Retired at 38')
 }
 assert.equal(countLabel(1,'season','es'),'1 temporada');assert.equal(countLabel(2,'season','es'),'2 temporadas');assert.equal(countLabel(1,'trophy','es'),'1 trofeo')
})
