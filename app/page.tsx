import Link from 'next/link'
import { codes, codesLastChecked } from '@/data/codes'
import { pendingConfirmation, siteLinks } from '@/data/site'
import { FAQ, FAQSchema, SectionHeading } from '@/components/ui'
import SidebarCodes from '@/components/SidebarCodes'
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
          <Link className="btn primary" href="/beginner-guide">{homeHero.primary}</Link>
          <Link className="btn secondary" href="/pokemon">{homeHero.secondary}</Link>
          <Link className="btn blue" href="/codes">{homeHero.tertiary}</Link>
        </div>
        <div className="trust-row">{homeHero.stats.map((item) => <span key={item}>{item}</span>)}</div>
        <p className="mini-disclaimer">{homeHero.videoLabel}</p>
      </div>
      <aside className="hero-art" aria-label="Pokémon Champions active Mystery Gift codes">
        <div className="battle-ring" aria-hidden="true" />
        <SidebarCodes />
        <i className="spark s1" aria-hidden="true">✦</i><i className="spark s2" aria-hidden="true">✦</i>
      </aside>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Start Here" title="Your Pokémon Champions journey" description="Begin with the battle basics, build a roster, choose the right mode, and check the current regulation before entering ranked play." />
      <div className="card-grid">{startCards.map((card) => <div className="info-card" key={card.number}><span className="number">{card.number}</span><h3>{card.title}</h3><p>{card.description}</p></div>)}</div>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Verified Mystery Gift Codes" title="Active Pokémon Champions codes" description={`These codes are recorded in the research materials and were last checked on ${codesLastChecked}. Expired distributions stay in the full code archive.`} action={<Link className="text-link" href="/codes">Open the codes guide →</Link>} />
      <div className="info-grid">{activeCodes.length ? activeCodes.map((item) => <div className="content-card" key={item.code}><span className="status"><strong>Active</strong></span><h3 style={{ marginTop: 12 }}><span className="code-text">{item.code}</span></h3><p>{item.reward}</p><small>{item.expiryDate ? `Expires ${item.expiryDate}` : `End date: ${pendingConfirmation}`}</small></div>) : <div className="content-card"><h3>No active codes</h3></div>}</div>
    </div></section>

    <section className="section regulation-home"><div className="wrap two-col">
      <div><span className="eyebrow">About the Game</span><h2>What is Pokémon Champions?</h2><p>Pokémon Champions brings familiar Pokémon battle mechanics—types, Abilities, and moves—into a battle-focused game designed for varied strategies. New and experienced Trainers can battle players around the world in Ranked, Casual, or Private Battles.</p><p>Build a roster by recruiting Pokémon in the game or linking Pokémon HOME to bring certain previous partners. Cross-platform play lets mobile users battle Trainers on Nintendo Switch and Nintendo Switch 2.</p><div className="button-row"><Link className="btn primary" href="/beginner-guide">Explore All Guides</Link><a className="btn secondary" href={siteLinks.officialWebsite} target="_blank" rel="noreferrer">Official Website</a></div></div>
      <div className="content-card regulation-summary"><span className="eyebrow blue">Game Facts</span><div className="stat-list"><div className="stat-row"><span>Developer</span><strong>{pendingConfirmation}</strong></div><div className="stat-row"><span>Platforms</span><strong>Switch · iOS · Android</strong></div><div className="stat-row"><span>Genre</span><strong>Battle</strong></div><div className="stat-row"><span>Release date</span><strong>April 8, 2026</strong></div><div className="stat-row"><span>Mobile release</span><strong>June 17, 2026</strong></div><div className="stat-row"><span>Google Play update</span><strong>July 30, 2026</strong></div></div></div>
    </div></section>

    <section className="section tint"><div className="wrap">
      <SectionHeading eyebrow="Battle Your Way" title="Ranked, Casual, and Private Battles" description="Choose serious matches against global players, easygoing battles, or private matches with family and friends." />
      <div className="info-grid"><div className="info-card"><span className="number">01</span><h3>Ranked Battles</h3><p>Play serious matches against Trainers from around the world under the current regulation.</p></div><div className="info-card"><span className="number">02</span><h3>Casual Battles</h3><p>Use the game’s easygoing battle mode when rank is not the goal.</p></div><div className="info-card"><span className="number">03</span><h3>Private Battles</h3><p>Battle family, friends, and other Trainers in a private match.</p></div></div>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Assemble Your Ideal Team" title="Recruit in-game Pokémon or connect Pokémon HOME" description="Pokémon Champions supports players who are new to the series while also letting eligible past partners return through Pokémon HOME." />
      <div className="team-grid"><div className="content-card"><h3>Start inside Pokémon Champions</h3><p>Find Pokémon within the game and assemble a team even if you have not played a previous Pokémon series title.</p><Link className="text-link" href="/pokemon">Browse the Pokémon list →</Link></div><div className="content-card"><h3>Link Pokémon HOME</h3><p>Connect Pokémon HOME to team up with certain Pokémon you previously befriended.</p><Link className="text-link" href="/best-teams">Explore team resources →</Link></div></div>
    </div></section>

    <section className="section tint"><div className="wrap">
      <SectionHeading eyebrow="Current Rules" title="Pokémon Champions Regulation M-B" description="Regulation M-B runs from June 17 to September 2, 2026, with eligible Pokémon, held-item rules, selected Mega Evolutions, and fixed battle timers." action={<Link className="text-link" href="/regulation-set-m-b">Read the M-B guide →</Link>} />
      <div className="card-grid"><div className="info-card"><span className="number">20</span><h3>Minutes total</h3><p>The total time limit for each game.</p></div><div className="info-card"><span className="number">7</span><h3>Player minutes</h3><p>The player timer available during each game.</p></div><div className="info-card"><span className="number">45</span><h3>Seconds per turn</h3><p>The documented decision window for each turn.</p></div><div className="info-card"><span className="number">90</span><h3>Seconds preview</h3><p>The documented team preview timer.</p></div></div>
    </div></section>

    <section className="section white"><div className="wrap"><SectionHeading eyebrow="Player Guides" title="Find the next answer you need" description="Use the researched topics to learn the game, check the available Pokémon, or prepare for Regulation M-B."/><div className="three-col featured-link-grid"><Link className="content-card" href="/beginner-guide"><span className="eyebrow blue">Gameplay</span><h3>Pokémon Champions Beginner Guide</h3><p>Learn the familiar battle mechanics and the three confirmed battle modes.</p><span className="text-link">Start the guide →</span></Link><Link className="content-card" href="/pokemon"><span className="eyebrow blue">Roster</span><h3>Pokémon Champions Pokémon List</h3><p>Browse Pokémon while planning an in-game roster or a Pokémon HOME-linked team.</p><span className="text-link">Browse Pokémon →</span></Link><Link className="content-card" href="/regulation-set-m-b"><span className="eyebrow blue">Ranked Rules</span><h3>Regulation M-B Guide</h3><p>Review eligibility, held items, Mega Evolution, and battle timers.</p><span className="text-link">Read the rules →</span></Link></div></div></section>

    <section className="section builder-cta"><div className="wrap two-col"><div><span className="eyebrow">Ready to Battle?</span><h2>Start your Pokémon Champions journey.</h2><p>Learn the battle basics, assemble a roster, and choose Ranked, Casual, or Private Battles. When you are ready to play, use the official Pokémon Champions website or a verified platform store.</p><div className="button-row"><Link className="btn blue" href="/beginner-guide">Read the Beginner Guide</Link><a className="btn secondary" href={siteLinks.officialWebsite} target="_blank" rel="noreferrer">Play Pokémon Champions</a></div></div><div className="content-card"><span className="eyebrow blue">Confirmed Platforms</span><ul className="feature-list"><li>Nintendo Switch and Nintendo Switch 2</li><li>iOS through the App Store</li><li>Android through Google Play</li><li>Cross-platform battles</li><li>Pokémon HOME connectivity</li></ul></div></div></section>

    <section className="section white"><div className="wrap two-col"><div><span className="eyebrow">Official Links</span><h2>Use verified destinations.</h2><p>The official website, Nintendo store, and Google Play links below were present in the research materials and returned working pages during verification.</p><div className="button-row"><a className="btn primary" href={siteLinks.officialWebsite} target="_blank" rel="noreferrer">Official Website</a><a className="btn secondary" href={siteLinks.nintendoStore} target="_blank" rel="noreferrer">Nintendo Store</a><a className="btn secondary" href={siteLinks.googlePlay} target="_blank" rel="noreferrer">Google Play</a></div></div><div className="info-grid" style={{ gridTemplateColumns: '1fr' }}><div className="info-card"><span className="number">01</span><h3>Official Discord</h3><p>{pendingConfirmation}</p></div><div className="info-card"><span className="number">02</span><h3>Official YouTube</h3><p>{pendingConfirmation}</p></div></div></div></section>

    <section className="section tint"><div className="wrap narrow"><SectionHeading eyebrow="Quick Answers" title="Pokémon Champions FAQ" /><FAQ items={homeFaq} /></div></section>
    <section className="section disclaimer-section"><div className="wrap"><p><strong>Unofficial fan guide:</strong> PokémonChampions.pro is an independent fan-made guide and is not affiliated with Nintendo, The Pokémon Company, Game Freak, or an official Pokémon brand.</p></div></section>
    <FAQSchema items={homeFaq} />
  </>
}
