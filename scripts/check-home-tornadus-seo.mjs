import { readFileSync } from 'node:fs'

const keyword = 'tornadus pokemon champions'
const html = readFileSync('out/index.html', 'utf8')

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function metaContent(property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = html.match(new RegExp(`<meta (?:name|property)="${escaped}" content="([^"]*)"`))
  return decodeEntities(match?.[1] ?? '')
}

const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1]
if (!main) {
  console.error('Homepage main content was not found')
  process.exit(1)
}

const visibleText = decodeEntities(main)
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const words = visibleText.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? []
const occurrences = visibleText.toLowerCase().match(new RegExp(keyword, 'g'))?.length ?? 0
const density = occurrences / words.length * 100

if (words.length < 1000 || words.length > 1200) {
  console.error(`Homepage word count must be 1000-1200; received ${words.length}`)
  process.exit(1)
}

if (density < 3 || density > 5) {
  console.error(`Homepage keyword density must be 3%-5%; received ${density.toFixed(2)}% from ${occurrences} exact matches across ${words.length} words`)
  process.exit(1)
}

const title = decodeEntities(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '')
const description = metaContent('description')
const openGraphTitle = metaContent('og:title')
const openGraphDescription = metaContent('og:description')
const openGraphUrl = metaContent('og:url')
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ''
const normalizeUrl = (value) => value.replace(/\/$/, '')

if (!title.toLowerCase().includes(keyword) || title.length > 60) {
  console.error(`Homepage title must contain the keyword and stay within 60 characters; received "${title}"`)
  process.exit(1)
}

if (!description.toLowerCase().includes(keyword) || description.length < 140 || description.length > 160) {
  console.error(`Homepage description must contain the keyword and be 140-160 characters; received ${description.length}`)
  process.exit(1)
}

if (openGraphTitle !== title || openGraphDescription !== description) {
  console.error('Homepage Open Graph title and description must match the primary metadata')
  process.exit(1)
}

if (normalizeUrl(canonical) !== 'https://www.pokemonchampions.pro' || normalizeUrl(openGraphUrl) !== normalizeUrl(canonical)) {
  console.error('Homepage canonical and Open Graph URL must agree')
  process.exit(1)
}

if (!main.includes('href="/pokemon/tornadus"')) {
  console.error('Homepage must link to the Tornadus guide')
  process.exit(1)
}

console.log(`PASS: homepage has ${words.length} words, ${occurrences} exact keyword matches, and ${density.toFixed(2)}% exact-phrase density`)
