import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
import {checkDeployment} from '../scripts/check-live-deployment.mjs'
const commit='a'.repeat(40)

test('CI release stamping requires an existing build and records only public commit metadata',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'copero-release-'))
 try{
  fs.mkdirSync(path.join(dir,'out'));fs.writeFileSync(path.join(dir,'out/index.html'),'<html/>')
  const script=path.resolve('scripts/write-release.mjs')
  execFileSync(process.execPath,[script],{cwd:dir,env:{...process.env,GITHUB_SHA:commit},stdio:'pipe'})
  const marker=JSON.parse(fs.readFileSync(path.join(dir,'out/__release.json'),'utf8'))
  assert.equal(marker.commit,commit);assert.deepEqual(Object.keys(marker).sort(),['builtAt','commit'])
  assert.throws(()=>execFileSync(process.execPath,[script],{cwd:dir,env:{...process.env,GITHUB_SHA:'invalid'},stdio:'pipe'}))
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
})

async function withSite(overrides,run){
 const server=http.createServer((request,response)=>{
  const url=new URL(request.url,`http://${request.headers.host}`)
  if(url.pathname==='/__release.json'){response.setHeader('content-type','application/json');response.end(JSON.stringify({commit:overrides.commit||commit}));return}
  if(url.pathname==='/es'){response.writeHead(301,{location:new URL(overrides.redirect||'/?deployment-check=1',url).href});response.end();return}
  if(url.pathname==='/missing-ci-deployment-check'){response.writeHead(404);response.end('Missing');return}
  const types={'/sitemap.xml':'application/xml','/robots.txt':'text/plain','/opengraph-image':'image/png'}
  if(types[url.pathname]){response.setHeader('content-type',types[url.pathname]);response.end('Fixture');return}
  const locale=url.pathname.split('/')[1],language=locale==='zh'?'zh-Hans':['en','it','pt','de'].includes(locale)?locale:'es'
  response.setHeader('content-type','text/html')
  response.end(`<html lang="${language}"><head>${url.pathname==='/es/career'&&!overrides.missingNoindex?'<meta name="robots" content="noindex, follow"/>':''}</head><body>Copero</body></html>`)
 })
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
 try{await run(`http://127.0.0.1:${server.address().port}`)}finally{await new Promise(resolve=>{server.close(resolve);server.closeAllConnections()})}
}
test('deployment probe validates release identity, all language homes, private career and routing',async()=>{
 await withSite({},base=>checkDeployment({base,expected:commit,attempts:1}))
})
test('deployment probe rejects an old release even when the site responds successfully',async()=>{
 await withSite({commit:'b'.repeat(40)},base=>assert.rejects(checkDeployment({base,expected:commit,attempts:1}),/does not match/))
})
test('deployment probe catches a missing private-career noindex',async()=>{
 await withSite({missingNoindex:true},base=>assert.rejects(checkDeployment({base,expected:commit,attempts:1}),/missing noindex/))
})
test('deployment probe catches lost query parameters in the Spanish alias redirect',async()=>{
 await withSite({redirect:'/'},base=>assert.rejects(checkDeployment({base,expected:commit,attempts:1}),/preserve the query/))
})
