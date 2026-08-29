import Link from 'next/link'
import type { Pokemon } from '@/data/pokemon'
import { getPokemon } from '@/data/pokemon'
import { site } from '@/lib/seo'
import { Breadcrumbs, FAQ, FAQSchema, PokemonCard, PokemonGlyph, TierBadge, TypePill } from './ui'
import { metagrossDescription, metagrossFaq } from '@/content/en/pokemon/metagross.mdx'

function GuideHero({ entry, eyebrow, title, role, item, teammates, weakAgainst, bestFor }: { entry: Pokemon; eyebrow: string; title: string; role: string; item: string; teammates: string; weakAgainst: string; bestFor: string }) {
  return <>
    <Breadcrumbs items={[["Home", "/"], ["Pokémon", "/pokemon"], [entry.name]]} />
    <section className="featured-pokemon-hero"><div className="wrap featured-hero-grid">
      <div className="featured-pokemon-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>Quick answer: use the build below as a practical starting point, then adjust one slot at a time for your team and current Regulation M-B legality.</p><div className="quick-facts"><TierBadge tier={entry.tier} />{entry.types.map((type) => <TypePill key={type} type={type} />)}<span className="type">{entry.regulationLegal ? 'M-B legal' : 'Check M-B legality'}</span></div></div>
      <div className="featured-build-card"><div className="featured-glyph"><PokemonGlyph pokemon={entry} large /></div><span className="eyebrow blue">Best {entry.name} Build</span><dl><div><dt>Role</dt><dd>{role}</dd></div><div><dt>Best item</dt><dd>{item}</dd></div><div><dt>Best moveset</dt><dd>{entry.recommendedMoves.join(' / ')}</dd></div><div><dt>Best teammates</dt><dd>{teammates}</dd></div><div><dt>Weak against</dt><dd>{weakAgainst}</dd></div><div><dt>Best for</dt><dd>{bestFor}</dd></div></dl><Link className="btn blue" href={`/team-builder?team=${entry.slug}`}>Try this build in Team Builder</Link></div>
    </div></section>
  </>
}

function RelatedGuides({ entries }: { entries: string[] }) {
  return <div className="card-grid">{entries.map(getPokemon).filter(Boolean).map((entry) => <PokemonCard entry={entry!} compact key={entry!.slug} />)}</div>
}

function Schemas({ entry, faq, headline, description }: { entry: Pokemon; faq: { q: string; a: string }[]; headline: string; description: string }) {
  return <><FAQSchema items={faq} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline, description, dateModified: '2026-06-23', mainEntityOfPage: `${site.url}/pokemon/${entry.slug}`, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name } }) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }, { '@type': 'ListItem', position: 2, name: 'Pokémon Database', item: `${site.url}/pokemon` }, { '@type': 'ListItem', position: 3, name: entry.name, item: `${site.url}/pokemon/${entry.slug}` }] }) }} /></>
}

export function FeaturedPokemonGuide({ entry }: { entry: Pokemon }) {
  if (entry.slug === 'metagross') return <MetagrossGuide entry={entry} />
  if (entry.slug === 'mega-raichu-y') return <MegaRaichuYGuide entry={entry} />
  if (entry.slug === 'tornadus') return <TornadusGuide entry={entry} />
  return null
}

