import fs from 'node:fs'
const commit=process.env.GITHUB_SHA
if(!commit||!/^[0-9a-f]{40}$/.test(commit))throw new Error('GITHUB_SHA must be a full Git commit SHA.')
if(!fs.existsSync('out/index.html'))throw new Error('Build the static export before stamping it.')
fs.writeFileSync('out/__release.json',JSON.stringify({commit,builtAt:new Date().toISOString()})+'\n')
console.log(`Stamped static export with commit ${commit}.`)
