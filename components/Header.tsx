'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { getLocaleFromPathname, isLocalizedRoute, localizedPath, locales, stripLocale, type Locale } from '@/lib/i18n'

const links = ['/codes', '/tier-list', '/best-teams', '/pokemon', '/regulation-set-m-b'] as const

const copy = {
  en: { links: ['Codes', 'Tier List', 'Best Teams', 'Pokédex', 'M-B Guide'], teamBuilder: 'Team Builder', home: 'Pokémon Champions home', languageMenu: 'Choose language' },
  ja: { links: ['コード', 'ティアリスト', 'おすすめチーム', 'ポケモン図鑑', 'M-Bガイド'], teamBuilder: 'チームビルダー', home: 'Pokémon Champions ホーム', languageMenu: '言語を選択' },
} satisfies Record<Locale, { links: string[]; teamBuilder: string; home: string; languageMenu: string }>

const localeNames: Record<Locale, string> = { en: 'English', ja: '日本語' }

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageRef = useRef<HTMLDivElement>(null)
  const languageTriggerRef = useRef<HTMLButtonElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const locale = getLocaleFromPathname(pathname)
  const labels = copy[locale]
  const basePath = stripLocale(pathname)
  const navHref = (href: string) => href === '/pokemon' ? localizedPath(href, locale) : href
  const languageHref = (targetLocale: Locale) => {
    if (targetLocale === 'ja') {
      return isLocalizedRoute(basePath) ? localizedPath(basePath, 'ja') : '/ja'
    }

    return isLocalizedRoute(basePath) ? localizedPath(basePath, 'en') : basePath
  }
  const closeNavigation = () => {
    setOpen(false)
    setLanguageOpen(false)
  }

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    if (!languageOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false)
      }
    }
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setLanguageOpen(false)
      languageTriggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [languageOpen])

  const handleLanguageKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const options = Array.from(languageMenuRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])
    if (!options.length) return

    const currentIndex = options.indexOf(document.activeElement as HTMLElement)
    let nextIndex: number | undefined

    if (event.key === ' ' && currentIndex >= 0) {
      event.preventDefault()
      options[currentIndex].click()
      return
    }

    if (event.key === 'ArrowDown') nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % options.length
    if (event.key === 'ArrowUp') nextIndex = currentIndex < 0 ? options.length - 1 : (currentIndex - 1 + options.length) % options.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = options.length - 1
    if (event.key === 'Tab') setLanguageOpen(false)

    if (nextIndex !== undefined) {
      event.preventDefault()
      options[nextIndex].focus()
    }
  }

  const toggleLanguageMenu = () => {
    const nextOpen = !languageOpen
    setLanguageOpen(nextOpen)
    if (nextOpen) {
      requestAnimationFrame(() => {
        languageMenuRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus()
      })
    }
  }

  return <header className="site-header">
    <div className="nav-shell">
      <Link className="brand" href={localizedPath('/', locale)} onClick={closeNavigation} aria-label={labels.home}>
        <span className="brand-mark"><i /></span>
        <span>Pokémon <span>Champions</span></span>
      </Link>
      <button className="menu-button" onClick={() => { setOpen(!open); setLanguageOpen(false) }} aria-expanded={open} aria-label="Toggle navigation">
        <span /><span /><span />
      </button>
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        {links.map((href, index) => <Link key={href} className={basePath === href ? 'active' : ''} href={navHref(href)} onClick={closeNavigation}>{labels.links[index]}</Link>)}
        <Link className="nav-cta" href="/team-builder" onClick={closeNavigation}><span>＋</span> {labels.teamBuilder}</Link>
        <div className="language-switcher" ref={languageRef} onKeyDown={handleLanguageKeyDown}>
          <button
            ref={languageTriggerRef}
            type="button"
            className="language-trigger"
            aria-haspopup="menu"
            aria-expanded={languageOpen}
            aria-controls="language-options"
            onClick={toggleLanguageMenu}
          >
            <svg className="language-globe" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
            </svg>
            <span>{localeNames[locale]}</span>
            <svg className="language-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 8 5 5 5-5" /></svg>
          </button>
          <div
            ref={languageMenuRef}
            id="language-options"
            className="language-menu"
            role="menu"
            aria-label={labels.languageMenu}
            hidden={!languageOpen}
          >
            {locales.map((targetLocale) => {
              const selected = targetLocale === locale
              return <Link
                key={targetLocale}
                className="language-option"
                href={languageHref(targetLocale)}
                hrefLang={targetLocale}
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={closeNavigation}
              >
                <span>{localeNames[targetLocale]}</span>
                {selected && <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-9" /></svg>}
              </Link>
            })}
          </div>
        </div>
      </nav>
    </div>
  </header>
}
