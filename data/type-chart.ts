export const defensiveWeaknesses: Record<string, string[]> = {
  Normal: ['Fighting'], Fire: ['Water','Ground','Rock'], Water: ['Electric','Grass'],
  Electric: ['Ground'], Grass: ['Fire','Ice','Poison','Flying','Bug'], Ice: ['Fire','Fighting','Rock','Steel'],
  Fighting: ['Flying','Psychic','Fairy'], Poison: ['Ground','Psychic'], Ground: ['Water','Grass','Ice'],
  Flying: ['Electric','Ice','Rock'], Psychic: ['Bug','Ghost','Dark'], Bug: ['Fire','Flying','Rock'],
  Rock: ['Water','Grass','Fighting','Ground','Steel'], Ghost: ['Ghost','Dark'], Dragon: ['Ice','Dragon','Fairy'],
  Dark: ['Fighting','Bug','Fairy'], Steel: ['Fire','Fighting','Ground'], Fairy: ['Poison','Steel'],
}

export function getDefensiveWeaknesses(types: string[]) {
  return [...new Set(types.flatMap((type) => defensiveWeaknesses[type] || []))]
}
