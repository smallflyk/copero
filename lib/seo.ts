import type { Metadata } from 'next'

export const site = {
  name: 'Pokémon Champions Wiki',
  url: 'https://www.pokemonchampions.pro',
  description: 'Explore Pokémon Champions codes, beginner guides, Regulation M-B rules, team ideas, Pokémon lists, release platforms, and cross-platform battle tips.',
}

export const contentUpdatedAt = '2026-08-29T00:00:00.000Z'

export const socialImage = {
  url: `${site.url}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: 'Pokémon Champions Wiki – codes, teams, tier list and guides',
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

export function keywordMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, site.url).toString()

  return {
    ...metadata(title, description, path),
    title: { absolute: title },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: 'article',
      locale: 'en_US',
      publishedTime: contentUpdatedAt,
      modifiedTime: contentUpdatedAt,
      images: [socialImage],
    },
  }
}
