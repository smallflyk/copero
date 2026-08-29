import { readFileSync } from 'node:fs'

const pokemonHtml = readFileSync('out/pokemon.html', 'utf8')
const gameplayHtml = readFileSync('out/gameplay.html', 'utf8')

if (pokemonHtml.includes('class="status-note"') || pokemonHtml.includes('<strong>Roster note:</strong>')) {
  console.error('Pokémon List page still renders the Roster note status banner')
  process.exit(1)
}

const requiredRosterContent = [
  'Which Pokémon are in Pokémon Champions?',
  'Kanto Pokémon in the collected roster',
  'Johto Pokémon in the collected roster',
  'Hoenn Pokémon in the collected roster',
  'Sinnoh Pokémon in the collected roster',
  'Unova Pokémon in the collected roster',
  'Kalos Pokémon in the collected roster',
  'Alola and Galar Pokémon in the collected roster',
  'Hisui and Paldea Pokémon in the collected roster',
  'How to get Pokémon for your team',
  'Available does not mean legal in Ranked',
  'Venusaur',
  'Hydrapple',
]

for (const expectedText of requiredRosterContent) {
  if (!pokemonHtml.includes(expectedText)) {
    console.error(`Pokémon List page roster content is missing: ${expectedText}`)
    process.exit(1)
  }
}

if (!gameplayHtml.includes('class="status-note"')) {
  console.error('Shared status notes were removed from unrelated guide pages')
  process.exit(1)
}

console.log('PASS: Pokémon List banner removed without affecting roster content')