function MetagrossGuide({ entry }: { entry: Pokemon }) {
  const faq = metagrossFaq
  const description = metagrossDescription
  return <>
    <GuideHero entry={entry} eyebrow="Featured Build Guide" title="Metagross Build for Pokémon Champions" role="Physical attacker / bulky attacker" item="Assault Vest" teammates="Rotom-Wash, Incineroar, Garchomp" weakAgainst="Fire, Ground, burns, Intimidate" bestFor="Ranked battles / beginner teams / Regulation M-B" />

    <section className="section"><article className="article wrap featured-guide-copy">
      <h2>Best Metagross Build in Pokémon Champions</h2>
      <p>The best general Metagross build uses <strong>Assault Vest</strong> with <strong>Heavy Slam, Psychic Fangs, Ice Punch, and Bullet Punch</strong>. This turns Metagross into a bulky physical attacker that can enter the field against many neutral attacks, threaten immediate damage, and finish weakened targets with priority. It does not need a setup turn, which is valuable for beginners and for ranked games where early board position matters.</p>
      <p>Metagross works best when the rest of the team covers Fire and Ground attacks. Clear Body prevents ordinary stat drops from reducing its Attack, so it is more comfortable than many physical attackers when Intimidate is common. The recommended set has a clear job: choose the move that hits the important target, preserve Metagross when its resistances are needed later, and use Bullet Punch only when priority changes the result.</p>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Build slot</th><th>Recommendation</th><th>Purpose</th></tr></thead><tbody><tr><td>Role</td><td>Bulky physical attacker</td><td>Absorb neutral pressure and return reliable damage.</td></tr><tr><td>Ability</td><td>Clear Body</td><td>Prevents opposing stat drops, including normal Intimidate Attack drops.</td></tr><tr><td>Item</td><td>Assault Vest</td><td>Improves special durability while using four attacks.</td></tr><tr><td>Primary move</td><td>Heavy Slam</td><td>Steel damage into Fairy targets and lighter opponents.</td></tr><tr><td>Priority</td><td>Bullet Punch</td><td>Finishes low-health targets before they can act.</td></tr></tbody></table></div>

      <h2>Best Moveset for Metagross</h2>
      <h3>Heavy Slam</h3><p>Heavy Slam is the main Steel attack and gives Metagross a direct answer into many Fairy Pokémon. Its value depends on weight, so it is not automatically the best button into every neutral target. Use it when the matchup is favorable rather than treating Steel damage as the entire build.</p>
      <h3>Psychic Fangs</h3><p>Psychic Fangs supplies secondary same-type pressure and can punish Fighting- or Poison-type targets. It also gives Metagross a way to make progress when Steel is resisted. The coverage pairing makes the set harder to stop with a single defensive switch.</p>
      <h3>Ice Punch</h3><p>Ice Punch targets Dragon, Flying, Grass, and Ground matchups that otherwise pressure the team. It is especially useful when Garchomp-style threats expect to switch into a resisted move or force Metagross out. Predict carefully: the coverage is useful because of its targets, not because it is the strongest neutral attack.</p>
      <h3>Bullet Punch</h3><p>Bullet Punch gives Metagross priority. Save it for turns where moving first secures a knockout, blocks an opposing endgame, or avoids taking unnecessary damage. Repeatedly clicking a weaker priority move against a healthy target wastes the bulk and coverage that make Metagross valuable.</p>

      <h2>Best Item for Metagross</h2>
      <p>Assault Vest is the best all-purpose item for this four-attack build. Metagross already has strong physical bulk and useful resistances; Assault Vest makes special attacks easier to survive and creates more chances to trade efficiently. The cost is that Metagross cannot use Protect or another status move, so positioning and defensive switches matter.</p>
      <p>Clear Amulet is the main alternative when your local matchups contain heavy stat reduction beyond what Clear Body already handles, or when you want a different move structure. A damage item can create stronger immediate rolls, but it gives up some of the consistency that makes this guide suitable for beginner teams. Always check Item Clause across the full six before assigning Assault Vest.</p>

      <h2>Best Team for Metagross</h2>
      <p>A strong Metagross team pairs it with <Link href="/pokemon/rotom-wash">Rotom-Wash</Link>, <Link href="/pokemon/incineroar">Incineroar</Link>, and <Link href="/pokemon/garchomp">Garchomp</Link>. Rotom-Wash can pressure Fire and Ground matchups while threatening burns. Incineroar lowers opposing physical damage, creates space with Fake Out, and pivots Metagross into favorable turns. Garchomp supplies Ground pressure into Fire and Electric targets that Metagross may not want to face directly.</p>
      <p>For a full six, add a special attacker such as Sylveon or Primarina and a support such as Amoonguss or Whimsicott. This prevents the roster from becoming entirely physical and gives Metagross either redirection or speed control. In Doubles, an Incineroar plus Metagross lead is straightforward when Fake Out creates a safe attack, but Rotom-Wash plus Metagross is often safer into teams with obvious Fire pressure.</p>
      <div className="button-row"><Link className="btn blue" href="/team-builder?team=metagross,rotom-wash,incineroar,garchomp">Try Metagross in the Team Builder</Link><Link className="btn secondary" href="/best-teams">Best team with Metagross</Link></div>

      <h2>Metagross Strengths and Weaknesses</h2>
      <div className="two-col"><div className="content-card"><h3>Strengths</h3><ul><li>Excellent natural physical bulk and many useful resistances.</li><li>Clear Body protects its Attack from normal stat drops.</li><li>Bullet Punch creates reliable late-game priority.</li><li>Steel and Psychic damage pressure several common roles.</li><li>Simple four-attack plan is friendly to new players.</li></ul></div><div className="content-card"><h3>Weaknesses</h3><ul><li>Fire and Ground attacks force defensive positioning.</li><li>Burn reduces physical damage even when Clear Body is active.</li><li>Assault Vest removes access to Protect.</li><li>Its middling speed requires priority or team speed control.</li><li>Repeated chip can leave it unable to perform its bulky role.</li></ul></div></div>

      <h2>How to Counter Metagross</h2>
      <p>Counter Metagross by attacking the parts of the build that Assault Vest does not solve. Strong physical Fire and Ground moves pressure its weaknesses, while Will-O-Wisp reduces every physical attack. Incineroar can resist Steel, threaten Fire damage, and use Fake Out or pivoting to control the board. Garchomp threatens Ground damage but must respect Ice Punch, so it should not switch in carelessly.</p>
      <p>If a direct knockout is not available, deny Metagross efficient trades. Protect the target it wants to finish with Bullet Punch, rotate a Steel resist into Heavy Slam, or force it to attack while its partner loses position. Because the Assault Vest set cannot Protect, focused double targets become more reliable once its defensive partners are removed.</p>

      <h2>Is Metagross Good for Beginners?</h2>
      <p>Metagross is one of the better beginner attackers because its purpose is visible and its bulk gives the player room to learn. It can contribute without a complex activation condition, and Bullet Punch teaches the value of priority. New players should practice identifying when to preserve Metagross instead of leaving it on the field simply because it can survive one more attack.</p>
      <p>During team preview, look for Fire, Ground, burn, and Intimidate options. Choose a partner that covers the most immediate problem. After each game, review whether Metagross used the correct coverage move and whether Assault Vest helped it survive a meaningful special hit. Those questions lead to more useful improvement than tracking knockouts alone.</p>

      <h2>Metagross FAQ</h2><FAQ items={faq} />
      <div className="related-links"><Link href="/tier-list">Pokémon Champions Tier List</Link><Link href="/regulation-set-m-b">Regulation Set M-B Guide</Link><Link href="/pokemon/mega-raichu-y">Mega Raichu Y Team</Link><Link href="/pokemon/tornadus">Tornadus Guide</Link></div>
    </article></section>
    <Schemas entry={entry} faq={faq} headline="Metagross Build for Pokémon Champions" description={description} />
  </>
}

