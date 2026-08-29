import type { Metadata } from 'next'
import TierListContent from '@/content/en/keywords/tier-list.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.tierList
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function TierListPage() { return <TierListContent /> }
