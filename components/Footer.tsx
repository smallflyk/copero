import Link from 'next/link'

export default function Footer() {
  return <footer className="footer">
    <div className="footer-grid wrap">
      <div>
        <Link className="brand footer-brand" href="/"><span className="brand-mark"><i /></span><span>Champions<span>Dex</span></span></Link>
        <p>Your field guide to smarter battles.</p>
        <p className="legal-note">PokémonChampions.pro is an unofficial fan-made guide and is not affiliated with Nintendo, The Pokémon Company, Game Freak, or any official Pokémon brand.</p>
      </div>
      <div><h3>Explore</h3><Link href="/pokemon">Pokémon Database</Link><Link href="/tier-list">Tier List</Link><Link href="/best-teams">Best Teams</Link><Link href="/team-builder">Team Builder</Link></div>
      <div><h3>Guides</h3><Link href="/beginner-guide">Beginner Guide</Link><Link href="/codes">Mystery Gift Codes</Link><Link href="/regulation-set-m-b">Regulation Set M-B</Link><Link href="/regulation-guide">Regulation Hub</Link><Link href="/download">Download Guide</Link></div>
      <div><h3>ChampionsDex</h3><Link href="/about">About</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms</Link></div>
    </div>
    <div className="footer-bottom wrap"><span>© 2026 ChampionsDex</span><span>Made for trainers, by trainers <b>♥</b></span></div>
  </footer>
}
