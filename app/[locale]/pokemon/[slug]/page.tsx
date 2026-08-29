import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JapaneseMetagrossContent from '@/content/ja/pokemon/metagross.mdx'

export const metadata: Metadata = {
  title: { absolute: 'Pokémon Champions メタグロス育成論・技・持ち物 | Wiki' },
  description: 'Pokémon Champions のメタグロス育成論。おすすめの技構成、Assault Vest、味方、対策、弱点、初心者向けの使い方を日本語で解説します。',
  alternates: { canonical: 'https://www.pokemonchampions.pro/ja/pokemon/metagross', languages: { en: 'https://www.pokemonchampions.pro/pokemon/metagross', ja: 'https://www.pokemonchampions.pro/ja/pokemon/metagross' } },
}

export function generateStaticParams() { return [{ locale: 'ja', slug: 'metagross' }] }

export default async function JapanesePokemonDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (locale !== 'ja' || slug !== 'metagross') notFound()
  return <JapaneseMetagrossContent />
}
