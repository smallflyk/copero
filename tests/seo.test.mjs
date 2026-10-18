import test from 'node:test'
import assert from 'node:assert/strict'
import {sourceModule} from '../scripts/source-module.mjs'
const {homeSchema}=sourceModule('lib/structured-data.ts')
const {LOCALES,localizedPath}=sourceModule('lib/i18n/config.ts')
const {publicUrl}=sourceModule('lib/seo.ts')
const {localeMetadata}=sourceModule('lib/i18n/metadata.ts')
const {guides}=sourceModule('data/guides.ts')
test('all 72 indexable pages have unique localized descriptions of 140–160 Unicode characters',()=>{
 const paths=['/','/how-it-works','/guides','/about','/privacy-policy','/terms',...guides.map(guide=>`/guides/${guide.slug}`)]
 const descriptions=[]
 for(const locale of LOCALES)for(const path of paths){
  const metadata=localeMetadata('Copero','Fallback description',path,locale)
  const description=metadata.description,length=Array.from(description).length
  assert.ok(length>=140&&length<=160,`${locale} ${path}: ${length} characters`)
  assert.ok(description.includes('Copero'),`${locale} ${path}: missing brand`)
  assert.equal(metadata.openGraph.description,description)
  assert.equal(metadata.twitter.description,description)
  descriptions.push(description)
 }
 assert.equal(descriptions.length,72)
 assert.equal(new Set(descriptions).size,descriptions.length)
})
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
