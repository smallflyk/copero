import type { Metadata } from 'next'
import BestTeamsContent from '@/content/en/keywords/best-teams.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.bestTeams
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function BestTeamsPage() { return <BestTeamsContent /> }
