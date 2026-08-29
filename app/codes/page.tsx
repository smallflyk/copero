import type { Metadata } from 'next'
import CodesContent from '@/content/en/keywords/codes.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.codes
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function CodesPage() { return <CodesContent /> }
