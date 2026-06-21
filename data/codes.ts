export type GiftCode = { code: string; reward: string; status: 'active' | 'expired'; expiryDate?: string; addedDate?: string; notes?: string }

export const codes: GiftCode[] = [
  { code: 'NO ACTIVE CODES', reward: 'No official Mystery Gift codes have been confirmed yet.', status: 'active', notes: 'We never list guessed or unverified codes.' },
  { code: 'LAUNCH-GIFT', reward: 'Example placeholder reward', status: 'expired', expiryDate: 'Not an official code', notes: 'Shown only to demonstrate the archive format.' },
  { code: 'WELCOME-TEAM', reward: 'Example placeholder reward', status: 'expired', expiryDate: 'Not an official code', notes: 'Shown only to demonstrate the archive format.' },
  { code: 'RANKED-READY', reward: 'Example placeholder reward', status: 'expired', expiryDate: 'Not an official code', notes: 'Shown only to demonstrate the archive format.' },
  { code: 'CHAMPIONS-2026', reward: 'Example placeholder reward', status: 'expired', expiryDate: 'Not an official code', notes: 'Shown only to demonstrate the archive format.' },
]
