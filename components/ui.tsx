import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Pokemon, Tier } from '@/data/pokemon'

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: ReactNode }) {
  return <section className="page-hero"><div className="wrap narrow">
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p>{children}
  </div></section>
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>
}

export function TierBadge({ tier }: { tier: Tier }) { return <span className={`tier tier-${tier.toLowerCase()}`}>{tier}</span> }

export function TypePill({ type }: { type: string }) { return <span className={`type type-${type.toLowerCase().replace(' ', '-')}`}>{type}</span> }

const glyphs: Record<string, string> = { Electric: 'ϟ', Fighting: '✦', Psychic: '◉', Steel: '◆', Fire: '♨', Dark: '◐', Grass: '♧', Poison: '◌', Dragon: '◇', Ground: '▰', Flying: '⌁', Water: '≈', Fairy: '✧', Rock: '⬟', Normal: '●', Ghost: '◒' }

export function PokemonGlyph({ pokemon, large = false }: { pokemon: Pokemon; large?: boolean }) {
  return <div className={`poke-glyph ${large ? 'large' : ''}`} data-type={pokemon.types[0]} aria-hidden="true"><span>{glyphs[pokemon.types[0]] || '✦'}</span><small>{pokemon.name.split(' ').map((x) => x[0]).join('').slice(0, 2)}</small></div>
}

export function PokemonCard({ entry, compact = false }: { entry: Pokemon; compact?: boolean }) {
  return <Link className={`pokemon-card ${compact ? 'compact' : ''}`} href={`/pokemon/${entry.slug}`}>
    <div className="card-top"><PokemonGlyph pokemon={entry} /><TierBadge tier={entry.tier} /></div>
    <h3>{entry.name}</h3><div className="pill-row">{entry.types.map((x) => <TypePill key={x} type={x} />)}</div>
    {!compact && <><p>{entry.roles.join(' · ')}</p><span className="card-link">View battle guide <b>→</b></span></>}
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
