import Link from 'next/link'
import { codes, codesLastChecked } from '@/data/codes'
import { pendingConfirmation, siteLinks } from '@/data/site'
import { FAQ, FAQSchema, SectionHeading } from '@/components/ui'
import { CopyCodeButton } from '@/components/CopyCodeButton'
import { homeFaq, homeHero, startCards } from '@/content/en/home.mdx'

const activeCodes = codes.filter((item) => item.status === 'active')

export default function Home() {
  return <>
    <section className="home-hero"><div className="wrap hero-grid">
      <div className="hero-copy">
        <span className="hero-kicker">{homeHero.eyebrow}</span>
        <h1>{homeHero.title} <span>{homeHero.highlight}</span></h1>
        <p>{homeHero.description}</p>
        <div className="button-row hero-actions">
          <Link className="btn primary" href="/pokemon/tornadus">{homeHero.primary}</Link>
          <Link className="btn secondary" href="/team-builder?team=tornadus,garchomp,metagross,incineroar">{homeHero.secondary}</Link>
          <Link className="btn blue" href="/regulation-set-m-b">{homeHero.tertiary}</Link>
        </div>
        <div className="trust-row">{homeHero.stats.map((item) => <span key={item}>{item}</span>)}</div>
        <p className="mini-disclaimer">{homeHero.videoLabel}</p>
      </div>
      <aside className="hero-art" aria-label="Tornadus support build summary">
        <div className="battle-ring" aria-hidden="true" />
        <div className="float-card one"><strong>Tornadus quick build</strong><small>Flying support</small></div>
        <div className="float-card two"><strong>Tailwind</strong><small>Priority speed control</small></div>
        <div className="float-card three"><strong>Covert Cloak</strong><small>Recommended item</small></div>
        <i className="spark s1" aria-hidden="true">✦</i><i className="spark s2" aria-hidden="true">✦</i>
      </aside>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Start Here" title="Start with Tornadus Pokemon Champions" description="Build around priority Tailwind, choose a useful action for each turn, and confirm that the current ranked format allows Tornadus before you lock the team." />
      <div className="card-grid">{startCards.map((card) => <div className="info-card" key={card.number}><span className="number">{card.number}</span><h3>{card.title}</h3><p>{card.description}</p></div>)}</div>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Verified Mystery Gift Codes" title="Active Pokémon Champions codes" description={`These codes are recorded in the research materials and were last checked on ${codesLastChecked}. Expired distributions stay in the full code archive.`} action={<Link className="text-link" href="/codes">Open the codes guide →</Link>} />
      <div className="info-grid">{activeCodes.length ? activeCodes.map((item) => <div className="content-card" key={item.code}><span className="status"><strong>Active</strong></span><div className="code-copy-row"><h3><span className="code-text">{item.code}</span></h3><CopyCodeButton code={item.code} /></div><p>{item.reward}</p><small>{item.expiryDate ? `Expires ${item.expiryDate}` : `End date: ${pendingConfirmation}`}</small></div>) : <div className="content-card"><h3>No active codes</h3></div>}</div>
    </div></section>

    <section className="section regulation-home"><div className="wrap two-col">
      <div><span className="eyebrow">Tornadus Overview</span><h2>Why use Tornadus Pokemon Champions support?</h2><p>Tornadus is a Flying-type support Pokémon built around speed control. Prankster gives its status moves priority, letting Tailwind change move order before many ordinary attacks. Its job is to help a partner attack sooner, not to carry every turn with personal damage.</p><p>The recommended set combines Tailwind, Bleakwind Storm, Taunt, and Protect. Covert Cloak is the suggested item; Focus Sash is an alternative when surviving one direct hit from full health matters more. Every move should create or exploit the limited Tailwind window.</p><div className="button-row"><Link className="btn primary" href="/pokemon/tornadus">Read the Full Guide</Link><Link className="btn secondary" href="/team-builder?team=tornadus,garchomp,metagross,incineroar">Open Team Builder</Link></div></div>
      <div className="content-card regulation-summary"><span className="eyebrow blue">Build Facts</span><div className="stat-list"><div className="stat-row"><span>Type</span><strong>Flying</strong></div><div className="stat-row"><span>Role</span><strong>Support · Speed Control</strong></div><div className="stat-row"><span>Ability</span><strong>Prankster</strong></div><div className="stat-row"><span>Recommended item</span><strong>Covert Cloak</strong></div><div className="stat-row"><span>Core move</span><strong>Tailwind</strong></div><div className="stat-row"><span>M-B status</span><strong>Not marked legal · Verify in game</strong></div></div></div>
    </div></section>

    <section className="section tint"><div className="wrap">
      <SectionHeading eyebrow="Four-Move Plan" title="How the Tornadus Pokemon Champions set works" description="Lead with speed control when a partner can capitalize, disrupt opposing setup, and preserve Tornadus when another support turn matters." />
      <div className="info-grid"><div className="info-card"><span className="number">01</span><h3>Tailwind first</h3><p>Tailwind gives the whole side a temporary speed advantage. Use it when Garchomp, Metagross, or another attacker can convert that move order into pressure.</p></div><div className="info-card"><span className="number">02</span><h3>Pressure or disrupt</h3><p>Bleakwind Storm provides an attacking option, while Taunt targets setup and support. Choose according to the opponent&apos;s immediate plan.</p></div><div className="info-card"><span className="number">03</span><h3>Protect the next turn</h3><p>Protect can preserve Tornadus for another Tailwind, Taunt, or attack. Use it only when the extra support turn has clear value.</p></div></div>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Team Partners" title="Best teammates for Tornadus Pokemon Champions" description="Pair speed control with immediate pressure, safer positioning, or redirection. Our planning data highlights four teammates with different jobs." />
      <div className="team-grid"><div className="content-card"><h3>Fast offensive pressure</h3><p>Garchomp and Metagross can attack sooner under Tailwind. Choose targets carefully and avoid wasting the limited speed turns on unnecessary switches.</p><Link className="text-link" href="/team-builder?team=tornadus,garchomp,metagross">Build the offensive core →</Link></div><div className="content-card"><h3>Safer support setup</h3><p>Incineroar can create a safer Tailwind opening, while Amoonguss can redirect attacks. These partners exchange immediate damage for better control of early turns.</p><Link className="text-link" href="/team-builder?team=tornadus,incineroar,amoonguss">Build the support core →</Link></div></div>
    </div></section>

    <section className="section tint"><div className="wrap">
      <SectionHeading eyebrow="Counterplay" title="Tornadus Pokemon Champions weaknesses and counters" description="Electric, Ice, and Rock attacks threaten Tornadus directly. Trick Room, Taunt, and priority pressure target the support plan." action={<Link className="text-link" href="/pokemon/tornadus">See every matchup note →</Link>} />
      <div className="card-grid"><div className="info-card"><span className="number">01</span><h3>Electric attacks</h3><p>Electric damage is super effective. Mega Raichu X is a listed counter, so avoid exposing Tornadus when it already controls the field.</p></div><div className="info-card"><span className="number">02</span><h3>Ice and Rock attacks</h3><p>Ice and Rock are also direct weaknesses. Keep a safe switch instead of assuming Tailwind can protect Tornadus from every hit.</p></div><div className="info-card"><span className="number">03</span><h3>Trick Room</h3><p>Trick Room can reverse the advantage of a faster team. Prepare disruption instead of treating Tailwind as an automatic win.</p></div><div className="info-card"><span className="number">04</span><h3>Taunt and priority</h3><p>Taunt can stop support moves, while opposing priority can act early. Prankster does not remove the need to anticipate disruption.</p></div></div>
    </div></section>

    <section className="section white"><div className="wrap"><SectionHeading eyebrow="Next Steps" title="Continue your Tornadus Pokemon Champions research" description="Open the full build, create a team draft, or check the regulation that controls ranked eligibility."/><div className="three-col featured-link-grid"><Link className="content-card" href="/pokemon/tornadus"><span className="eyebrow blue">Full Build</span><h3>Tornadus Moveset and Matchups</h3><p>Review the item, four moves, strengths, weaknesses, teammates, and counters in one guide.</p><span className="text-link">Open Tornadus guide →</span></Link><Link className="content-card" href="/team-builder?team=tornadus,garchomp,metagross,incineroar"><span className="eyebrow blue">Team Draft</span><h3>Tailwind Team Builder</h3><p>Start with Tornadus, Garchomp, Metagross, and Incineroar, then adjust for expected threats.</p><span className="text-link">Open the builder →</span></Link><Link className="content-card" href="/regulation-set-m-b"><span className="eyebrow blue">Ranked Check</span><h3>Regulation M-B Guide</h3><p>Check eligibility and Item Clause first. Tornadus is not currently marked legal in our M-B data.</p><span className="text-link">Verify the format →</span></Link></div></div></section>

    <section className="section builder-cta"><div className="wrap two-col"><div><span className="eyebrow">Build the Team</span><h2>Build a Tornadus Pokemon Champions team.</h2><p>The Tornadus Pokemon Champions core needs an attacker for the speed window, safe responses to Electric, Ice, and Rock damage, and counterplay for Trick Room or Taunt. Verify live format eligibility before entering ranked play.</p><div className="button-row"><Link className="btn blue" href="/pokemon/tornadus">Read the Tornadus Guide</Link><Link className="btn secondary" href="/team-builder?team=tornadus,garchomp,metagross,incineroar">Build This Team</Link></div></div><div className="content-card"><span className="eyebrow blue">Pre-Battle Checklist</span><ul className="feature-list"><li>Choose the attacker that benefits from Tailwind</li><li>Cover Electric, Ice, and Rock weaknesses</li><li>Keep a response to Trick Room and Taunt</li><li>Confirm held items follow Item Clause</li><li>Verify Tornadus eligibility in the live notice</li></ul></div></div></section>

    <section className="section white"><div className="wrap two-col"><div><span className="eyebrow">Official References</span><h2>Verify the Tornadus Pokemon Champions plan.</h2><p>Use official destinations for game availability and the live in-game notice for ranked eligibility. A strong set still cannot enter a format that excludes its Pokémon.</p><div className="button-row"><a className="btn primary" href={siteLinks.officialWebsite} target="_blank" rel="noreferrer">Official Website</a><a className="btn secondary" href={siteLinks.nintendoStore} target="_blank" rel="noreferrer">Nintendo Store</a><a className="btn secondary" href={siteLinks.googlePlay} target="_blank" rel="noreferrer">Google Play</a></div></div><div className="info-grid" style={{ gridTemplateColumns: '1fr' }}><div className="info-card"><span className="number">01</span><h3>Official Discord</h3><p>{pendingConfirmation}</p></div><div className="info-card"><span className="number">02</span><h3>Official YouTube</h3><p>{pendingConfirmation}</p></div></div></div></section>

    <section className="section tint"><div className="wrap narrow"><SectionHeading eyebrow="Quick Answers" title="Tornadus Pokemon Champions FAQ" /><FAQ items={homeFaq} /></div></section>
    <section className="section disclaimer-section"><div className="wrap"><p><strong>Unofficial fan guide:</strong> PokémonChampions.pro is an independent fan-made guide and is not affiliated with Nintendo, The Pokémon Company, Game Freak, or an official Pokémon brand.</p></div></section>
    <FAQSchema items={homeFaq} />
  </>
}
