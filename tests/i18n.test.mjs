import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {sourceModule} from '../scripts/source-module.mjs'
const {t}=sourceModule('lib/i18n/translate.ts')
const {localizedPath,LOCALES}=sourceModule('lib/i18n/config.ts')
const {getDocument,getGuides}=sourceModule('data/localized-content.ts')
const messages=JSON.parse(fs.readFileSync('lib/i18n/messages.json','utf8'))
test('all translation entries cover the five non-English languages',()=>{
 for(const [key,entry] of Object.entries(messages))for(const locale of LOCALES.filter(item=>item!=='en'))assert.ok(typeof entry[locale]==='string'&&entry[locale].trim(),`${locale}: ${key}`)
})
test('language links preserve route and fragment without double prefixes or translating asset URLs',()=>{
 assert.equal(localizedPath('/de/guides/copero-positions#ratings','zh'),'/zh/guides/copero-positions#ratings')
 assert.equal(localizedPath('/#create-player','es'),'/#create-player')
 assert.equal(localizedPath('/fonts/DMSans.ttf','de'),'/fonts/DMSans.ttf')
 assert.equal(localizedPath('https://example.com','es'),'https://example.com')
})
test('dynamic events and existing English save summaries render in Spanish without changing model data',()=>{
 const original='22 appearances at Harbor Athletic. Balanced training supported steady development. Playing opportunity helped build experience. Rating +4.'
 const translated=t(original,'es')
 assert.ok(translated.includes('22 partidos en Harbor Athletic.'))
 assert.ok(!translated.includes('Balanced training'));assert.ok(translated.includes('Valoración +4.'))
 assert.equal(t('New career peak: 76 OVR.','zh'),'生涯新高：76 OVR。')
 assert.equal(t('Play season 2','de'),'Saison 2 spielen')
 assert.equal(t(original,'en'),original)
})
test('all public document and guide sections have genuine translations',()=>{
 for(const locale of LOCALES.filter(item=>item!=='en')){
  for(const kind of ['about','privacy-policy','terms','how-it-works']){
   const document=getDocument(kind,locale),english=getDocument(kind,'en')
   assert.notEqual(document.title,english.title)
   document.sections.forEach((section,index)=>assert.notEqual(section.paragraphs[0],english.sections[index].paragraphs[0],`${locale}: ${kind}`))
  }
  for(const guide of getGuides(locale)){assert.ok(guide.sections.length>=5);for(const section of guide.sections)assert.ok(Object.values(messages).some(entry=>entry[locale]===section.paragraphs[0]),`${locale}: ${section.title}`)}
 }
})
