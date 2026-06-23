import Link from 'next/link'
import type { Metadata } from 'next'
import { pokemon, type Tier } from '@/data/pokemon'
import { FAQ, FAQSchema, PageHero, PokemonGlyph, SectionHeading, TierBadge, TypePill } from '@/components/ui'
import { metadata as createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata('Pokémon Champions Tier List – Best Pokémon for Ranked Battles','Explore the Regulation M-B Pokémon Champions tier list with top attackers, supports, Mega Pokémon, beginner picks, methodology, counters, and team links.','/tier-list')
const tiers: Tier[] = ['S','A','B','C']
const faq = [
  { q:'What does S Tier mean?', a:'S Tier marks the most flexible and consistently valuable editorial picks for Regulation Set M-B.' },
  { q:'Is this based on official usage data?', a:'No. The ranking is editorial and uses M-B legality, role value, flexibility, beginner friendliness, and public competitive trends.' },
  { q:'Should I only use S Tier Pokémon?', a:'No. Team synergy, player comfort, and matchup knowledge matter more than stacking six individually strong picks.' },
  { q:'How often is the tier list updated?', a:'We review it after regulation changes, material roster updates, and meaningful shifts in common team structures.' },
]

export default function TierPage() {
  return <>
    <PageHero eyebrow="Last updated June 23, 2026" title="Pokémon Champions Tier List" description="A role-aware Regulation Set M-B ranking for attackers, supports, Mega Pokémon, specialists, and beginner-friendly picks." />
    <div className="wrap"><div className="status-note" style={{ marginTop: 28 }}><span className="dot" /><p><strong>Data status:</strong> This tier list is an editorial ranking based on current Regulation Set M-B rules, available Pokémon, team flexibility, beginner friendliness, and public competitive trends. It is not official usage data. <Link href="/regulation-set-m-b">Read the M-B rules →</Link></p></div></div>

    <section className="section white"><div className="wrap featured-seo-link"><div><span className="eyebrow blue">Featured S-Tier Build</span><h2>Why Metagross is a priority ranked pick</h2><p>Metagross combines physical bulk, Steel coverage, Clear Body, and Bullet Punch priority. The dedicated page explains its Assault Vest set, exact move roles, best partners, and counterplay.</p></div><Link className="btn blue" href="/pokemon/metagross">Read the full Metagross build guide</Link></div></section>

    <section className="section"><div className="wrap">
      <SectionHeading eyebrow="Ranking Methodology" title="How the tier list is built" description="We compare role compression, type coverage, ability value, move options, team flexibility, beginner difficulty, counterplay, and Regulation M-B fit." />
      {tiers.map((tier) => <div key={tier} style={{ marginBottom: 45 }}>
        <SectionHeading title={`${tier} Tier`} description={tier === 'S' ? 'Highly flexible Pokémon that fit many teams.' : tier === 'A' ? 'Strong picks that reward the right team support.' : tier === 'B' ? 'Useful specialists with clearer trade-offs.' : 'Niche picks that need a deliberate plan.'} />
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Pokémon</th><th>Types</th><th>Role</th><th>Why it ranks here</th><th>Beginner</th><th>M-B</th></tr></thead><tbody>{pokemon.filter((entry) => entry.tier === tier).map((entry) => <tr key={entry.slug}><td><Link href={`/pokemon/${entry.slug}`} style={{ display:'flex', alignItems:'center', gap:10, fontWeight:800 }}><PokemonGlyph pokemon={entry} />{entry.name} <TierBadge tier={entry.tier} /></Link></td><td><div className="pill-row">{entry.types.map((type) => <TypePill key={type} type={type} />)}</div></td><td>{entry.roles.join(', ')}</td><td>{entry.description}</td><td>{entry.beginnerFriendly ? 'Yes' : 'Learning curve'}</td><td>{entry.regulationLegal ? 'Legal' : 'Check'}</td></tr>)}</tbody></table></div>
      </div>)}
    </div></section>

    <section className="section white"><div className="wrap"><SectionHeading eyebrow="Role Leaders" title="Best Pokémon by role" /><div className="card-grid">{[[pokemon[0],'Best attacker'],[pokemon[3],'Best support'],[pokemon[1],'Best Mega'],[pokemon[2],'Best beginner pick']].map(([value,label]) => { const entry = value as typeof pokemon[number]; return <Link href={`/pokemon/${entry.slug}`} className="content-card" key={String(label)}><span className="eyebrow blue">{String(label)}</span><PokemonGlyph pokemon={entry} /><h3 style={{ marginTop:14 }}>{entry.name}</h3><p>{entry.description}</p></Link> })}</div><div className="button-row" style={{ justifyContent:'center' }}><Link className="btn blue" href="/team-builder">Test picks in Team Builder</Link><Link className="btn secondary" href="/best-teams">View Best Teams</Link><Link className="btn secondary" href="/pokemon">Browse all 80</Link></div></div></section>
    <section className="section tint"><div className="wrap narrow"><SectionHeading eyebrow="Ranking FAQ" title="How to read this list" /><FAQ items={faq} /></div></section>
    <FAQSchema items={faq} />
  </>
}
