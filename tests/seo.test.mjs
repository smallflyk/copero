import test from 'node:test'
import assert from 'node:assert/strict'
import {sourceModule} from '../scripts/source-module.mjs'
const {homeSchema}=sourceModule('lib/structured-data.ts')
const {LOCALES,localizedPath}=sourceModule('lib/i18n/config.ts')
const {publicUrl}=sourceModule('lib/seo.ts')
test('one real domain-level site and publisher identity is shared by every language',()=>{
 for(const locale of LOCALES){
  const graph=homeSchema(locale)['@graph']
  const website=graph.find(item=>item['@type']==='WebSite'),organization=graph.find(item=>item['@type']==='Organization')
  assert.equal(website['@id'],'https://copero.pro/#website');assert.equal(website.url,'https://copero.pro')
  assert.equal(organization.email,'support@copero.pro')
  assert.equal(graph.find(item=>item['@type']==='WebPage').url,publicUrl(localizedPath('/',locale)))
  assert.ok(!graph.some(item=>item['@type']==='FAQPage'))
  assert.ok(!JSON.stringify(graph).includes('aggregateRating'))
 }
})
test('Spanish home and its alternate URL resolve to the domain root, other language homes retain prefixes',()=>{
 assert.equal(publicUrl(localizedPath('/','es')),'https://copero.pro')
 assert.equal(publicUrl(localizedPath('/es','es')),'https://copero.pro')
 assert.equal(publicUrl(localizedPath('/es/guides','en')),'https://copero.pro/en/guides')
})
