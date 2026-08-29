import { readFileSync } from 'node:fs'

const tierListHtml = readFileSync('out/tier-list.html', 'utf8')
const gameplayHtml = readFileSync('out/gameplay.html', 'utf8')

if (tierListHtml.includes('class="status-note"') || tierListHtml.includes('<strong>Snapshot:</strong>')) {
  console.error('Tier List page still renders the Snapshot status banner')
  process.exit(1)
}

if (!tierListHtml.includes('What is the current Pokémon Champions tier list?')) {
  console.error('Tier List page body content is missing')
  process.exit(1)
}

if (!gameplayHtml.includes('class="status-note"')) {
  console.error('Shared status notes were removed from unrelated guide pages')
  process.exit(1)
}

console.log('PASS: tier-list banner removed without affecting guide content')
