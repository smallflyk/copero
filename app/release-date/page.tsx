import type { Metadata } from 'next'
import ReleaseDateContent from '@/content/en/keywords/release-date.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.releaseDate
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function ReleaseDatePage() { return <ReleaseDateContent /> }
