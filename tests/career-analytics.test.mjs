import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {sourceModule} from '../scripts/source-module.mjs'
const api=sourceModule('lib/analytics/career.ts'),{createCareer}=sourceModule('lib/game/engine.ts')
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/mobile-season.json','utf8'))
const fresh=createCareer({name:'PRIVATE_PLAYER_CANARY',nationality:'England',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{pace:0,shooting:0,passing:0,dribbling:0,defending:0,physical:0},seed:'PRIVATE_SEED_CANARY',clubId:'riverside'})
const saved=globalThis.window
function setup(store=new Map(),blocked=false){const events=[];globalThis.window={location:{pathname:'/en/career'},localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return store.get(k)??null},setItem:(k,v)=>{if(blocked)throw Error('blocked');store.set(k,v)}},gtag:(...args)=>events.push(args)};return {events,store}}
const names=events=>events.map(event=>event[1])
test.after(()=>{globalThis.window=saved})
test('start requires a valid successful handoff and correct destination; reloads do not backfill historical progress',()=>{
 const {events,store}=setup();const original=JSON.stringify(fresh)
 api.prepareCareer(fresh,null,'en');assert.deepEqual(events,[])
 window.location.pathname='/de/career';api.careerLoaded(fresh,'de');assert.deepEqual(events,[])
 window.location.pathname='/en/career';api.careerLoaded(fresh,'en');api.careerLoaded(fresh,'en')
 assert.deepEqual(names(events),['career_start']);assert.equal(events[0][2].career_type,'new')
 setup(store);api.careerLoaded(fresh,'en');assert.equal(JSON.stringify(fresh),original)
 const legacy=setup();api.careerLoaded(fixture,'en');assert.deepEqual(legacy.events,[])
 const retired={...fixture,status:'retired'};api.careerLoaded(retired,'en');assert.deepEqual(legacy.events,[])
})
test('accepted seasons, manual retirement and automatic retirement are counted once; old saves are untouched',()=>{
 const {events,store}=setup();store.set('copero.career.v1',JSON.stringify(fixture));api.careerLoaded(fixture,'en')
 const next={...fixture,history:[...fixture.history,fixture.history[0]],player:{...fixture.player,age:fixture.player.age+1}}
 api.careerAdvanced(fixture,next,'en');api.careerAdvanced(fixture,next,'en')
 api.careerAdvanced(next,{...next,status:'retired'},'en');api.careerAdvanced(next,{...next,status:'retired'},'en')
 assert.deepEqual(names(events),['season_complete','career_complete']);assert.equal(events[1][2].completion_type,'manual');assert.equal(store.get('copero.career.v1'),JSON.stringify(fixture))
 const auto=setup();api.careerAdvanced(fixture,{...next,status:'retired'},'en');assert.deepEqual(names(auto.events),['season_complete','career_complete']);assert.equal(auto.events[1][2].completion_type,'age_limit')
 const invalid=setup();api.careerAdvanced(fixture,fixture,'en');api.careerAdvanced({...fixture,status:'retired'},next,'en');assert.deepEqual(invalid.events,[])
})
test('replay means a loaded new career after a completion; first real season proves continued play even with the same deterministic career ID',()=>{
 const {events}=setup(),retired={...fresh,status:'retired',history:[fixture.history[0]],player:{...fresh.player,age:17}}
 api.restartRequested(retired);assert.deepEqual(events,[])
 api.prepareCareer(fresh,null,'en');api.careerLoaded(fresh,'en');assert.deepEqual(names(events),['career_start','career_restart'])
 const next={...fresh,history:[fixture.history[0]],player:{...fresh.player,age:17}}
 api.careerAdvanced(fresh,next,'en');api.careerAdvanced(fresh,next,'en');assert.deepEqual(names(events),['career_start','career_restart','season_complete','career_continue'])
 api.prepareCareer(fresh,{...next,status:'retired'},'en');api.careerLoaded(fresh,'en');assert.equal(names(events).filter(name=>name==='career_restart').length,2)
})
test('expired, corrupt or blocked analytics storage cannot replay starts or prevent gameplay; blocked tags and opt-out never throw',()=>{
 const {events,store}=setup();api.prepareCareer(fresh,null,'en');const l=JSON.parse(store.get('copero.measurement.v1'));l.run.pendingUntil=Date.now()-1;store.set('copero.measurement.v1',JSON.stringify(l));api.careerLoaded(fresh,'en');assert.deepEqual(events,[])
 store.set('copero.measurement.v1','broken');api.careerLoaded(fixture,'en');assert.deepEqual(events,[])
 const blocked=setup(new Map(),true);api.prepareCareer(fresh,null,'en');api.careerLoaded(fresh,'en');assert.deepEqual(names(blocked.events),['career_start'])
 window['ga-disable-G-4JYX8WF2SZ']=true;api.careerError('en','profile');assert.equal(blocked.events.length,1)
 window.gtag=()=>{throw Error('tag blocked')};assert.doesNotThrow(()=>api.careerExported(fixture,'en','png'))
})
test('only low-cardinality business parameters leave the browser, never player name, seed, save, run identity or errors',()=>{
 const {events}=setup();api.careerError('zh','profile');api.prepareCareer(fresh,null,'zh');window.location.pathname='/zh/career';api.careerLoaded(fresh,'zh');api.careerExported(fresh,'zh','json');api.careerError('zh','season')
 const payload=JSON.stringify(events);assert.ok(!payload.includes('PRIVATE_'));assert.ok(!payload.includes(fresh.id));assert.ok(!payload.includes('token'))
 const allowed=new Set(['send_to','measurement_version','game_mode','site_language','career_type','season_number','completion_type','export_format','error_step'])
 for(const [command,event,params] of events){assert.equal(command,'event');assert.ok(event);for(const key of Object.keys(params))assert.ok(allowed.has(key),key);assert.equal(params.measurement_version,'career-v1')}
})
