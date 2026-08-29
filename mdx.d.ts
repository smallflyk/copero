declare module '*.mdx' {
  import type { ComponentType } from 'react'

  const MDXContent: ComponentType<Record<string, unknown>>
  export default MDXContent

  export const homeHero: {
    eyebrow: string
    title: string
    highlight: string
    description: string
    stats: string[]
    primary: string
    secondary: string
    tertiary: string
    videoLabel: string
  }
  export const startCards: { number: string; title: string; description: string }[]
  export const homeFaq: { q: string; a: string }[]
  export const metagrossFaq: { q: string; a: string }[]
  export const metagrossDescription: string
}
