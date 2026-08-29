import type { Metadata } from 'next'
import ReplicaTeamsContent from '@/content/en/keywords/replica-teams.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.replicaTeams
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function ReplicaTeamsPage() { return <ReplicaTeamsContent /> }
