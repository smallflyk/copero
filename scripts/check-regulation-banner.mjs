import { readFileSync } from 'node:fs'

const regulationHtml = readFileSync('out/regulation-set-m-b.html', 'utf8')
const gameplayHtml = readFileSync('out/gameplay.html', 'utf8')

if (regulationHtml.includes('class="status-note"') || regulationHtml.includes('<strong>Format note:</strong>')) {
  console.error('Regulation M-B page still renders the Format note status banner')
  process.exit(1)
}

const requiredRegulationContent = [
  'What is Pokémon Champions Regulation M-B?',
  'Regulation M-B rules and timers',
  'Eligible Pokémon and Mega choices',
  'Mega Charizard Y and the “Big Six”',
  'The leading non-Mega Pokémon',
  'Mega Floette and setup teams',
  'Weather teams in Regulation M-B',
  'Mega Gengar and Perish Song',
  'Off-meta Mega Evolutions',
  'How to build legally for M-B',
  'June 17, 2026 until September 2, 2026',
  '20 minutes',
  'seven-minute player timer',
  '45-second limit',
  '90 seconds',
  'duplicate held items',
  'one Mega Evolution per player',
  'Availability in Pokémon Champions, transfer support through Pokémon HOME, and M-B legality are three related but different questions.',
  'five Top 8 places at Japan Nationals, including first',
  'Sneasler, Garchomp, Basculegion, Kingambit, and Incineroar',
  'Mega Floette’s Fairy Aura boosts Fairy-type moves on the field.',
  'Rain lacks a Mega Pokémon with Drizzle',
  'Shadow Tag can prevent non-Ghost opponents from switching.',
  'Mega Staraptor uses Contrary',
  'Start with the official eligibility list',
]

for (const expectedText of requiredRegulationContent) {
  if (!regulationHtml.includes(expectedText)) {
    console.error(`Regulation M-B page content is missing: ${expectedText}`)
    process.exit(1)
  }
}

if (!gameplayHtml.includes('class="status-note"')) {
  console.error('Shared status notes were removed from unrelated guide pages')
  process.exit(1)
}

console.log('PASS: Regulation M-B banner removed without affecting rules content')
