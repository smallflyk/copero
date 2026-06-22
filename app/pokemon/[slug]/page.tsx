import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPokemon, pokemon } from '@/data/pokemon'
import { teams } from '@/data/teams'
import { Breadcrumbs, FAQ, FAQSchema, PokemonCard, PokemonGlyph, SectionHeading, TierBadge, TypePill } from '@/components/ui'
import { site, socialImage } from '@/lib/seo'

export function generateStaticParams() { return pokemon.map((entry) => ({ slug: entry.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const entry = getPokemon(slug)
  if (!entry) return {}
  const title = `${entry.name} Pokémon Champions Guide – Best Build, Moveset & Teams`
  const description = `Master ${entry.name} in Pokémon Champions with its best build, moveset, item, teammates, counters, beginner advice, and Regulation Set M-B ranked tips.`
  const url = `${site.url}/pokemon/${entry.slug}`
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: site.name, type: 'article', locale: 'en_US', images: [socialImage] }, twitter: { card: 'summary_large_image', title, description, images: [socialImage.url] } }
}

export default async function PokemonDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = getPokemon(slug)
  if (!entry) notFound()

  const related = [...new Map([
    ...entry.teammates.map(getPokemon).filter(Boolean),
    ...pokemon.filter((candidate) => candidate.slug !== entry.slug && candidate.types.some((type) => entry.types.includes(type))),
  ].map((candidate) => [candidate!.slug, candidate!])).values()].slice(0, 4)
  const counters = entry.counters.map(getPokemon).filter(Boolean)
  const relevantTeams = teams.filter((team) => team.pokemon.includes(entry.slug))
  const primaryRole = entry.roles[0].toLowerCase()
  const faq = [
    { q: `Is ${entry.name} good in Pokémon Champions?`, a: `${entry.name} is an editorial ${entry.tier} Tier pick valued as a ${entry.roles.join(' and ').toLowerCase()}. Its usefulness depends on the matchup, supporting team, and current Regulation Set M-B legality.` },
    { q: `What is the best ${entry.name} build?`, a: `Our approachable build uses ${entry.recommendedItem} with ${entry.recommendedMoves.join(', ')}. Treat it as a starting point and adjust one move when your team needs different coverage or support.` },
    { q: `What item should ${entry.name} use?`, a: `${entry.recommendedItem} is the recommended item for this set because it supports ${entry.name}'s ${primaryRole} job. Confirm item availability and duplicate-item rules before entering ranked battles.` },
    { q: `What counters ${entry.name}?`, a: `${counters.length ? counters.map((counter) => counter!.name).join(' and ') : 'Strong super-effective attackers and well-timed disruption'} can pressure this build. Position around ${entry.weaknesses.join(' and ').toLowerCase()}.` },
    { q: `Is ${entry.name} good for beginners?`, a: entry.beginnerFriendly ? `Yes. ${entry.name} has a relatively clear battle role, though beginners should still practice its defensive switches and ideal lead partners.` : `It has a learning curve. Practice its timing, item interaction, and safe switches before making it the center of a ranked team.` },
  ]

  return <>
    <Breadcrumbs items={[["Home", "/"], ["Pokémon", "/pokemon"], [entry.name]]} />
    <section className="detail-hero"><div className="wrap detail-grid"><PokemonGlyph pokemon={entry} large /><div><span className="eyebrow">Regulation M-B Build Guide</span><h1>{entry.name} Pokémon Champions Guide</h1><div className="quick-facts"><TierBadge tier={entry.tier} />{entry.types.map((type) => <TypePill key={type} type={type} />)}<span className="type">{entry.roles.join(' · ')}</span><span className="type">{entry.difficulty}</span><span className={`type ${entry.regulationLegal ? 'legal-pill' : 'illegal-pill'}`}>{entry.regulationLegal ? 'M-B legal' : 'Not marked M-B legal'}</span></div><p>{entry.description}</p><div className="detail-nav"><Link className="btn blue small" href={`/team-builder?team=${entry.slug}`}>Use in Team Builder</Link><Link className="btn secondary small" href="/regulation-set-m-b">M-B rules</Link></div></div></div></section>

    <section className="section"><article className="article wrap">
      <h2>Is {entry.name} good in Pokémon Champions?</h2>
      <p>{entry.name} is an editorial <strong>{entry.tier} Tier</strong> Pokémon whose main jobs are {entry.roles.join(', ').toLowerCase()}. The short reason to consider it is {entry.strengths[0].toLowerCase()}. That strength gives the team a clear way to create progress, but it does not make {entry.name} automatic on every roster. Its typing, item, move slots, and partners must all support the same plan.</p>
      <p>For Regulation Set M-B, {entry.regulationLegal ? `${entry.name} is marked legal in our planning database. Use that flag for quick filtering, then confirm the exact form, item, and current notice inside the game before queueing.` : `${entry.name} is not marked legal in our M-B planning data. Do not rely on this build for the current ladder unless the in-game regulation checker confirms that its status changed.`} The tier is an editorial judgment based on flexibility, beginner usefulness, role value, and familiar competitive trends rather than official usage statistics.</p>

      <h2>Best {entry.name} build</h2>
      <div className="build-layout"><div className="content-card"><span className="eyebrow blue">Recommended Moveset</span><div className="move-list">{entry.recommendedMoves.map((move) => <div className="move" key={move}>{move}</div>)}</div></div><div className="content-card"><div className="stat-list"><div className="stat-row"><span>Ability</span><strong>{entry.ability}</strong></div><div className="stat-row"><span>Held item</span><strong>{entry.recommendedItem}</strong></div><div className="stat-row"><span>Primary role</span><strong>{entry.roles[0]}</strong></div><div className="stat-row"><span>Difficulty</span><strong>{entry.difficulty}</strong></div></div></div></div>
      <p>This set is designed to make {entry.name}'s job readable from team preview. {entry.recommendedMoves[0]} is the first move to understand because it usually represents the set’s most direct way to apply pressure. {entry.recommendedMoves[1]} complements that option with a second target profile, while {entry.recommendedMoves.slice(2).join(' and ')} supply coverage, priority, setup, protection, or disruption depending on the matchup.</p>

      <h2>Best moves for {entry.name}</h2>
      <p>Do not choose four attacks only because they have the largest damage numbers. A useful Pokémon Champions moveset gives the player at least one safe or repeatable decision. On this build, the four recommended moves are {entry.recommendedMoves.join(', ')}. Before replacing one, ask whether the team already covers the targets that move is meant to hit and whether another teammate can provide the lost utility.</p>
      <p>Protect-style moves become more valuable in Doubles because they can waste an opponent’s focused attack while a partner changes the board. Priority is valuable when speed control expires. Spread moves pressure both opposing slots but can be reduced by defensive tools. Status and support moves may deal no immediate damage, yet they often create the turn that lets the primary attacker secure a knockout.</p>

      <h2>Best item and ability</h2>
      <p><strong>{entry.recommendedItem}</strong> is the recommended item because it reinforces the {primaryRole} plan without asking the other five team members to change their jobs. Item Clause means a complete roster cannot casually repeat the same important item, so compare this recommendation with the needs of your other core Pokémon. If another member depends on it more, test a legal alternative rather than copying the build blindly.</p>
      <p><strong>{entry.ability}</strong> creates a distinct interaction to plan around. The ability is most useful when you know whether it activates automatically, responds to an opponent, changes damage, redirects an attack, or alters field conditions. At team preview, identify which opposing Pokémon can ignore or exploit that interaction. This prevents a familiar set from becoming predictable.</p>
    </article></section>

    <section className="section white"><div className="wrap two-col"><div className="content-card"><span className="eyebrow blue">What It Does Well</span><h2 style={{ fontSize: '1.65rem' }}>Strengths</h2><ul>{entry.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul><p>{entry.name} is easiest to use when the lead immediately supports one of these strengths. Avoid spending early turns on actions that do not advance its main role.</p></div><div className="content-card"><span className="eyebrow">Counterplay</span><h2 style={{ fontSize: '1.65rem' }}>Weaknesses and counters</h2><ul>{entry.weaknesses.map((weakness) => <li key={weakness}>{weakness}</li>)}</ul><div className="link-chips">{counters.map((counter) => <Link className="link-chip" href={`/pokemon/${counter!.slug}`} key={counter!.slug}>{counter!.name}</Link>)}</div></div></div></section>

    <section className="section tint"><div className="wrap"><SectionHeading eyebrow="Team Support" title={`Best teammates for ${entry.name}`} description={`Partners should cover ${entry.weaknesses[0].toLowerCase()} while helping ${entry.name} perform its ${primaryRole} role.`} /><div className="card-grid">{related.map((candidate) => <PokemonCard key={candidate.slug} entry={candidate} compact />)}</div><p className="section-copy">A partner is not automatically good just because it resists one attack. Look for shared tempo: Fake Out can create a safe action, redirection can protect a fragile attacker, speed control can change move order, and a defensive pivot can preserve the team’s main win condition. Test the suggested partners one at a time so you can identify which interaction actually improves difficult matchups.</p></div></section>

    <section className="section white"><article className="article wrap">
      <h2>Beginner tips for {entry.name}</h2>
      <p>{entry.beginnerFriendly ? `${entry.name} is considered beginner friendly because its core role is visible and its recommended actions are repeatable.` : `${entry.name} is marked as a practice-first choice because timing and positioning matter more than they appear from the moveset alone.`} Start by learning one reliable lead and one safe switch. During review, ask whether {entry.name} entered the field at a moment when it could use {entry.recommendedMoves[0]} or support its partner without immediately being forced out.</p>
      <p>Do not measure value only by knockouts. A support can win a game by changing speed, redirecting one attack, or weakening a physical threat. A tank can create value by forcing the opponent to spend two turns on it. An attacker can create value by making Protect or a defensive switch predictable. Track whether {entry.name} helped the team control decisions, not just how much health it removed.</p>

      <h2>Regulation Set M-B notes</h2>
      <p>M-B team preview gives you ninety seconds to select the participating Pokémon. When {entry.name} appears in your six, identify its best targets and the opposing answers before choosing the final group. In Doubles, build a group of four that contains a lead plan, a defensive switch, enough damage to close the battle, and a secondary speed option. In Singles, preserve coverage for the three opponents most likely to be selected.</p>
      <p>Legality can depend on more than the species name. Forms, Mega Stones, moves, items, and updates can affect the final check. ChampionsDex’s legality label is maintained for planning and filtering, but the current in-game notice always wins. Return to the <Link href="/regulation-set-m-b">Regulation Set M-B Guide</Link> when the season changes or a saved build stops passing validation.</p>

      <h2>Recommended teams</h2>
      {relevantTeams.length ? <p>{entry.name} currently appears in {relevantTeams.map((team) => <Link key={team.slug} href={`/best-teams#${team.slug}`}>{team.name}</Link>).reduce<React.ReactNode[]>((list, link, index) => [...list, index ? ', ' : '', link], [])}. Open the team page to review its lead, strengths, weaknesses, and game plan.</p> : <p>No featured sample team currently centers on {entry.name}. Use the Team Builder with the recommended partners above, then compare role counts and shared weaknesses before testing the squad.</p>}
      <div className="button-row"><Link className="btn blue" href={`/team-builder?team=${entry.slug}`}>Build with {entry.name}</Link><Link className="btn secondary" href="/best-teams">Browse Best Teams</Link><Link className="btn secondary" href="/tier-list">Compare Tier List</Link></div>

      <div className="faq-section"><h2>{entry.name} FAQ</h2><FAQ items={faq} /></div>
    </article></section>

    <FAQSchema items={faq} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: `${entry.name} Pokémon Champions Guide`, description: entry.description, dateModified: '2026-06-22', mainEntityOfPage: `${site.url}/pokemon/${entry.slug}`, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name } }) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: 'Pokémon Database', item: `${site.url}/pokemon` }, { '@type': 'ListItem', position: 3, name: entry.name, item: `${site.url}/pokemon/${entry.slug}` }] }) }} />
  </>
}
