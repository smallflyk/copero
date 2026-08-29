import type { Metadata } from 'next'
import PokemonListContent from '@/content/en/keywords/pokemon-list.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.pokemonList
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function PokemonPage() { return <PokemonListContent /> }
