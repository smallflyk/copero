import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {sourceModule} from '../scripts/source-module.mjs'
const {drawCareerCard,CAREER_CARD_SIZE}=sourceModule('lib/game/result-card.ts')
const {createCareer,nextSeason,competitionDecision,careerResult}=sourceModule('lib/game/engine.ts')
const {seasonStory}=sourceModule('lib/game/stories.ts')
const {t}=sourceModule('lib/i18n/translate.ts')
const locales=['es','en','it','pt','zh','de']
function context(){const text=[];return {text,font:'',measureText(value){return {width:Array.from(value).length*Number(this.font.match(/(\d+)px/)?.[1]??20)*.55}},fillText(value,x,y){text.push({value,x,y})},fillRect(){},strokeRect(){}}}
function play(s){const d={...competitionDecision(s),training:'recovery',cupPlan:'push'},e=seasonStory(s,d.transfer,d);return nextSeason(s,{...d,storyEvent:e.id,story:e.choices.find(c=>!c.unavailableReason).id})}
let state=createCareer({name:'Card QA',nationality:'Brazil',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{pace:0,shooting:0,passing:0,dribbling:0,defending:0,physical:0},seed:'card-qa',clubId:'harbor'})
state.player.attributes=Object.fromEntries(Object.keys(state.player.attributes).map(key=>[key,82]));state.player.potential=99
for(let i=0;i<22;i++)state=play(state)
test('PNG preserves export dimensions, distinct club/international accounting and the original save in six languages',()=>{
 assert.deepEqual(CAREER_CARD_SIZE,{width:1080,height:1350})
 const original=JSON.stringify(state),sum=(group,key)=>state.history.reduce((n,s)=>n+s.competitions[group][key],0)
 for(const locale of locales){
  const ctx=context();drawCareerCard(ctx,state,locale,'copero.pro')
  const text=ctx.text.map(item=>item.value)
  for(const label of ['Club career totals','Domestic Cup','National team'])assert.ok(text.includes(t(label,locale)),`${locale}: ${label}`)
  assert.ok(text.includes(t('Regional titles: {count}',locale,{count:state.history.filter(s=>s.competitions.national.medal&&s.competitions.national.kind==='regional').length})))
  assert.ok(text.includes(t('Global titles: {count}',locale,{count:state.history.filter(s=>s.competitions.national.medal&&s.competitions.national.kind==='global').length})))
  // Compare independently summed match statistics at their distinct card regions.
  assert.equal(ctx.text.find(item=>item.x===86&&item.y===630).value,String(state.history.reduce((n,s)=>n+s.trophies,0)))
  assert.equal(ctx.text.find(item=>item.x===574&&item.y===922).value,String(sum('national','appearances')))
  assert.equal(ctx.text.find(item=>item.x===86&&item.y===866).value,String(sum('cup','medal')))
  assert.equal(ctx.text.find(item=>item.x===574&&item.y===866).value,String(sum('national','medal')))
  assert.ok(text.includes(`${careerResult(state).score}/100`));assert.ok(ctx.text.every(item=>item.x>=32&&item.y<=1318))
 }
 assert.equal(JSON.stringify(state),original)
})
test('historical saves show missing competition coverage rather than fabricated zero honours',()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/progression-v13-save.json','utf8')).state
 for(const locale of locales){
  const ctx=context();drawCareerCard(ctx,legacy,locale,'copero.pro')
  assert.ok(ctx.text.some(item=>item.value.includes(t('No competition records were simulated in these historical seasons.',locale).split(' ').slice(0,4).join(' '))))
  assert.ok(!ctx.text.some(item=>item.x===574&&item.y===866))
 }
 const partial=play(legacy),ctx=context();drawCareerCard(ctx,partial,'en','copero.pro')
 assert.ok(ctx.text.some(item=>item.value===`Competition records cover 1 of ${partial.history.length} seasons.`))
})
