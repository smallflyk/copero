'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getLocaleFromPathname, isLocalizedRoute, localizedPath, stripLocale, type Locale } from '@/lib/i18n'

const links = ['/codes', '/tier-list', '/best-teams', '/pokemon', '/regulation-set-m-b'] as const

const copy = {
  en: { links: ['Codes', 'Tier List', 'Best Teams', 'Pokédex', 'M-B Guide'], teamBuilder: 'Team Builder', home: 'Pokémon Champions home', language: '日本語' },
  ja: { links: ['コード', 'ティアリスト', 'おすすめチーム', 'ポケモン図鑑', 'M-Bガイド'], teamBuilder: 'チームビルダー', home: 'Pokémon Champions ホーム', language: 'English' },
} satisfies Record<Locale, { links: string[]; teamBuilder: string; home: string; language: string }>

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const locale = getLocaleFromPathname(pathname)
  const labels = copy[locale]
  const basePath = stripLocale(pathname)
  const navHref = (href: string) => href === '/pokemon' ? localizedPath(href, locale) : href
  const languageHref = locale === 'en'
    ? (isLocalizedRoute(basePath) ? localizedPath(basePath, 'ja') : '/ja')
    : (isLocalizedRoute(basePath) ? localizedPath(basePath, 'en') : '/')

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return <header className="site-header">
    <div className="nav-shell">
      <Link className="brand" href={localizedPath('/', locale)} onClick={() => setOpen(false)} aria-label={labels.home}>
        <span className="brand-mark"><i /></span>
        <span>Pokémon <span>Champions</span></span>
      </Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
        <span /><span /><span />
      </button>
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        {links.map((href, index) => <Link key={href} className={basePath === href ? 'active' : ''} href={navHref(href)} onClick={() => setOpen(false)}>{labels.links[index]}</Link>)}
        <Link className="nav-cta" href="/team-builder" onClick={() => setOpen(false)}><span>＋</span> {labels.teamBuilder}</Link>
        <Link className="language-link" href={languageHref} hrefLang={locale === 'en' ? 'ja' : 'en'} onClick={() => setOpen(false)}>{labels.language}</Link>
      </nav>
    </div>
  </header>
}
