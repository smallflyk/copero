import Link from 'next/link'
import type { Metadata } from 'next'
import { pokemon, getPokemon } from '@/data/pokemon'
import { teams } from '@/data/teams'
import { regulationMB } from '@/data/regulations'
import { Breadcrumbs, FAQ, FAQSchema, PokemonCard, PokemonGlyph, SectionHeading } from '@/components/ui'
import { metadata as createMetadata, site } from '@/lib/seo'

export const metadata: Metadata = createMetadata(
  'Pokémon Champions Regulation Set M-B Guide – Rules, Best Teams & Meta Picks',
  'Understand Pokémon Champions Regulation Set M-B rules, legal Pokémon, top teams, current meta picks, Mega choices, and practical beginner battle tips.',
  '/regulation-set-m-b',
)

const faq = [
  { q: 'When does Pokémon Champions Regulation Set M-B start and end?', a: 'Regulation Set M-B runs from June 17, 2026 through September 2, 2026. Always confirm the exact closing time and season notice in your region inside the game.' },
  { q: 'How many Pokémon do I bring in Regulation Set M-B?', a: 'Singles teams register three to six Pokémon and choose three for battle. Doubles teams register four to six and choose four. Participating Pokémon are set to Level 50.' },
  { q: 'Are Mega Raichu X and Mega Raichu Y legal in Set M-B?', a: 'Both Mega Raichu forms are featured additions for the M-B window. Check their required Mega Stone and the current in-game legality screen before locking a team.' },
  { q: 'What is a good beginner team for Regulation Set M-B?', a: 'A balanced shell with Metagross, Rotom-Wash, Garchomp, Sylveon, Rillaboom, and Incineroar gives beginners clear roles, safe switches, Fake Out pressure, and broad type coverage.' },
  { q: 'Does this page use official usage statistics?', a: 'No. Rules and dates are separated from our editorial recommendations. Meta picks are based on flexibility, familiar doubles fundamentals, Regulation M-B eligibility, and beginner usefulness.' },
]

