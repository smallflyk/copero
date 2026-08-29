import { readFileSync } from 'node:fs'

const codesHtml = readFileSync('out/codes.html', 'utf8')
const gameplayHtml = readFileSync('out/gameplay.html', 'utf8')

if (codesHtml.includes('class="status-note"') || codesHtml.includes('Last checked:')) {
  console.error('Codes page still renders the Last checked status banner')
  process.exit(1)
}

if (!codesHtml.includes('Which Pokémon Champions codes work?')) {
  console.error('Codes page body content is missing')
  process.exit(1)
}

if (!gameplayHtml.includes('class="status-note"')) {
  console.error('Shared status notes were removed from unrelated guide pages')
  process.exit(1)
}

console.log('PASS: codes banner removed without affecting guide content')
