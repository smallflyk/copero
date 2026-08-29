import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Pokemon, Tier } from '@/data/pokemon'
import type { Locale } from '@/lib/i18n'

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: ReactNode }) {
  return <section className="page-hero"><div className="wrap narrow">
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p>{children}
  </div></section>
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>
}

export function TierBadge({ tier }: { tier: Tier }) { return <span className={`tier tier-${tier.toLowerCase()}`}>{tier}</span> }

const japaneseTypes: Record<string, string> = { Bug: 'むし', Dark: 'あく', Dragon: 'ドラゴン', Electric: 'でんき', Fairy: 'フェアリー', Fighting: 'かくとう', Fire: 'ほのお', Flying: 'ひこう', Ghost: 'ゴースト', Grass: 'くさ', Ground: 'じめん', Ice: 'こおり', Normal: 'ノーマル', Poison: 'どく', Psychic: 'エスパー', Rock: 'いわ', Steel: 'はがね', Water: 'みず' }
const japaneseRoles: Record<string, string> = { Attacker: 'アタッカー', Disruption: '妨害', Priority: '先制技', 'Special Attacker': '特殊アタッカー', 'Speed Control': '素早さ操作', Support: 'サポート', Tank: '耐久', 'Trick Room': 'トリックルーム', Weather: '天候' }

export function TypePill({ type, locale = 'en' }: { type: string; locale?: Locale }) { return <span className={`type type-${type.toLowerCase().replace(' ', '-')}`}>{locale === 'ja' ? japaneseTypes[type] || type : type}</span> }

const glyphs: Record<string, string> = { Electric: 'ϟ', Fighting: '✦', Psychic: '◉', Steel: '◆', Fire: '♨', Dark: '◐', Grass: '♧', Poison: '◌', Dragon: '◇', Ground: '▰', Flying: '⌁', Water: '≈', Fairy: '✧', Rock: '⬟', Normal: '●', Ghost: '◒' }

export function PokemonGlyph({ pokemon, large = false }: { pokemon: Pokemon; large?: boolean }) {
  return <div className={`poke-glyph ${large ? 'large' : ''}`} data-type={pokemon.types[0]} aria-hidden="true"><span>{glyphs[pokemon.types[0]] || '✦'}</span><small>{pokemon.name.split(' ').map((x) => x[0]).join('').slice(0, 2)}</small></div>
}

export function PokemonCard({ entry, compact = false, locale = 'en' }: { entry: Pokemon; compact?: boolean; locale?: Locale }) {
  const japanese = locale === 'ja'
  const detailHref = japanese && entry.slug === 'metagross' ? '/ja/pokemon/metagross' : `/pokemon/${entry.slug}`
  const linkLabel = japanese
    ? entry.slug === 'metagross' ? 'メタグロスの育成論と技構成' : entry.slug === 'mega-raichu-y' ? 'メガライチュウYのチームと弱点' : entry.slug === 'tornadus' ? 'トルネロスの育成論とチーム' : '育成論を見る'
    : entry.slug === 'metagross' ? 'Metagross Build & Moveset' : entry.slug === 'mega-raichu-y' ? 'Mega Raichu Y Team & Weakness' : entry.slug === 'tornadus' ? 'Tornadus Build & Team' : 'View full build'
  return <Link className={`pokemon-card ${compact ? 'compact' : ''}`} href={detailHref}>
    <div className="card-top"><PokemonGlyph pokemon={entry} /><TierBadge tier={entry.tier} /></div>
    <h3>{entry.name}</h3><div className="pill-row">{entry.types.map((x) => <TypePill key={x} type={x} locale={locale} />)}</div>
    {!compact && <><p>{entry.roles.map((role) => japanese ? japaneseRoles[role] || role : role).join(' · ')}</p><div className="card-meta"><span>{entry.beginnerFriendly ? (japanese ? '初心者向け' : 'Beginner friendly') : (japanese ? '要練習' : 'Practice first')}</span><span>{entry.regulationLegal ? (japanese ? 'M-B 使用可' : 'M-B legal') : (japanese ? '使用可否を確認' : 'Check legality')}</span></div><small className="item-line">{japanese ? '持ち物' : 'Item'}: {entry.recommendedItem}</small><span className="card-link">{linkLabel} <b>→</b></span></>}
  </Link>
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return <div className="faq-list">{items.map(({ q, a }) => <details key={q}><summary>{q}<span>＋</span></summary><p>{a}</p></details>)}</div>
}

export function FAQSchema({ items }: { items: { q: string; a: string }[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }) }} />
}

export function Breadcrumbs({ items }: { items: [string, string?][] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map(([label, href], i) => <span key={label}>{i > 0 && <b>›</b>}{href ? <Link href={href}>{label}</Link> : label}</span>)}</nav>
}
