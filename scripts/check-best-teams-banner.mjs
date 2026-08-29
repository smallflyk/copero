import { readFileSync } from 'node:fs'

const bestTeamsHtml = readFileSync('out/best-teams.html', 'utf8')
const gameplayHtml = readFileSync('out/gameplay.html', 'utf8')

if (bestTeamsHtml.includes('class="status-note"') || bestTeamsHtml.includes('<strong>Result note:</strong>')) {
  console.error('Best Teams page still renders the Result note status banner')
  process.exit(1)
}

const requiredBodyContent = [
  'What are the best Pokémon Champions teams?',
  'Mega Floette and Charizard “Big Six”',
  '11-1',
  'Staraptor and Mega Raichu Y tournament roster',
  '13-1',
  'Mega Swampert rain with a sun option',
  '12-2',
  'Mega Delphox setup roster',
  '10-4',
  'Mega Froslass and Mega Scovillain roster',
  '12-0',
  'How to read tournament records',
]

for (const expectedText of requiredBodyContent) {
  if (!bestTeamsHtml.includes(expectedText)) {
    console.error(`Best Teams page body content is missing: ${expectedText}`)
    process.exit(1)
  }
}

if (!gameplayHtml.includes('class="status-note"')) {
  console.error('Shared status notes were removed from unrelated guide pages')
  process.exit(1)
}

console.log('PASS: best-teams banner removed without affecting guide content')
