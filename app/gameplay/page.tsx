import type { Metadata } from 'next'
import GameplayContent from '@/content/en/keywords/gameplay.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.gameplay
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function GameplayPage() { return <GameplayContent /> }
