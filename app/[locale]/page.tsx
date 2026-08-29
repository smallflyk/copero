import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JapaneseHomeContent from '@/content/ja/home.mdx'

export const metadata: Metadata = {
  title: { absolute: 'Pokémon Champions 攻略・コード・チーム | Wiki' },
  description: 'Pokémon Champions の確認済みコード、初心者ガイド、ポケモン一覧、レギュレーション M-B、対応機種、クロスプラットフォーム情報を日本語で確認できます。',
  keywords: 'Pokémon Champions, コード, 攻略, ポケモン一覧, レギュレーション M-B',
  alternates: { canonical: 'https://www.pokemonchampions.pro/ja', languages: { en: 'https://www.pokemonchampions.pro/', ja: 'https://www.pokemonchampions.pro/ja' } },
}

export function generateStaticParams() { return [{ locale: 'ja' }] }

export default async function JapaneseHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'ja') notFound()
  return <JapaneseHomeContent />
}