export default function RegulationSetMBPage() {
  const featured = regulationMB.featuredPokemon.map(getPokemon).filter(Boolean)
  const beginnerTeam = teams[0]
  return <>
    <Breadcrumbs items={[["Home", "/"], ["Regulation Guide", "/regulation-guide"], ["Regulation Set M-B"]]} />
    <section className="page-hero"><div className="wrap narrow"><span className="eyebrow">Current Ranked Regulation</span><h1>Pokémon Champions Regulation Set M-B Guide</h1><p>Learn the confirmed battle settings, useful meta picks, beginner team structure, Mega choices, and common mistakes for the current ranked format.</p><p><strong>Last updated:</strong> {regulationMB.lastUpdated}</p><div className="button-row" style={{ justifyContent: 'center' }}><Link className="btn primary" href="/team-builder">Build an M-B team</Link><Link className="btn secondary" href="/best-regulation-m-b-teams">View M-B teams</Link></div></div></section>

    <div className="wrap"><div className="status-note" style={{ marginTop: 28 }}><span className="dot" /><p><strong>Data status:</strong> Battle dates and settings are treated separately from editorial meta advice. Always use the current in-game regulation notice as the final legality check.</p></div></div>

    <section className="section"><article className="article wrap">
      <h2>What is Regulation Set M-B?</h2>
      <p>Regulation Set M-B is the second major Pokémon Champions ranked rules window. It began on June 17, 2026, alongside Season M-3 and the game’s broader mobile launch period, and is scheduled through September 2, 2026. A regulation is different from a ranked season: the season controls ladder progress and rewards, while the regulation controls which Pokémon and battle settings are available. That distinction matters because one regulation can cover more than one season.</p>
      <p>For a beginner, the practical answer is simple: M-B is the rulebook your team must pass before it can enter the current ladder. A Pokémon that exists in your collection is not automatically legal. The in-game team checker remains the source of truth, especially after maintenance or a mid-season notice. ChampionsDex uses an M-B legality flag to help you plan, but it should be treated as a fast warning rather than an official validator.</p>

      <h2>Regulation Set M-B rules</h2>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Rule</th><th>Regulation Set M-B setting</th><th>What it means</th></tr></thead><tbody>
        <tr><td>Active window</td><td>{regulationMB.startDate} – {regulationMB.endDate}</td><td>Recheck saved teams when the window changes.</td></tr>
        <tr><td>Singles team</td><td>{regulationMB.singlesTeam}</td><td>Preview the opposing roster, then commit three.</td></tr>
        <tr><td>Doubles team</td><td>{regulationMB.doublesTeam}</td><td>Preview six and bring the four that fit the matchup.</td></tr>
        <tr><td>Battle level</td><td>{regulationMB.battleLevel}</td><td>Plan stats and damage around Level 50.</td></tr>
        <tr><td>Your time</td><td>{regulationMB.playerTime}</td><td>Long indecision can lose a close game.</td></tr>
        <tr><td>Team preview</td><td>{regulationMB.previewTime}</td><td>Identify speed control, redirection, weather, and likely leads.</td></tr>
        <tr><td>Turn time</td><td>{regulationMB.turnTime}</td><td>Have a safe default play before the timer becomes urgent.</td></tr>
      </tbody></table></div>
      <p>Team preview is not just a waiting screen. In Doubles, use those ninety seconds to locate the opponent’s speed control, Fake Out user, redirector, weather setter, and most obvious damage dealer. Then choose a lead that makes progress without exposing your entire strategy. A flexible lead is often better for a beginner than the most explosive possible pairing because it leaves room to recover from an imperfect prediction.</p>

      <h2>What changed from Regulation Set M-A?</h2>
      <p>M-B expands the available decisions rather than replacing every familiar M-A principle. New Pokémon, Mega Evolutions, abilities, items, and move interactions create more possible leads and defensive combinations. Mega Raichu X and Mega Raichu Y are the clearest headline additions: one leans toward fast physical pressure while the other offers fast special pressure and disruption. Their presence makes Ground, Dark, priority, and speed-control planning more important.</p>
      <p>An expanded roster also makes old matchup notes less reliable. A six-Pokémon team that felt balanced in M-A can become overly weak to a newly common attacker or fail to pressure a new defensive core. Do not rebuild everything after one loss. First check legality, then identify repeated problems across several games, and finally adjust the smallest number of slots needed to solve them.</p>
    </article></section>

    <section className="section tint"><div className="wrap"><SectionHeading eyebrow="Editorial Meta Picks" title="Best Pokémon for Regulation Set M-B" description="These recommendations prioritize flexible roles and approachable team fit. They are not official usage rankings." /><div className="card-grid">{featured.slice(0, 8).map((entry) => <PokemonCard key={entry!.slug} entry={entry!} />)}</div><div className="section-copy"><p><strong>Metagross</strong> remains a dependable anchor because its Steel typing, natural bulk, priority option, and broad coverage make its job easy to understand. <strong>Incineroar</strong> compresses several support jobs through Intimidate, Fake Out, and pivoting. <strong>Amoonguss</strong> protects a partner through redirection and changes the pace with Spore. <strong>Garchomp</strong> supplies direct Ground pressure into Electric-heavy plans.</p><p>Kingambit and Sneasler reward more deliberate positioning. Kingambit offers strong late-game pressure but dislikes being forced into unfavorable Fighting matchups. Sneasler brings speed and immediate physical threat but needs defensive partners because it cannot absorb repeated attacks. The two Mega Raichu forms are easier to use when the rest of the team covers Ground attacks and opposing priority.</p></div></div></section>

    <section className="section white"><div className="wrap"><SectionHeading eyebrow="Beginner Team" title="A stable first Regulation M-B team" description="Use a balanced shell to learn switching, Fake Out, defensive coverage, and simple damage plans before moving to specialized weather or Trick Room teams." /><article className="team-card"><header><div><span className="eyebrow blue">{beginnerTeam.eyebrow}</span><h2 style={{ fontSize: '1.6rem' }}>{beginnerTeam.name}</h2></div><span className="difficulty">{beginnerTeam.difficulty}</span></header><div className="mini-team">{beginnerTeam.pokemon.map((slug) => { const entry = getPokemon(slug)!; return <Link className="mini-mon" href={`/pokemon/${slug}`} key={slug}><PokemonGlyph pokemon={entry} /><label>{entry.name}</label></Link> })}</div><p>{beginnerTeam.strategy}</p></article><div className="section-copy"><p>Start by learning Incineroar plus Rotom-Wash as a safe lead. Fake Out can create space while Rotom threatens damage or a burn, and both Pokémon can pivot into a better matchup. Metagross and Garchomp are the primary physical damage choices; Sylveon adds spread special damage; Rillaboom supplies priority and terrain support. You will not bring the same four every game, which is why preview practice matters.</p><p>When choosing four for Doubles, ask three questions. Which opposing Pokémon must be answered immediately? Which of your attackers has the easiest path to a knockout? Which support Pokémon keeps that attacker productive? Those questions create a clearer plan than selecting the four highest-tier members automatically.</p></div></div></section>

    <section className="section tint"><div className="wrap"><SectionHeading eyebrow="Team Styles" title="Best ranked approaches for M-B" /><div className="info-grid">
      <div className="info-card"><span className="number">01</span><h3>Balanced pivot</h3><p>Combine Fake Out, Intimidate, one bulky attacker, and one flexible speed-control option. This approach gives beginners more chances to correct a poor lead.</p></div>
      <div className="info-card"><span className="number">02</span><h3>Fast offense</h3><p>Use Tailwind or naturally fast Pokémon to create an early knockout. Preserve a priority move so the team can finish weakened targets after speed control ends.</p></div>
      <div className="info-card"><span className="number">03</span><h3>Trick Room</h3><p>Pair a reliable setter with slow attackers and redirection. Do not fill every slot with slow Pokémon; you still need a plan when Trick Room cannot be established.</p></div>
    </div><div className="button-row" style={{ justifyContent: 'center' }}><Link className="btn blue" href="/best-regulation-m-b-teams">Compare complete M-B teams</Link><Link className="btn secondary" href="/best-teams">Browse every team style</Link></div></div></section>

    <section className="section white"><article className="article wrap">
      <h2>Best Mega Pokémon for Regulation Set M-B</h2>
      <p>Your Mega choice should solve a team problem, not merely occupy the flashiest slot. Mega Raichu X offers immediate physical Electric and Fighting pressure with strong speed, making it useful when a team struggles to threaten bulky Steel or Water matchups. Mega Raichu Y attacks from the special side and brings Psychic coverage plus disruption, which can fit better when the rest of the squad is already physically focused.</p>
      <p>Build the supporting four or five slots before judging a Mega in isolation. Both Raichu forms appreciate partners that switch safely into Ground attacks. Intimidate and redirection help protect their modest defenses. A slower, bulkier team may prefer a Mega that supplies immediate speed, while a fast offense may need its Mega to break the defensive Pokémon that stop the rest of the core. See the <Link href="/best-mega-pokemon">Best Mega Pokémon guide</Link> for a role-by-role comparison.</p>

      <h2>Common Regulation Set M-B team-building mistakes</h2>
      <h3>Ignoring the bring-four decision</h3><p>A Doubles roster can look balanced as six and still produce awkward groups of four. Practice combinations that preserve a lead, a defensive switch, a damage dealer, and a late-game plan. If one Pokémon must appear in every matchup for the roster to function, the team may be too dependent on it.</p>
      <h3>Stacking one kind of speed control</h3><p>Tailwind, paralysis, Icy Wind-style drops, priority, and Trick Room answer different boards. A team with only Tailwind can struggle when the setter is denied. Include a secondary way to manage move order, even if it is simply a reliable priority attack.</p>
      <h3>Combining conflicting field plans</h3><p>Rain and sun setters can overwrite each other. Trick Room can make your own fast attackers move last. Terrain can interfere with sleep or priority assumptions. The upgraded Team Builder flags these conflicts, but the warning is an invitation to review the plan rather than an automatic demand to remove a Pokémon.</p>
      <h3>Trusting a tier letter more than the matchup</h3><p>Tier lists summarize general value; they do not play the battle. A B Tier specialist with the right coverage can be more valuable than a second S Tier attacker that duplicates the team’s weaknesses. Use rankings to discover options, then test them against the matchups you actually face.</p>

      <div className="faq-section"><h2>Regulation Set M-B FAQ</h2><FAQ items={faq} /></div>
      <h2>Related Pokémon Champions guides</h2><div className="link-chips"><Link className="link-chip" href="/tier-list">Tier List</Link><Link className="link-chip" href="/best-teams">Best Teams</Link><Link className="link-chip" href="/team-builder">Team Builder</Link><Link className="link-chip" href="/pokemon">Pokémon Database</Link><Link className="link-chip" href="/best-regulation-m-b-teams">M-B Team Builds</Link></div>
    </article></section>

    <FAQSchema items={faq} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: 'Pokémon Champions Regulation Set M-B Guide', dateModified: '2026-06-22', datePublished: '2026-06-17', mainEntityOfPage: `${site.url}/regulation-set-m-b`, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name } }) }} />
  </>
}