function MegaRaichuYGuide({ entry }: { entry: Pokemon }) {
  const faq = [
    { q: 'What is the best Mega Raichu Y team?', a: 'A balanced starting team uses Mega Raichu Y with Incineroar, Amoonguss, Metagross, Garchomp, and Milotic or another bulky Water partner.' },
    { q: 'What is Mega Raichu Y weak against?', a: 'Its Electric and Psychic typing is weak to Ground, Bug, Ghost, and Dark attacks. Strong priority and physical attacks also exploit its modest bulk.' },
    { q: 'What is the best Mega Raichu Y moveset?', a: 'Thunderbolt, Psychic, Nuzzle, and Protect provide reliable special damage, secondary coverage, speed disruption, and defensive timing.' },
    { q: 'How do you counter Mega Raichu Y?', a: 'Use Ground immunity management, Dark or Ghost pressure, priority, and bulky Pokémon that can survive its special attacks. Avoid giving Nuzzle free targets.' },
    { q: 'Is Mega Raichu Y good in Pokémon Champions?', a: 'Yes. It combines high speed, special pressure, and useful disruption, but it needs partners that cover Ground and Dark matchups.' },
  ]
  const description = 'Build the best Mega Raichu Y team in Pokémon Champions, learn its weaknesses, moveset, teammates, counters, item, and Regulation M-B ranked role.'
  return <>
    <GuideHero entry={entry} eyebrow="Team & Weakness Guide" title="Mega Raichu Y Pokémon Champions Team & Weakness Guide" role="Fast special attacker / speed support" item="Raichunite Y" teammates="Incineroar, Amoonguss, Metagross" weakAgainst="Ground, Bug, Ghost, Dark, priority" bestFor="Fast balance / ranked teams / Regulation M-B" />
    <section className="section"><article className="article wrap featured-guide-copy">
      <h2>Best Mega Raichu Y Team</h2>
      <p>The best Mega Raichu Y team gives it safe turns to use special attacks or Nuzzle without asking it to absorb heavy physical pressure. Start with <strong>Mega Raichu Y, Incineroar, Amoonguss, Metagross, Garchomp, and Milotic</strong>. This six combines fast Electric and Psychic pressure with Intimidate, Fake Out, redirection, Steel bulk, Ground damage, and a bulky Water switch.</p>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Pokémon</th><th>Team role</th><th>Why it helps Mega Raichu Y</th></tr></thead><tbody><tr><td>Mega Raichu Y</td><td>Fast special attacker</td><td>Creates immediate pressure and spreads paralysis with Nuzzle.</td></tr><tr><td>Incineroar</td><td>Physical damage control</td><td>Uses Intimidate and Fake Out to protect Raichu’s weaker physical side.</td></tr><tr><td>Amoonguss</td><td>Redirection support</td><td>Redirects attacks and creates sleep pressure.</td></tr><tr><td>Metagross</td><td>Bulky physical attacker</td><td>Handles Fairy pressure and supplies priority.</td></tr><tr><td>Garchomp</td><td>Ground attacker</td><td>Threatens Steel, Fire, and Electric targets that resist Thunderbolt.</td></tr><tr><td>Milotic</td><td>Bulky Water support</td><td>Checks Fire pressure and discourages opposing stat drops.</td></tr></tbody></table></div>
      <p>In Doubles, Incineroar plus Mega Raichu Y is the simplest lead. Fake Out can buy one turn for Nuzzle or a direct attack, and Parting Shot can bring in the correct defensive partner. Amoonguss plus Raichu is stronger when redirection protects it from a clear Ground, Dark, or physical target. Do not bring Raichu automatically; choose it when Electric or Psychic pressure has a useful target.</p>
      <div className="button-row"><Link className="btn blue" href="/team-builder?team=mega-raichu-y,incineroar,amoonguss,metagross,garchomp,milotic">Build the Mega Raichu Y team</Link><Link className="btn secondary" href="/best-regulation-m-b-teams">Compare M-B teams</Link></div>

      <h2>Mega Raichu Y Weakness</h2>
      <p>Mega Raichu Y is weak to <strong>Ground, Bug, Ghost, and Dark</strong> attacks. Ground is especially important because it also threatens Electric teams that rely too heavily on the same resistance pattern. Dark and Ghost attacks pressure the Psychic side of the typing, while Sucker Punch-style priority can move before Raichu and exploit its modest physical bulk.</p>
      <p>Weakness does not mean an automatic loss. Levitate or Flying partners can switch into Ground moves, Intimidate can reduce physical damage, and redirection can change the target. The real danger is a team that leaves Raichu as its only source of speed or special damage. If it must remain on the field against every counter, the other five slots are not doing enough.</p>

      <h2>Best Teammates for Mega Raichu Y</h2>
      <p><Link href="/pokemon/incineroar">Incineroar</Link> is the most direct partner because Intimidate and Fake Out address Raichu’s physical vulnerability. <Link href="/pokemon/amoonguss">Amoonguss</Link> redirects single-target attacks and forces opponents to respect Spore. <Link href="/pokemon/metagross">Metagross</Link> supplies a bulky physical win condition so the team is not entirely special.</p>
      <p>Garchomp is useful despite sharing an awkward interaction with Electric attacks because it pressures Ground-sensitive and Steel targets with its own Ground damage. Milotic or Rotom-Wash offers a Water slot into Fire matchups. Whimsicott can provide Tailwind, but stacking Tailwind with Raichu’s natural speed and Nuzzle should be a deliberate fast mode rather than redundant support.</p>
      <RelatedGuides entries={['incineroar','amoonguss','metagross','garchomp']} />

      <h2>How to Counter Mega Raichu Y</h2>
      <p>Use bulky Ground Pokémon or Ground attacks that Raichu cannot safely absorb, but remember that its partner may redirect or switch. Dark Pokémon can threaten the Psychic typing and are immune to Psychic damage, while Ghost attackers pressure it without caring about Nuzzle once speed order is already favorable. Priority attacks are useful because they bypass Raichu’s natural speed.</p>
      <p>Do not let Nuzzle spread freely across a slow defensive team. Protect a key attacker, switch into an immunity when available, or pressure Raichu before it controls several targets. Assault Vest users that resist one of its attacks can force it to predict. If the opponent spends every turn protecting Raichu, target the support slot and reduce the resources keeping it safe.</p>

      <h2>Best Moveset for Mega Raichu Y</h2>
      <div className="move-explain-grid"><div className="content-card"><h3>Thunderbolt</h3><p>Reliable Electric same-type damage for Water and Flying targets. Use it as the safe damage option when Psychic coverage is unnecessary.</p></div><div className="content-card"><h3>Psychic</h3><p>Secondary same-type coverage for Fighting and Poison targets and an answer to Pokémon that resist Electric.</p></div><div className="content-card"><h3>Nuzzle</h3><p>Low damage but valuable speed disruption. It can make a faster threat manageable for the entire team.</p></div><div className="content-card"><h3>Protect</h3><p>Preserves Raichu while a partner removes a counter, changes speed, or creates a safer board.</p></div></div>
      <p>Raichunite Y is required for the Mega role, so the item choice is fixed. The moveset must therefore provide consistency rather than rely on an extra damage or survival item. A coverage move can replace Nuzzle on extremely offensive teams, but losing speed disruption makes the set less flexible and less useful when a direct knockout is unavailable.</p>

      <h2>Is Mega Raichu Y Good in Pokémon Champions?</h2>
      <p>Mega Raichu Y is good when the team needs fast special damage and a way to manage opposing speed without committing every turn to Tailwind. It is not a bulky all-purpose switch. Its best games begin with a protected action, a favorable target, or a partner that forces the opponent to divide attention.</p>
      <p>For beginners, the moves are easy to understand but positioning takes practice. Start with Incineroar or Amoonguss beside Raichu, identify the opposing Ground and Dark options during team preview, and preserve Protect for the turn that removes one of those counters. Confirm current Regulation M-B form and Mega Stone legality inside the game.</p>

      <h2>Mega Raichu Y FAQ</h2><FAQ items={faq} />
      <div className="related-links"><Link href="/pokemon/metagross">Metagross Build</Link><Link href="/pokemon/mega-raichu-x">Mega Raichu X Build</Link><Link href="/regulation-set-m-b">Regulation Set M-B Guide</Link><Link href="/team-builder?team=mega-raichu-y">Try Mega Raichu Y in Team Builder</Link></div>
    </article></section>
    <Schemas entry={entry} faq={faq} headline="Mega Raichu Y Pokémon Champions Team & Weakness Guide" description={description} />
  </>
}

