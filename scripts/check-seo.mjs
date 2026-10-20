import fs from 'node:fs'
import assert from 'node:assert/strict'
import path from 'node:path'
import {sourceModule} from './source-module.mjs'
const {publicUrl}=sourceModule('lib/seo.ts')
const {localizedPath}=sourceModule('lib/i18n/config.ts')
const {guides}=sourceModule('data/guides.ts')
const origin='https://copero.pro',languages={es:'es',en:'en',it:'it',pt:'pt',zh:'zh-Hans',de:'de'}
const files=directory=>fs.readdirSync(directory).flatMap(item=>{const file=path.join(directory,item);return fs.statSync(file).isDirectory()?files(file):[file]})
const htmlFiles=['out/index.html',...files('out').filter(file=>/out\/(es|en|it|pt|zh|de)(?:\/|\.html)/.test(file)&&file.endsWith('.html')&&file!=='out/es.html')]
const indexable=[],descriptions=[];let localLinks=0
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8'),head=html.match(/<head>([\s\S]*?)<\/head>/)?.[1]||'',visible=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'')
 const route=file==='out/index.html'?'/':'/'+file.slice(4,-5),locale=route==='/'?'es':route.split('/')[1],contentPath=route==='/'?'/':route.replace(/^\/(es|en|it|pt|zh|de)/,'')||'/'
 assert.equal(html.match(/<html[^>]* lang="([^"]+)"/)?.[1],languages[locale],`Wrong html lang in ${file}`)
 assert.equal((head.match(/<title>/g)||[]).length,1,file)
 assert.ok(!head.includes('localhost'),`Local host leaked into metadata: ${file}`)
 assert.equal((head.match(/name="description"/g)||[]).length,1,file)
 assert.equal((head.match(/rel="canonical"/g)||[]).length,1,file)
 assert.equal((visible.match(/<h1\b/g)||[]).length,1,`Expected one H1 in ${file}`)
 assert.ok(!/pokemon|pokémon|tornadus|football destiny/i.test(html),`Old identity in ${file}`)
 assert.equal((head.match(/<script[^>]+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-4JYX8WF2SZ"/g)||[]).length,1,`Expected one Google tag loader in ${file}`)
 assert.equal((head.match(/gtag\('config', 'G-4JYX8WF2SZ'\)/g)||[]).length,1,`Expected one Google tag config in ${file}`)
 assert.equal((head.match(/<script[^>]+src="https:\/\/plausible\.io\/js\/pa-__HJG7Uwk26jKdaqu23Bn\.js"/g)||[]).length,1,`Expected one Plausible loader in ${file}`)
 assert.equal((head.match(/plausible\.init\(\)/g)||[]).length,1,`Expected one Plausible initialization in ${file}`)
 assert.ok(/<script[^>]+async=""[^>]*src="https:\/\/www\.googletagmanager\.com|<script[^>]+src="https:\/\/www\.googletagmanager\.com[^>]+async=""/.test(head),`Google tag must load asynchronously: ${file}`)
 const ads=[...head.matchAll(/<script\b[^>]*src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3506863457211473"[^>]*>/g)]
 assert.equal(ads.length,1,`Expected exactly one owner AdSense loader in head: ${file}`)
 assert.ok(ads[0][0].includes('async=""')&&ads[0][0].includes('crossorigin="anonymous"'),`AdSense loader attributes: ${file}`)
 assert.ok([...html.matchAll(/ca-pub-\d+/g)].every(match=>match[0]==='ca-pub-3506863457211473'),`Unexpected advertising account: ${file}`)
 const canonical=head.match(/rel="canonical" href="([^"]+)"/)?.[1]
 assert.equal(canonical,publicUrl(localizedPath(contentPath,locale)),`Canonical must point to the same language: ${file}`)
 assert.equal(head.match(/property="og:url" content="([^"]+)"/)?.[1],canonical)
 for(const [lang,tag]of Object.entries(languages))assert.ok(head.includes(`hrefLang="${tag}" href="${publicUrl(localizedPath(contentPath,lang))}"`),`Missing alternate ${tag}: ${file}`)
 assert.ok(head.includes(`hrefLang="x-default" href="${publicUrl(localizedPath(contentPath,'es'))}"`))
 if(!html.includes('noindex')){
  indexable.push(canonical)
  const description=(head.match(/name="description" content="([^"]*)"/)?.[1]||'').replace(/&(amp|quot|apos|lt|gt|#x[\da-f]+|#\d+);/gi,(_,entity)=>entity[0]==='#'?String.fromCodePoint(entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):parseInt(entity.slice(1),10)):({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'})[entity.toLowerCase()])
  const length=Array.from(description).length
  assert.ok(length>=140&&length<=160,`Description must be 140–160 characters: ${file} (${length})`)
  descriptions.push(description)
 }
 for(const [,body]of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  const schema=JSON.parse(body);assert.ok(schema['@context']);assert.ok(!body.includes('aggregateRating'))
  if(body.includes('inLanguage'))assert.ok(body.includes(`"inLanguage":"${languages[locale]}"`))
 }
 for(const [,href]of visible.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
  if(!href.startsWith('/')&&!href.startsWith('#'))continue
  const url=new URL(href.replace(/&amp;/g,'&'),canonical),route=url.pathname.replace(/\/$/,'')
  const target=route?`out${route}.html`:'out/index.html'
  assert.ok(fs.existsSync(target),`Broken link ${href} in ${file}`)
  if(url.hash)assert.ok(fs.readFileSync(target,'utf8').includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`Broken anchor ${href} in ${file}`)
  localLinks++
 }
}
const sitemap=fs.readFileSync('out/sitemap.xml','utf8')
assert.ok(!sitemap.includes('/career'))
assert.equal(indexable.length,Object.keys(languages).length*(6+guides.length))
assert.equal((sitemap.match(/<loc>/g)||[]).length,indexable.length)
assert.equal(new Set(descriptions).size,descriptions.length,'Duplicate meta descriptions')
for(const url of indexable)assert.ok(sitemap.includes(`<loc>${url}</loc>`),`Missing sitemap URL ${url}`)
for(const locale of Object.keys(languages)){
 const career=fs.readFileSync(`out/${locale}/career.html`,'utf8')
 assert.ok(career.match(/name="robots" content="noindex, follow"/))
 const home=fs.readFileSync(locale==='es'?'out/index.html':`out/${locale}.html`,'utf8');assert.ok(home.includes('VideoGame'));assert.ok(!home.includes('FAQPage'));assert.ok(home.includes(`${origin}/#website`))
 assert.ok(!home.includes('FREE BROWSER GAME · NO SIGN-UP'))
}
assert.ok(fs.readFileSync('out/index.html','utf8').includes('rel="canonical" href="https://copero.pro"'))
assert.ok(!fs.readFileSync('out/index.html','utf8').includes('name="robots" content="noindex'))
assert.ok(fs.readFileSync('out/robots.txt','utf8').includes(`Sitemap: ${origin}/sitemap.xml`))
const titles=indexable.map(url=>fs.readFileSync(new URL(url).pathname==='/'?'out/index.html':`out${new URL(url).pathname}.html`,'utf8').match(/<title>(.*?)<\/title>/)?.[1])
assert.equal(new Set(titles).size,titles.length,'Duplicate titles')
console.log(`PASS: ${htmlFiles.length} localized HTML pages, ${indexable.length} indexable URLs, ${localLinks} local links, 6 html languages, reciprocal hreflang/x-default, self canonical, JSON-LD, sitemap and private-career noindex`)

for(const lang of Object.keys(languages)){const html=fs.readFileSync(`out/${lang}/guides/copero-training-strategy.html`,'utf8');assert.equal((html.match(/<tbody><tr/g)||[]).length,1);assert.ok(html.includes('copero-strategy-v1'));assert.ok(html.includes('Harbor Athletic'));assert.ok(html.includes('Capital Academy'))}
