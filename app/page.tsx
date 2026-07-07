import Link from 'next/link'
import { codesLastChecked } from '@/data/codes'
import { pokemon } from '@/data/pokemon'
import { teams } from '@/data/teams'
import { FAQ, FAQSchema, PokemonCard, PokemonGlyph, SectionHeading } from '@/components/ui'

const homeFaq = [
  { q: 'What is Pokémon Champions?', a: 'Pokémon Champions is a battle-focused Pokémon game centered on building teams and playing accessible competitive battles. ChampionsDex explains Pokémon Champions systems in plain English for beginners and returning players.' },
  { q: 'Are there active Pokémon Champions codes?', a: 'No active Pokémon Champions Mystery Gift codes are confirmed as of our latest check. The codes page only publishes verified distributions and never pads its list with placeholders.' },
  { q: 'What is Regulation Set M-B?', a: 'Regulation Set M-B is the current ranked rules window that began on June 17, 2026. It defines team eligibility and battle settings while adding new options such as Mega Raichu X and Mega Raichu Y.' },
  { q: 'How do I build a balanced Pokémon Champions team?', a: 'Start with two reliable damage dealers, at least one support, speed control, defensive switches, and varied types. The Team Builder checks these basics and flags common conflicts.' },
  { q: 'Is PokémonChampions.pro official?', a: 'No. PokémonChampions.pro is an independent fan-made guide and is not affiliated with Nintendo, The Pokémon Company, Game Freak, or any official Pokémon brand.' },
]