function TornadusGuide({ entry }: { entry: Pokemon }) {
  const faq = [
    { q: 'What is the best Tornadus build in Pokémon Champions?', a: 'Use Covert Cloak with Tailwind, Bleakwind Storm, Taunt, and Protect for a fast support build focused on speed control and disruption.' },
    { q: 'What item should Tornadus use?', a: 'Covert Cloak is the recommended support item because it reduces disruption from secondary effects. Focus Sash is an alternative when surviving one direct hit matters more.' },
    { q: 'What are the best teammates for Tornadus?', a: 'Garchomp, Metagross, Incineroar, and Amoonguss can use Tailwind turns or protect Tornadus while it establishes speed control.' },
    { q: 'What is Tornadus weak against?', a: 'As a Flying type, Tornadus is weak to Electric, Ice, and Rock attacks. It also dislikes priority, Taunt, and opponents that reverse Tailwind with Trick Room.' },
    { q: 'Is Tornadus legal in Regulation Set M-B?', a: 'Our planning database does not currently mark Tornadus as M-B legal. Confirm the live in-game regulation notice before building it for ranked play.' },
  ]
  const description = 'Find the best Tornadus build in Pokémon Champions, including moveset, item, teammates, weaknesses, counters, speed control role, and beginner tips.'
  return <>
    <GuideHero entry={entry} eyebrow="Speed Control Build" title="Tornadus Pokémon Champions Guide – Best Build, Moveset & Team" role="Support / Tailwind speed control" item="Covert Cloak" teammates="Garchomp, Metagross, Incineroar" weakAgainst="Electric, Ice, Rock, Taunt, Trick Room" bestFor="Fast offense / flexible Doubles support" />
    <section className="section"><article className="article wrap featured-guide-copy">
      <h2>Best Tornadus Build</h2>
      <p>The best support Tornadus build uses <strong>Covert Cloak</strong> with <strong>Tailwind, Bleakwind Storm, Taunt, and Protect</strong>. Tailwind is the reason to choose the set: it changes move order for the team and lets powerful attackers invest in damage or bulk instead of relying only on natural speed. Bleakwind Storm prevents Tornadus from becoming passive, Taunt interrupts setup, and Protect preserves it for a second support turn.</p>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Build slot</th><th>Recommendation</th><th>Battle purpose</th></tr></thead><tbody><tr><td>Role</td><td>Speed-control support</td><td>Enable faster attacks for several turns.</td></tr><tr><td>Ability</td><td>Prankster</td><td>Gives support moves priority against eligible targets.</td></tr><tr><td>Item</td><td>Covert Cloak</td><td>Reduces disruptive secondary effects.</td></tr><tr><td>Core move</td><td>Tailwind</td><td>Doubles allied Speed for the active Tailwind window.</td></tr><tr><td>Disruption</td><td>Taunt</td><td>Stops Trick Room, opposing Tailwind, recovery, or setup when targeted correctly.</td></tr></tbody></table></div>
      <p>This is not a damage-first build. Tornadus creates value when a partner uses the faster turn to secure a knockout or a safer board. If Tailwind is set but both partners spend the next turns protecting and switching without purpose, the speed advantage has been wasted. Plan the first attacker before choosing Tornadus at preview.</p>

      <h2>Best Tornadus Moveset</h2>
      <h3>Tailwind</h3><p>Tailwind is the core move and should be used when changing speed creates an immediate advantage. Do not set it automatically against Trick Room without a plan to deny the opposing setup. Track its remaining turns so a slower attacker is not left exposed when the effect ends.</p>
      <h3>Bleakwind Storm</h3><p>Bleakwind Storm gives Tornadus spread Flying damage and a chance to influence speed further. Accuracy can make it less reliable than a simple support action, so use it when damaging both targets matters or when Taunt and Protect are not the correct play.</p>
      <h3>Taunt</h3><p>Taunt stops many non-damaging moves and is most valuable when aimed at a clear support target. Prankster interactions and Dark-type immunity rules must be respected. A failed Taunt can give the opponent a completely free attack, so read the target rather than clicking it because a support Pokémon is present.</p>
      <h3>Protect</h3><p>Protect lets Tornadus remain available after setting Tailwind. It can waste a focused attack while its partner removes an Electric, Ice, or Rock threat. Covert Cloak does not make Tornadus bulky, so Protect remains important even on an aggressive team.</p>

      <h2>Best Item for Tornadus</h2>
      <p>Covert Cloak is the recommended item because a support Pokémon loses enormous value when Fake Out or a secondary effect prevents its key move. The item does not block direct damage, status applied as the main effect, or every form of disruption. It simply makes the Tailwind turn more consistent in matchups where secondary effects are common.</p>
      <p>Focus Sash is the main alternative. It gives Tornadus one guaranteed survival from full health against many direct attacks, but chip damage, weather, and multi-hit moves can remove that safety. Mental Herb can help against Taunt in some formats. Choose the item based on the exact interruption that repeatedly stops your team, while checking Item Clause across all six members.</p>

      <h2>Best Teammates for Tornadus</h2>
      <p><Link href="/pokemon/garchomp">Garchomp</Link> uses Tailwind to pressure both opponents with strong physical coverage. <Link href="/pokemon/metagross">Metagross</Link> appreciates moving before threats that would otherwise exploit its middling speed. <Link href="/pokemon/incineroar">Incineroar</Link> creates safer setup turns through Fake Out and Intimidate, while <Link href="/pokemon/amoonguss">Amoonguss</Link> can redirect attacks when the team needs Tornadus to survive.</p>
      <p>Build the remaining slots around what Tailwind is enabling. Two attackers with different damage profiles are usually better than four Pokémon that all need the same favorable matchup. Include a defensive switch for Electric or Ice pressure and a form of priority for turns after Tailwind expires. Avoid combining Tornadus with a mandatory Trick Room plan unless the roster intentionally has two separate modes.</p>
      <RelatedGuides entries={['garchomp','metagross','incineroar','amoonguss']} />
      <div className="button-row"><Link className="btn blue" href="/team-builder?team=tornadus,garchomp,metagross,incineroar">Build a Tornadus team</Link><Link className="btn secondary" href="/tier-list">Compare speed-control picks</Link></div>

      <h2>Tornadus Weakness and Counters</h2>
      <p>Tornadus is weak to <strong>Electric, Ice, and Rock</strong> attacks. Fast Electric pressure can force it to Protect before Tailwind is established. Rock Slide threatens damage and flinches across both slots. Ice coverage is common on Pokémon that also want to pressure Dragon partners, making the combination especially awkward for Garchomp-based teams.</p>
      <p>Trick Room counters the purpose of Tailwind by making slower Pokémon move first. Taunt can deny support moves when priority interactions allow it. Strong priority can finish Tornadus after chip damage even while Tailwind is active. The best counterplay is not always attacking Tornadus: sometimes protecting through the first fast turn and removing its enabled attacker wastes more of the Tailwind window.</p>

      <h2>Is Tornadus Good for Beginners?</h2>
      <p>Tornadus is easy to understand but harder to use well. Setting Tailwind is simple; converting its limited turns into useful pressure requires planning. Beginners should choose the intended partner at team preview, identify whether Trick Room must be Taunted, and decide which target the partner can threaten after Tailwind.</p>
      <p>Our current planning database does not mark Tornadus as Regulation Set M-B legal. That legality warning matters more than the strength of the build. Check the live in-game notice before using it for ranked play. The guide remains useful for future formats and for understanding the speed-control role even when another legal Tailwind user must replace it.</p>

      <h2>Tornadus FAQ</h2><FAQ items={faq} />
      <div className="related-links"><Link href="/pokemon/metagross">Metagross Build</Link><Link href="/pokemon/mega-raichu-y">Mega Raichu Y Team</Link><Link href="/team-builder?team=tornadus">Try Tornadus in Team Builder</Link><Link href="/regulation-set-m-b">Check M-B legality</Link></div>
    </article></section>
    <Schemas entry={entry} faq={faq} headline="Tornadus Pokémon Champions Guide – Best Build, Moveset & Team" description={description} />
  </>
}
