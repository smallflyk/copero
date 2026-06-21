import type { Metadata } from 'next'

export const site = {
  name: 'ChampionsDex',
  url: 'https://championsdex.guide',
  description: 'An unofficial Pokémon Champions guide for codes, teams, rankings, and battle tools.',
}

export function metadata(title: string, description: string, path = ''): Metadata {
  const url = `${site.url}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}
