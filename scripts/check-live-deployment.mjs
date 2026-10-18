import {pathToFileURL} from 'node:url'
export async function checkDeployment({base='https://copero.pro',expected,attempts=15}) {
if(!expected||!/^[0-9a-f]{40}$/.test(expected))throw new Error('EXPECTED_COMMIT must be a full Git commit SHA.')
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function request(path,options={}){
 return fetch(new URL(path,base),{cache:'no-store',signal:AbortSignal.timeout(8000),...options})
}
let confirmed=false
for(let attempt=1;attempt<=attempts;attempt++){
 try{
  const response=await request(`/__release.json?deployment=${expected}`)
  if(response.ok&&(await response.json()).commit===expected){confirmed=true;break}
 }catch{/* Retry while the new release propagates. */}
 if(attempt<attempts)await pause(3000)
}
if(!confirmed)throw new Error('The live release does not match this GitHub commit. Inspect the Cloudflare deployment.')
for(const [path,language,privatePage] of [
 ['/','es',false],['/en','en',false],['/it','it',false],['/pt','pt',false],['/zh','zh-Hans',false],['/de','de',false],
 ['/es/career','es',true],['/es/how-it-works','es',false],['/es/guides','es',false],
 ['/es/guides/copero-training-strategy','es',false],['/es/privacy-policy','es',false],
]){
 const response=await request(path)
 if(response.status!==200)throw new Error(`${path}: expected 200, got ${response.status}`)
 const html=await response.text()
 if(!html.includes(`lang="${language}"`))throw new Error(`${path}: incorrect HTML language`)
 if(privatePage&&!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html))throw new Error(`${path}: missing noindex`)
 console.log(`PASS ${path}`)
}
for(const [path,type] of [['/sitemap.xml','application/xml'],['/robots.txt','text/plain'],['/opengraph-image','image/png']]){
 const response=await request(path)
 if(response.status!==200||!response.headers.get('content-type')?.includes(type))throw new Error(`${path}: unexpected status or content type`)
 await response.body?.cancel()
}
const redirect=await request('/es?deployment-check=1',{redirect:'manual'})
if(redirect.status!==301||redirect.headers.get('location')!==new URL('/?deployment-check=1',base).href)throw new Error('Spanish home redirect did not preserve the query.')
const missing=await request('/missing-ci-deployment-check')
if(missing.status!==404)throw new Error('Missing page must return 404.')
await missing.body?.cancel()
console.log(`PASS: ${base} serves commit ${expected}, localized pages, private career, sitemap, robots, image and redirects.`)

}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
 await checkDeployment({base:process.env.COPERO_BASE_URL,expected:process.env.EXPECTED_COMMIT})
}
