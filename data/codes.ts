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

// Trust policy: only add a code after its source and reward can be verified.
// An empty array intentionally means that no active or expired code is confirmed.
export const codes: CodeItem[] = []

// This archive should only contain documented official distributions.
export const rewardHistory: RewardHistoryItem[] = []

export const codesLastChecked = 'June 22, 2026'
