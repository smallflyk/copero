import type { Club } from '@/lib/game/types'
export const clubs: Club[] = [
 { id:'harbor',name:'Harbor Athletic',city:'Northport',tier:1,league:'Regional League',quality:40,opportunity:88,competition:40,strength:38,salary:24000,color:'#e4b973',identity:'Small club · First-team football' },
 { id:'riverside',name:'Riverside Union',city:'Riverside',tier:2,league:'Development League',quality:65,opportunity:65,competition:54,strength:55,salary:48000,color:'#78bca6',identity:'Development club · Room to grow' },
 { id:'capital',name:'Capital Academy',city:'Capital City',tier:3,league:'National League',quality:89,opportunity:36,competition:72,strength:74,salary:78000,color:'#8cabc9',identity:'Elite academy · Earn your place' },
 { id:'forge',name:'Forge City',city:'Ironbridge',tier:2,league:'Development League',quality:58,opportunity:82,competition:50,strength:52,salary:62000,color:'#c88474',identity:'Development club · A bigger role' },
 { id:'coastal',name:'Coastal Rovers',city:'Seabrook',tier:3,league:'National League',quality:73,opportunity:75,competition:65,strength:70,salary:180000,color:'#b6c48b',identity:'National club · Reliable minutes' },
 { id:'montvale',name:'Montvale FC',city:'Montvale',tier:4,league:'Premier Division',quality:85,opportunity:57,competition:79,strength:85,salary:600000,color:'#b6a0c6',identity:'Premier club · The next step' },
 { id:'aurora',name:'Aurora Sporting',city:'Aurora',tier:5,league:'Premier Division',quality:96,opportunity:42,competition:88,strength:94,salary:1600000,color:'#d7b56e',identity:'Elite club · Chase the biggest stage' },
]
export const academies = clubs.slice(0,3)
export function getClub(id: string): Club { const club = clubs.find((item) => item.id === id); if (!club) throw new Error('Unknown club. Choose one of the available offers.'); return club }
