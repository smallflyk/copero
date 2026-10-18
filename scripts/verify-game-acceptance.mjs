import fs from 'node:fs'
import assert from 'node:assert/strict'
import {sourceModule} from './source-module.mjs'
const {nextSeason,careerResult}=sourceModule('lib/game/engine.ts')
const {decodeSave}=sourceModule('lib/game/storage.ts')
const filename=process.argv[2]||'/tmp/copero-game-acceptance/acceptance.json'
const report=JSON.parse(fs.readFileSync(filename,'utf8'))
assert.equal(report.careers.length,10)
for(const run of report.careers){
 let replay=run.initial
 for(const season of run.final.history)replay=nextSeason(replay,season.decision)
 assert.deepEqual(replay,run.final,run.initialPosition+' UI state must match replay')
 assert.deepEqual(decodeSave(JSON.stringify(run.final)),run.final)
 const result=careerResult(run.final)
 assert.equal(result.score,run.visibleScore)
 console.log(JSON.stringify({position:run.initialPosition,mobile:run.mobile,seasons:run.final.history.length,matches:result.matches,goals:result.goals,trophies:result.trophies,clubs:result.clubs.length,score:result.score,ending:result.ending,automatedSeconds:run.automatedSeconds}))
}
console.log('Branch coverage:',JSON.stringify(report.branches))
console.log('Same-seed training comparison:',JSON.stringify(Object.fromEntries(Object.entries(report.decisionComparison).map(([key,p])=>[key,{fitness:p.fitness,attributes:p.attributes}]))))
console.log('PASS: all 10 actual UI careers independently replayed exactly; saves valid; visible scores match engine')
