import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../cloudflare-worker.mjs'
test('the old template host is never a redirect target',async()=>{
 const response=await worker.fetch(new Request('https://www.copero.pro/how-it-works?x=1'),{})
 assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://copero.pro/es/how-it-works?x=1')
})
test('assets keep their status and get security headers and a correct social-image MIME',async()=>{
 const env={ASSETS:{fetch:async()=>new Response('png',{headers:{'content-type':'application/octet-stream'}})}}
 const response=await worker.fetch(new Request('https://copero.pro/opengraph-image'),env)
 assert.equal(response.headers.get('content-type'),'image/png');assert.equal(response.headers.get('x-content-type-options'),'nosniff')
 const missing=await worker.fetch(new Request('https://copero.pro/missing'),{ASSETS:{fetch:async()=>new Response('not found',{status:404})}})
 assert.equal(missing.status,404)
})

test('Spanish home is served at the domain root and localized paths keep their language',async()=>{
 const response=await worker.fetch(new Request('https://copero.pro/es?from=home'),{})
 assert.equal(response.status,301);assert.equal(response.headers.get('location'),'https://copero.pro/?from=home')
 const home=await worker.fetch(new Request('https://copero.pro/'),{ASSETS:{fetch:async()=>new Response('Spanish home')}})
 assert.equal(home.status,200);assert.equal(await home.text(),'Spanish home')
 const localized=await worker.fetch(new Request('https://copero.pro/de/guides'),{ASSETS:{fetch:async()=>new Response('de')}})
 assert.equal(localized.status,200);assert.equal(await localized.text(),'de')
})
test('missing pages use a localized fallback while retaining a real 404 status',async()=>{
 const env={ASSETS:{fetch:async request=>new URL(request.url).pathname==='/zh/404'?new Response('页面未找到',{headers:{'content-type':'text/html'}}):new Response('missing',{status:404})}}
 const response=await worker.fetch(new Request('https://copero.pro/zh/unknown'),env)
 assert.equal(response.status,404);assert.equal(await response.text(),'页面未找到')
})
