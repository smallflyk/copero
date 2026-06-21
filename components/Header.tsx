'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  ['Codes', '/codes'], ['Tier List', '/tier-list'], ['Best Teams', '/best-teams'],
  ['Pokédex', '/pokemon'], ['Guides', '/beginner-guide'],
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <div className="nav-shell">
      <Link className="brand" href="/" onClick={() => setOpen(false)} aria-label="ChampionsDex home">
        <span className="brand-mark"><i /></span>
        <span>Champions<span>Dex</span></span>
      </Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
        <span /><span /><span />
      </button>
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={href} className={pathname === href ? 'active' : ''} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="nav-cta" href="/team-builder" onClick={() => setOpen(false)}><span>＋</span> Team Builder</Link>
      </nav>
    </div>
  </header>
}
