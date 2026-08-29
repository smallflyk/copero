import { readFileSync } from 'node:fs'

const html = readFileSync('out/index.html', 'utf8')
const footer = html.match(/<footer class="footer">(.*?)<\/footer>/s)?.[1]

if (!footer) {
  console.error('Footer not found in out/index.html')
  process.exit(1)
}

const descriptionColumn = footer.match(/<div class="footer-grid wrap"><div>(.*?)<\/div><div>/s)?.[1]
const paragraphs = [...(descriptionColumn || '').matchAll(/<p(?: class="[^"]+")?>(.*?)<\/p>/gs)]
const expected = 'PokémonChampions.pro is an unofficial fan-made guide and is not affiliated with Nintendo, The Pokémon Company, Game Freak, or any official Pokémon brand.'

if (paragraphs.length !== 1 || !paragraphs[0][1].includes(expected)) {
  console.error(`Expected one footer description with the approved copy, found ${paragraphs.length}`)
  process.exit(1)
}

console.log('PASS: footer contains only the approved description')
