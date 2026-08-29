import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const publisherId = 'ca-pub-2781955398980978'
const scriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`

function htmlFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? htmlFiles(path) : path.endsWith('.html') ? [path] : []
  })
}

const pages = htmlFiles('out')

if (pages.length === 0) {
  console.error('No exported HTML pages found')
  process.exit(1)
}

for (const path of pages) {
  const html = readFileSync(path, 'utf8')
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1]
  const adsenseScripts = [...html.matchAll(/<script([^>]*)src="([^"]*adsbygoogle\.js[^"]*)"([^>]*)><\/script>/g)]
  const accountMeta = (head ?? '').match(/<meta name="google-adsense-account" content="([^"]+)"\/>/)?.[1]

  if (!head || adsenseScripts.length !== 1) {
    console.error(`Expected exactly one AdSense script in ${path}`)
    process.exit(1)
  }

  if (!head.includes(adsenseScripts[0][0])) {
    console.error(`AdSense script is outside the head in ${path}`)
    process.exit(1)
  }

  const scriptAttributes = `${adsenseScripts[0][1]}${adsenseScripts[0][3]}`
  if (
    adsenseScripts[0][2] !== scriptUrl
    || !scriptAttributes.includes('async=""')
    || !scriptAttributes.toLowerCase().includes('crossorigin="anonymous"')
  ) {
    console.error(`AdSense script is not configured for ${publisherId} in ${path}`)
    process.exit(1)
  }

  if (accountMeta !== publisherId) {
    console.error(`AdSense account metadata does not match ${publisherId} in ${path}`)
    process.exit(1)
  }

  const publisherIds = [...html.matchAll(/ca-pub-\d+/g)].map((match) => match[0])
  if (publisherIds.some((id) => id !== publisherId)) {
    console.error(`A stale AdSense publisher ID remains in ${path}`)
    process.exit(1)
  }
}

const adsTxt = readFileSync('out/ads.txt', 'utf8').trim()
const expectedAdsTxt = 'google.com, pub-2781955398980978, DIRECT, f08c47fec0942fa0'

if (adsTxt !== expectedAdsTxt) {
  console.error('Exported ads.txt does not authorize the approved AdSense publisher ID')
  process.exit(1)
}

console.log(`PASS: ${pages.length} exported pages use the approved AdSense publisher ID`)
