import Link from 'next/link'
import type { Pokemon } from '@/data/pokemon'
import type { Locale } from '@/lib/i18n'
import { site } from '@/lib/seo'
import { Breadcrumbs, FAQSchema, PokemonGlyph, TierBadge, TypePill } from './ui'

const copy = {
  en: { home: 'Home', pokemon: 'Pokémon', quick: 'Quick answer: use the build below as a practical starting point, then adjust one slot at a time for your team and current Regulation M-B legality.', best: 'Best', role: 'Role', item: 'Best item', moves: 'Best moveset', teammates: 'Best teammates', weak: 'Weak against', bestFor: 'Best for', legal: 'M-B legal', check: 'Check M-B legality', button: 'Try this build in Team Builder' },
  ja: { home: 'ホーム', pokemon: 'ポケモン', quick: '結論：まずは下記の構成を実戦的な出発点として使い、チーム全体と現在のレギュレーション M-B に合わせて1枠ずつ調整してください。', best: 'おすすめ', role: '役割', item: 'おすすめの持ち物', moves: 'おすすめの技構成', teammates: '相性の良い味方', weak: '苦手', bestFor: '向いている構成', legal: 'M-B 使用可', check: 'M-B 使用可否を確認', button: 'この構成をチームビルダーで試す' },
} satisfies Record<Locale, Record<string, string>>

export function PokemonGuideHero({ entry, eyebrow, title, role, item, teammates, weakAgainst, bestFor, locale = 'en' }: { entry: Pokemon; eyebrow: string; title: string; role: string; item: string; teammates: string; weakAgainst: string; bestFor: string; locale?: Locale }) {
  const labels = copy[locale]
  const teamBuilderHref = `/team-builder?team=${entry.slug}`
  return <>
    <Breadcrumbs items={[[labels.home, locale === 'ja' ? '/ja' : '/'], [labels.pokemon, locale === 'ja' ? '/ja/pokemon' : '/pokemon'], [entry.name]]} />
    <section className="featured-pokemon-hero"><div className="wrap featured-hero-grid">
      <div className="featured-pokemon-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{labels.quick}</p><div className="quick-facts"><TierBadge tier={entry.tier} />{entry.types.map((type) => <TypePill key={type} type={type} locale={locale} />)}<span className="type">{entry.regulationLegal ? labels.legal : labels.check}</span></div></div>
      <div className="featured-build-card"><div className="featured-glyph"><PokemonGlyph pokemon={entry} large /></div><span className="eyebrow blue">{labels.best} {entry.name} Build</span><dl><div><dt>{labels.role}</dt><dd>{role}</dd></div><div><dt>{labels.item}</dt><dd>{item}</dd></div><div><dt>{labels.moves}</dt><dd>{entry.recommendedMoves.join(' / ')}</dd></div><div><dt>{labels.teammates}</dt><dd>{teammates}</dd></div><div><dt>{labels.weak}</dt><dd>{weakAgainst}</dd></div><div><dt>{labels.bestFor}</dt><dd>{bestFor}</dd></div></dl><Link className="btn blue" href={teamBuilderHref}>{labels.button}</Link></div>
    </div></section>
  </>
}

export function PokemonGuideSchemas({ entry, faq, headline, description, locale = 'en' }: { entry: Pokemon; faq: { q: string; a: string }[]; headline: string; description: string; locale?: Locale }) {
  const prefix = locale === 'ja' ? '/ja' : ''
  return <><FAQSchema items={faq} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline, description, inLanguage: locale, dateModified: '2026-06-23', mainEntityOfPage: `${site.url}${prefix}/pokemon/${entry.slug}`, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name } }) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: copy[locale].home, item: `${site.url}${prefix || '/'}` }, { '@type': 'ListItem', position: 2, name: 'Pokémon Database', item: `${site.url}${prefix}/pokemon` }, { '@type': 'ListItem', position: 3, name: entry.name, item: `${site.url}${prefix}/pokemon/${entry.slug}` }] }) }} /></>
}
