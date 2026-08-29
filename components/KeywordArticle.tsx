import Link from 'next/link'
import type { ReactNode } from 'react'
import { PageHero } from '@/components/ui'
import { contentUpdatedAt, site } from '@/lib/seo'

type RelatedLink = {
  href: string
  label: string
}

export default function KeywordArticle({
  eyebrow,
  path,
  title,
  description,
  note,
  children,
  related = [],
}: {
  eyebrow: string
  path: string
  title: string
  description: string
  note?: ReactNode
  children: ReactNode
  related?: RelatedLink[]
}) {
  const url = new URL(path, site.url).toString()
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: title,
        description,
        inLanguage: 'en',
        datePublished: contentUpdatedAt,
        dateModified: contentUpdatedAt,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: { '@type': 'Organization', name: site.name },
        publisher: { '@type': 'Organization', name: site.name },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: title, item: url },
        ],
      },
    ],
  }

  return <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
    />
    <PageHero eyebrow={eyebrow} title={title} description={description} />
    {note && <div className="wrap"><div className="status-note" style={{ marginTop: 28 }}><span className="dot" /><p>{note}</p></div></div>}
    <section className="section"><article className="article wrap">{children}
      {related.length > 0 && <><h2>Related Pokémon Champions guides</h2><div className="link-chips">{related.map((item) => <Link className="link-chip" href={item.href} key={item.href}>{item.label}</Link>)}</div></>}
    </article></section>
  </>
}
