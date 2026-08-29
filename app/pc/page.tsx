import type { Metadata } from 'next'
import PcContent from '@/content/en/keywords/pc.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.pc
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function PcPage() { return <PcContent /> }
