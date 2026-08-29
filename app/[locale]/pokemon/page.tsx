import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PokemonListContent from '@/content/ja/pokemon-list.mdx'

export const metadata: Metadata = {
  title: { absolute: 'Pokémon Champions ポケモン一覧・育成論 | Wiki' },
  description: 'Pokémon Champions の全80匹をタイプ、ティア、役割、初心者向け、レギュレーション M-B の使用可否で検索できる日本語ポケモン図鑑です。',
  alternates: { canonical: 'https://www.pokemonchampions.pro/ja/pokemon', languages: { en: 'https://www.pokemonchampions.pro/pokemon', ja: 'https://www.pokemonchampions.pro/ja/pokemon' } },
}

export function generateStaticParams() { return [{ locale: 'ja' }] }

export default async function JapanesePokemonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'ja') notFound()
  return <PokemonListContent />
}
