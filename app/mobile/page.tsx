import type { Metadata } from 'next'
import MobileContent from '@/content/en/keywords/mobile.mdx'
import { keywordPages } from '@/data/keywordPages'
import { keywordMetadata as createMetadata } from '@/lib/seo'

const page = keywordPages.mobile
export const metadata: Metadata = createMetadata(page.title, page.description, page.path)

export default function MobilePage() { return <MobileContent /> }
