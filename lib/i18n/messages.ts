import type { Locale } from './config'
import dictionary from './messages.json'
export type Translations=Record<Exclude<Locale,'en'>,string>
export const messages:Record<string,Translations>=dictionary
