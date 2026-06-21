import Link from 'next/link'
import { codes } from '@/data/codes'
import { pokemon } from '@/data/pokemon'
import { teams } from '@/data/teams'
import { FAQ, FAQSchema, PokemonCard, PokemonGlyph, SectionHeading, TierBadge } from '@/components/ui'

const homeFaq = [
  { q: 'What is Pokémon Champions?', a: 'Pokémon Champions is a battle-focused Pokémon title built around accessible team battles. This fan guide will track confirmed formats, platforms, and features as official information becomes available.' },
  { q: 'Are there active Pokémon Champions codes?', a: 'No official Mystery Gift codes are confirmed in our current data. The codes page is ready to track verified releases without publishing guesses.' },
  { q: 'How often is the tier list updated?', a: 'The list is manually reviewed when confirmed rules, available Pokémon, or meaningful balance information changes.' },
  { q: 'Is ChampionsDex official?', a: 'No. ChampionsDex is an independent, fan-made guide and is not affiliated with Nintendo, The Pokémon Company, or Game Freak.' },
]

export default function Home() {
  const top = pokemon.filter((p) => p.tier === 'S').slice(0, 4)
  return <>
    <section className="home-hero"><div className="wrap hero-grid">
      <div className="hero-copy"><span className="hero-kicker">Your competitive edge starts here</span><h1>Master every battle.<br /><span>Become a Champion.</span></h1><p>The complete unofficial field guide for Pokémon Champions — verified codes, clear tier rankings, battle-ready teams, and tools that help you play smarter.</p>
        <div className="button-row"><Link className="btn primary" href="/tier-list">Explore the tier list <b>→</b></Link><Link className="btn secondary" href="/team-builder">＋ Build your team</Link></div>
        <div className="trust-row"><span>Fan-made & independent</span><span>Built for beginners</span><span>Always free</span></div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="battle-ring" /><div className="float-card one">S Tier <small>Top battle picks</small></div><div className="float-card two">20 Pokémon <small>Launch database</small></div><div className="float-card three">6 / 6 <small>Team ready</small></div><i className="spark s1">✦</i><i className="spark s2">✦</i></div>
    </div></section>

    <section className="section white"><div className="wrap"><SectionHeading eyebrow="Mystery Gift Codes" title="Claim every reward." description="We track confirmed codes and their expiry dates, so you never have to test a fake one." action={<Link className="text-link" href="/codes">View all codes →</Link>} />
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Code</th><th>Reward</th><th>Expires</th><th>Status</th></tr></thead><tbody>{codes.slice(0,2).map((item) => <tr key={item.code}><td><span className="code-text">{item.code}</span></td><td>{item.reward}</td><td>{item.expiryDate || 'TBA'}</td><td><span className={`status ${item.status}`}>{item.status === 'active' ? 'Tracking' : 'Example'}</span></td></tr>)}</tbody></table></div>
    </div></section>

    <section className="section tint"><div className="wrap"><SectionHeading eyebrow="Current Meta" title="The strongest picks, at a glance." description="Manual early rankings based on role value, flexibility, and doubles fundamentals. Confirmed game data will replace provisional assumptions." action={<Link className="text-link" href="/tier-list">Full tier list →</Link>} />
      <div className="card-grid">{top.map((entry) => <PokemonCard key={entry.slug} entry={entry} />)}</div>
    </div></section>

    <section className="section white"><div className="wrap"><SectionHeading eyebrow="Battle Ready" title="Pick a game plan. Make it yours." description="Four approachable team shells for learning how roles fit together." action={<Link className="text-link" href="/best-teams">See all teams →</Link>} />
      <div className="team-grid">{teams.slice(0,2).map((team) => <article className="team-card" key={team.slug}><header><div><span className="eyebrow blue">{team.eyebrow}</span><h3>{team.name}</h3></div><span className="difficulty">{team.difficulty}</span></header><div className="mini-team">{team.pokemon.map((slug) => { const p = pokemon.find((x) => x.slug === slug)!; return <Link className="mini-mon" href={`/pokemon/${slug}`} key={slug}><PokemonGlyph pokemon={p} /><label>{p.name}</label></Link> })}</div><p className="strategy">{team.strategy}</p></article>)}</div>
    </div></section>

    <section className="section tint"><div className="wrap"><SectionHeading eyebrow="Pokémon Database" title="Know your roster." description="Search battle roles, recommended items, moves, teammates, and counters." action={<Link className="text-link" href="/pokemon">Browse all Pokémon →</Link>} /><div className="card-grid">{pokemon.slice(6,10).map((entry) => <PokemonCard key={entry.slug} entry={entry} compact />)}</div></div></section>

    <section className="section white"><div className="wrap two-col"><div><span className="eyebrow">New Trainer Path</span><h2>Ready in three simple steps.</h2><p>Skip the jargon. Learn the few decisions that matter most, then build confidence one battle at a time.</p><div className="button-row"><Link className="btn blue" href="/beginner-guide">Start the beginner guide →</Link></div></div><div className="info-grid" style={{gridTemplateColumns:'1fr'}}>{['Learn the battle flow','Choose complementary roles','Practice a simple lead'].map((x,i)=><div className="info-card" key={x}><span className="number">0{i+1}</span><h3>{x}</h3></div>)}</div></div></section>

    <section className="section tint"><div className="wrap narrow"><SectionHeading eyebrow="Quick Answers" title="Frequently asked questions" /><FAQ items={homeFaq} /></div></section><FAQSchema items={homeFaq} />
  </>
}
