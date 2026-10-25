import type { Attributes, Position } from './types'
export const RULE_VERSION = '1.2'
export const BONUS_POINTS = 6
export const MAX_AGE = 38
export const NATIONALITIES = ['Argentina', 'Brazil', 'England', 'France', 'Germany', 'Italy', 'Japan', 'Mexico', 'Morocco', 'Netherlands', 'Nigeria', 'Portugal', 'South Korea', 'Spain', 'United States', 'Uruguay']
export const TEMPLATES: Record<Position, Attributes> = {
  ST: { pace: 58, shooting: 61, passing: 43, dribbling: 52, defending: 28, physical: 53 },
  LW: { pace: 63, shooting: 52, passing: 48, dribbling: 60, defending: 27, physical: 42 },
  RW: { pace: 63, shooting: 52, passing: 48, dribbling: 60, defending: 27, physical: 42 },
  CAM: { pace: 49, shooting: 49, passing: 62, dribbling: 59, defending: 31, physical: 40 },
  CM: { pace: 45, shooting: 42, passing: 60, dribbling: 53, defending: 45, physical: 50 },
  CDM: { pace: 41, shooting: 30, passing: 54, dribbling: 43, defending: 60, physical: 58 },
  LB: { pace: 59, shooting: 29, passing: 48, dribbling: 47, defending: 57, physical: 49 },
  RB: { pace: 59, shooting: 29, passing: 48, dribbling: 47, defending: 57, physical: 49 },
  CB: { pace: 39, shooting: 24, passing: 40, dribbling: 30, defending: 64, physical: 63 },
  GK: { pace: 34, shooting: 16, passing: 44, dribbling: 24, defending: 65, physical: 61 },
}
// Weights sum to one. GK defending represents positioning/shot prevention;
// physical represents reach/handling, since the MVP uses six shared attributes.
export const WEIGHTS: Record<Position, Attributes> = {
  ST: { pace:.15, shooting:.4, passing:.05, dribbling:.2, defending:.02, physical:.18 },
  LW: { pace:.3, shooting:.2, passing:.1, dribbling:.32, defending:.02, physical:.06 },
  RW: { pace:.3, shooting:.2, passing:.1, dribbling:.32, defending:.02, physical:.06 },
  CAM: { pace:.08, shooting:.16, passing:.38, dribbling:.3, defending:.02, physical:.06 },
  CM: { pace:.06, shooting:.08, passing:.4, dribbling:.2, defending:.12, physical:.14 },
  CDM: { pace:.04, shooting:.02, passing:.22, dribbling:.08, defending:.4, physical:.24 },
  LB: { pace:.22, shooting:.02, passing:.16, dribbling:.08, defending:.36, physical:.16 },
  RB: { pace:.22, shooting:.02, passing:.16, dribbling:.08, defending:.36, physical:.16 },
  CB: { pace:.08, shooting:.01, passing:.06, dribbling:.02, defending:.53, physical:.3 },
  GK: { pace:.04, shooting:0, passing:.08, dribbling:.02, defending:.56, physical:.3 },
}
export const POSITION_NAMES: Record<Position,string> = { ST:'Striker', LW:'Left winger', RW:'Right winger', CAM:'Attacking midfielder', CM:'Central midfielder', CDM:'Defensive midfielder', LB:'Left back', RB:'Right back', CB:'Centre back', GK:'Goalkeeper' }
export const ZERO_BONUSES: Attributes = { pace:0, shooting:0, passing:0, dribbling:0, defending:0, physical:0 }
export const TRAINING_OPTIONS = [
  { value:'intensive', title:'Push your limits', detail:'Faster development. Higher fatigue and injury risk.', tag:'Intensive' },
  { value:'balanced', title:'Build consistency', detail:'Steady progress with manageable physical demand.', tag:'Balanced' },
  { value:'recovery', title:'Protect your fitness', detail:'Restore energy and reduce risk. Less growth this year.', tag:'Recovery' },
] as const
