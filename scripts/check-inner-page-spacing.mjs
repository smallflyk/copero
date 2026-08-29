import { readdirSync, readFileSync } from 'node:fs'

const css = readdirSync('out/_next/static/css')
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(`out/_next/static/css/${file}`, 'utf8'))
  .join('')
  .replace(/\r?\n/g, '')

const desktopSpacing = '.detail-hero+.section,.featured-pokemon-hero+.section,.page-hero+.section,.page-hero+.wrap+.section{padding-top:44px}'
const firstHeadingReset = '.detail-hero+.section .article>h2:first-of-type,.featured-pokemon-hero+.section .article>h2:first-of-type,.page-hero+.section .article>h2:first-of-type,.page-hero+.wrap+.section .article>h2:first-of-type{margin-top:0}'
const mobileSpacing = '@media(max-width:760px){.detail-hero+.section,.featured-pokemon-hero+.section,.page-hero+.section,.page-hero+.wrap+.section{padding-top:36px}}'

for (const [label, expectedRule] of [
  ['desktop inner-page spacing', desktopSpacing],
  ['first article heading reset', firstHeadingReset],
  ['mobile inner-page spacing', mobileSpacing],
]) {
  if (!css.includes(expectedRule)) {
    console.error(`Built CSS is missing ${label}`)
    process.exit(1)
  }
}

const representativePages = [
  ['out/codes.html', /<section class="page-hero">.*?<\/section><section class="section"><article class="article wrap"><h2>/s, 'Which Pokémon Champions codes work?'],
  ['out/gameplay.html', /<section class="page-hero">.*?<\/section><div class="wrap"><div class="status-note".*?<\/div><\/div><section class="section"><article class="article wrap"><h2>/s, 'What is Pokémon Champions gameplay like?'],
  ['out/beginner-guide.html', /<section class="page-hero">.*?<\/section><section class="section"><article class="article wrap"><div class="callout">.*?<\/div><h2>/s, '1. What is Pokémon Champions?'],
  ['out/pokemon/gengar.html', /<section class="detail-hero">.*?<\/section><section class="section"><article class="article wrap"><h2>/s, 'Regulation M-B Build Guide'],
  ['out/pokemon/metagross.html', /<section class="featured-pokemon-hero">.*?<\/section><section class="section"><article class="article wrap featured-guide-copy"><h2>/s, 'Best Metagross Build in Pokémon Champions'],
]

for (const [path, structurePattern, content] of representativePages) {
  const html = readFileSync(path, 'utf8')
  if (!structurePattern.test(html) || !html.includes(content)) {
    console.error(`Representative inner page is missing expected structure or content: ${path}`)
    process.exit(1)
  }
}

console.log('PASS: inner-page title-to-content spacing is compact across shared layouts')
