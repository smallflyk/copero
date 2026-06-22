export type Regulation = {
  name: string
  slug: string
  status: 'current' | 'past' | 'upcoming'
  startDate: string
  endDate: string
  lastUpdated: string
  singlesTeam: string
  doublesTeam: string
  battleLevel: string
  playerTime: string
  previewTime: string
  turnTime: string
  featuredPokemon: string[]
  notes: string[]
}

export const regulationMB: Regulation = {
  name: 'Regulation Set M-B',
  slug: 'regulation-set-m-b',
  status: 'current',
  startDate: 'June 17, 2026',
  endDate: 'September 2, 2026',
  lastUpdated: 'June 22, 2026',
  singlesTeam: 'Register 3–6 Pokémon and choose 3 for battle',
  doublesTeam: 'Register 4–6 Pokémon and choose 4 for battle',
  battleLevel: 'All participating Pokémon are set to Level 50',
  playerTime: '10 minutes',
  previewTime: '90 seconds',
  turnTime: '60 seconds',
  featuredPokemon: ['mega-raichu-x', 'mega-raichu-y', 'incineroar', 'metagross', 'garchomp', 'amoonguss', 'kingambit', 'sneasler'],
  notes: [
    'Only Pokémon shown as eligible by the in-game Regulation Set M-B notice can enter ranked battles.',
    'Mega Evolution remains a central team-building decision; plan which Pokémon will use the team’s Mega opportunity.',
    'The eligible roster and available tools expanded from Set M-A, so every saved team should be rechecked before ranked play.',
  ],
}
