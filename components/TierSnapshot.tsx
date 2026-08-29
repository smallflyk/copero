const tiers = [
  ['S', 'Meta-Dominant', 'Floette'],
  ['A', 'Meta', 'Kingambit, Venusaur, Basculegion'],
  ['B', 'Strong', 'Delphox, Charizard, Sneasler, Incineroar, Pelipper'],
  ['C', 'Proven', 'Archaludon, Sinistcha, Swampert, Whimsicott, Garchomp, Grimmsnarl, Gholdengo, Milotic, Sylveon, Staraptor, Farigiraf, Aerodactyl, Tyranitar'],
  ['D', 'Viable', 'Metagross, Raichu'],
]

export default function TierSnapshot() {
  return <div className="table-wrap"><table className="data-table"><thead><tr><th>Tier</th><th>Label</th><th>Pokémon in the supplied snapshot</th></tr></thead><tbody>{tiers.map((tier) => <tr key={tier[0]}><td>{tier[0]}</td><td>{tier[1]}</td><td>{tier[2]}</td></tr>)}</tbody></table></div>
}