export default function Home() {
  const top = pokemon.filter((entry) => entry.tier === 'S').slice(0, 4)
  return <>
    <section className="home-hero"><div className="wrap hero-grid">
      <div className="hero-copy">
        <span className="hero-kicker">The beginner-friendly battle guide</span>
        <h1>Pokémon Champions Guide: <span>Codes, Tier List, Best Teams & Team Builder</span></h1>
        <p>Use this Pokémon Champions guide to find verified codes, Regulation M-B teams, Pokémon builds, tier rankings, and a free team builder for planning better battle teams.</p>
        <div className="button-row hero-actions">
          <Link className="btn primary" href="/codes">View active codes</Link>
          <Link className="btn secondary" href="/tier-list">See the tier list</Link>
          <Link className="btn secondary" href="/best-teams">Browse best teams</Link>
          <Link className="btn blue" href="/team-builder">＋ Build your team</Link>
        </div>
        <div className="trust-row"><span>Fan-made & independent</span><span>Beginner focused</span><span>Updated for M-B</span></div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="battle-ring" /><div className="float-card one">M-B Live <small>Current regulation</small></div><div className="float-card two">80 Guides <small>Pokémon builds</small></div><div className="float-card three">6 / 6 <small>Analyze a team</small></div><i className="spark s1">✦</i><i className="spark s2">✦</i></div>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Verified Code Tracker" title="Pokémon Champions codes without the guesswork." description="We check Pokémon Champions announcements and reliable distribution reports, record the last review date, and remove unverified claims instead of filling the page with fake rewards." action={<Link className="text-link" href="/codes">Open the codes guide →</Link>} />
      <div className="content-card no-code-card"><div><span className="status"><strong>Last checked: {codesLastChecked}</strong></span><h3 style={{ marginTop: 12 }}>No active Pokémon Champions codes are currently confirmed.</h3><p>The codes guide still explains redemption, common errors, likely release windows, and the official Mystery Gift reward archive.</p></div><Link className="btn secondary" href="/codes">Check code status</Link></div>
    </div></section>

    <section className="section regulation-home"><div className="wrap two-col">
      <div><span className="eyebrow">Current Ranked Format</span><h2>Regulation Set M-B, explained for beginners.</h2><p>Regulation Set M-B began on June 17, 2026 and is scheduled to shape the next ranked window. It keeps familiar team-building fundamentals while expanding the choices available to players, including Mega Raichu X and Mega Raichu Y.</p><p>Our dedicated guide separates confirmed battle settings from editorial meta advice. You can review team size, level normalization, timers, Mega Evolution planning, beginner leads, common mistakes, and the Pokémon we currently recommend testing.</p><div className="button-row"><Link className="btn primary" href="/regulation-set-m-b">Read the Set M-B guide</Link><Link className="btn secondary" href="/team-builder">Check team legality</Link></div></div>
      <div className="content-card regulation-summary"><span className="eyebrow blue">M-B Quick View</span><div className="stat-list"><div className="stat-row"><span>Started</span><strong>June 17, 2026</strong></div><div className="stat-row"><span>Singles</span><strong>Choose 3 from 3–6</strong></div><div className="stat-row"><span>Doubles</span><strong>Choose 4 from 4–6</strong></div><div className="stat-row"><span>Battle level</span><strong>Set to Level 50</strong></div><div className="stat-row"><span>Team preview</span><strong>90 seconds</strong></div></div><p className="mini-disclaimer">Always confirm legality in the current in-game regulation notice before entering ranked battles.</p></div>
    </div></section>

    <section className="section tint"><div className="wrap">
      <SectionHeading eyebrow="Editorial Tier List" title="Understand the strongest picks—and why they work." description="The Pokémon Champions tier list weighs role value, team flexibility, type coverage, beginner friendliness, and Regulation Set M-B fit. It is a practical starting point, not a replacement for matchup practice." action={<Link className="text-link" href="/tier-list">View every tier →</Link>} />
      <div className="card-grid">{top.map((entry) => <PokemonCard key={entry.slug} entry={entry} />)}</div>
      <p className="section-copy">S Tier does not mean that every Pokémon Champions team should use the same six Pokémon. A strong ranked squad still needs compatible speed plans, safe defensive switches, useful support moves, and answers to common attackers. Read each Pokémon guide before copying a set so you understand what its item and moves are meant to accomplish.</p>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Ready-to-Learn Teams" title="Start with a clear game plan." description="Our Pokémon Champions team examples explain leads, win conditions, strengths, weaknesses, and beginner decisions instead of presenting six names without context." action={<Link className="text-link" href="/best-teams">Explore best teams →</Link>} />
      <div className="team-grid">{teams.slice(0, 2).map((team) => <article className="team-card" key={team.slug}><header><div><span className="eyebrow blue">{team.eyebrow}</span><h3>{team.name}</h3></div><span className="difficulty">{team.difficulty}</span></header><div className="mini-team">{team.pokemon.map((slug) => { const entry = pokemon.find((item) => item.slug === slug)!; return <Link className="mini-mon" href={`/pokemon/${slug}`} key={slug}><PokemonGlyph pokemon={entry} /><label>{entry.name}</label></Link> })}</div><p className="strategy">{team.strategy}</p></article>)}</div>
      <p className="section-copy">A beginner Pokémon Champions team should give you repeatable opening turns without locking you into one script. Learn two leads, identify the opposing Pokémon that stop your main attacker, and preserve the support Pokémon that help you control speed or reduce damage. When a loss exposes a problem, change one slot at a time and test again.</p>
    </div></section>

    <section className="section tint"><div className="wrap">
      <SectionHeading eyebrow="Pokémon Build Database" title="Turn a Pokémon name into a battle plan." description="Browse 80 Pokémon Champions build guides with roles, types, recommended moves, items, abilities, teammates, counters, beginner tips, and Set M-B notes." action={<Link className="text-link" href="/pokemon">Browse the Pokémon database →</Link>} />
      <div className="card-grid">{pokemon.slice(5, 9).map((entry) => <PokemonCard key={entry.slug} entry={entry} compact />)}</div>
      <p className="section-copy">The database is deliberately guide-first. Filters help you narrow the roster by type, tier, role, beginner friendliness, and Regulation Set M-B legality. Every card opens a dedicated page that explains how the recommended build fits into a team, what can counter it, and which partners cover its most important weaknesses.</p>
    </div></section>

    <section className="section white"><div className="wrap"><SectionHeading eyebrow="Featured Pokémon Guides" title="Start with the builds Google users are searching for." description="These three in-depth pages answer a focused build, team, moveset, or weakness question immediately, then explain the decisions behind the recommendation."/><div className="three-col featured-link-grid"><Link className="content-card" href="/pokemon/metagross"><span className="eyebrow blue">Priority Guide</span><h3>Metagross Build</h3><p>Best moveset, Assault Vest set, teammates, counters, strengths, weaknesses, and beginner advice.</p><span className="text-link">Read Metagross Build →</span></Link><Link className="content-card" href="/pokemon/mega-raichu-y"><span className="eyebrow blue">Team & Weakness</span><h3>Mega Raichu Y Team</h3><p>Complete six-Pokémon team, Ground and Dark counterplay, partners, moves, and ranked positioning.</p><span className="text-link">View Mega Raichu Y Team →</span></Link><Link className="content-card" href="/pokemon/tornadus"><span className="eyebrow blue">Speed Control</span><h3>Tornadus Guide</h3><p>Tailwind build, Covert Cloak, teammates, Electric and Ice weaknesses, and legality guidance.</p><span className="text-link">Open Tornadus Guide →</span></Link></div></div></section>

    <section className="section builder-cta"><div className="wrap two-col"><div><span className="eyebrow">Free Team Analysis</span><h2>Build six. See the gaps before battle.</h2><p>The Pokémon Champions Team Builder checks attackers, supports, tanks, speed control, unique type coverage, shared weaknesses, duplicate types, beginner balance, weather conflicts, Trick Room conflicts, and Regulation Set M-B legality.</p><p>Your team stays in the browser. No login is required, and a shareable URL lets you send the same six Pokémon to a friend or reopen the lineup later.</p><div className="button-row"><Link className="btn blue" href="/team-builder">Open Team Builder →</Link><Link className="btn secondary" href="/best-teams">Compare sample teams</Link></div></div><div className="content-card"><span className="eyebrow blue">What the analyzer checks</span><ul className="feature-list"><li>Role and speed-control balance</li><li>Type coverage and common weaknesses</li><li>Regulation Set M-B legality</li><li>Weather and Trick Room conflicts</li><li>Beginner-friendly team score</li><li>Copyable and shareable team lists</li></ul></div></div></section>

    <section className="section white"><div className="wrap two-col"><div><span className="eyebrow">New Trainer Path</span><h2>Learn the battle, not just the rankings.</h2><p>Good team building starts with understanding the turn in front of you. The Beginner Guide explains targeting, switching, type matchups, speed control, support roles, and the mistakes that make otherwise strong Pokémon feel ineffective.</p><p>Use the <Link className="text-link" href="/download">Download Guide</Link> for safe platform information, then follow the beginner path before relying on advanced meta terms. A simple plan you understand is usually more useful than a complicated tournament list you cannot pilot.</p><div className="button-row"><Link className="btn primary" href="/beginner-guide">Start the Beginner Guide</Link><Link className="btn secondary" href="/download">Platform guide</Link></div></div><div className="info-grid" style={{ gridTemplateColumns: '1fr' }}>{['Learn the battle flow and common roles', 'Choose complementary Pokémon and a speed plan', 'Practice two leads and review one decision at a time'].map((item, index) => <div className="info-card" key={item}><span className="number">0{index + 1}</span><h3>{item}</h3></div>)}</div></div></section>

    <section className="section tint"><div className="wrap narrow"><SectionHeading eyebrow="Quick Answers" title="Pokémon Champions FAQ" /><FAQ items={homeFaq} /></div></section>
    <section className="section disclaimer-section"><div className="wrap"><p><strong>Unofficial fan guide:</strong> PokémonChampions.pro is an unofficial fan-made guide and is not affiliated with Nintendo, The Pokémon Company, Game Freak, or any official Pokémon brand.</p></div></section>
    <FAQSchema items={homeFaq} />
  </>
}
