import type { Metadata } from 'next'

export const site = {
  name: 'ChampionsDex',
  url: 'https://www.pokemonchampions.pro',
  description: 'Explore the Pokémon Champions guide with active codes, tier list, best teams, Pokémon builds, Regulation Set M-B tips, and a free team builder.',
}

export const socialImage = {
  url: `${site.url}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: 'ChampionsDex – Pokémon Champions codes, teams, tier list and database',
}

export function metadata(title: string, description: string, path = ''): Metadata {
  const url = new URL(path || '/', site.url).toString()
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: 'website', locale: 'en_US', images: [socialImage] },
    twitter: { card: 'summary_large_image', title, description, images: [socialImage.url] },
  }
}
