import type { Metadata } from 'next'
import RegulationContent from '@/content/en/keywords/regulation-m-b.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.regulationMB
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function RegulationSetMBPage() { return <RegulationContent /> }
