export type CodeItem = {
  code: string
  reward: string
  status: 'active' | 'expired'
  sourceType: 'official' | 'community' | 'unknown'
  expiryDate?: string
  addedDate?: string
  lastChecked: string
  notes?: string
}

export type RewardHistoryItem = {
  reward: string
  distribution: string
  date: string
  source: string
}

// Source: keywords-materials/codes/pokemon-champions-codes.md.
// Status is checked against the documented expiry dates on August 29, 2026.
export const codes: CodeItem[] = [
  {
    code: 'W0R1DCHAMP10NS26',
    reward: '5,000 Victory Points',
    status: 'active',
    sourceType: 'community',
    addedDate: 'August 21, 2026',
    lastChecked: 'August 29, 2026',
    notes: 'No end date was listed in the research material.',
  },
  {
    code: 'HAJ1MAR1G1FT',
    reward: '100 Quick Coupons',
    status: 'active',
    sourceType: 'community',
    addedDate: 'June 17, 2026',
    expiryDate: 'August 31, 2026',
    lastChecked: 'August 29, 2026',
  },
  {
    code: 'CHAMP10N',
    reward: 'Machamp',
    status: 'active',
    sourceType: 'community',
    addedDate: 'April 8, 2026',
    expiryDate: 'August 31, 2026',
    lastChecked: 'August 29, 2026',
  },
  {
    code: 'NA1CCHAMP',
    reward: '22 Quick Coupons',
    status: 'expired',
    sourceType: 'community',
    addedDate: 'June 14, 2026',
    expiryDate: 'June 14, 2026',
    lastChecked: 'August 29, 2026',
  },
  {
    code: 'L12ARD0NPJCS26',
    reward: 'Charizard with the “Charizard the Festive” title',
    status: 'expired',
    sourceType: 'community',
    addedDate: 'June 6, 2026',
    expiryDate: 'June 14, 2026',
    lastChecked: 'August 29, 2026',
  },
  {
    code: 'DRAG0NDANCEPTC26',
    reward: 'Gyarados with a title',
    status: 'expired',
    sourceType: 'community',
    addedDate: 'May 24, 2026',
    expiryDate: 'May 31, 2026',
    lastChecked: 'August 29, 2026',
  },
]

export const sidebarCodes = codes.filter((item) => item.status === 'active').slice(0, 2)

// This archive should only contain documented official distributions.
export const rewardHistory: RewardHistoryItem[] = [
  {
    reward: 'Raichu, Raichunite X, and Raichunite Y',
    distribution: 'In-game mailbox after the mobile release',
    date: 'June 17–September 1, 2026',
    source: 'Official Pokémon news',
  },
]

export const codesLastChecked = 'August 29, 2026'
