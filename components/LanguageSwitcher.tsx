'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'
import {usePathname} from 'next/navigation'
import {useLanguage} from './LanguageProvider'
import {LOCALES,LANGUAGE_NAMES,LANGUAGE_TAGS,localizedPath} from '@/lib/i18n/config'
import {t} from '@/lib/i18n/translate'
export default function LanguageSwitcher(){const locale=useLanguage(),path=usePathname(),[hash,setHash]=useState('');useEffect(()=>{const sync=()=>setHash(window.location.hash);sync();window.addEventListener('hashchange',sync);return ()=>window.removeEventListener('hashchange',sync)},[path]);return <details className="language-switcher"><summary aria-label={t('Choose language',locale)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>{locale.toUpperCase()}<span aria-hidden="true">⌄</span></summary><nav aria-label={t('Site languages',locale)}>{LOCALES.map(lang=><Link key={lang} href={localizedPath(path||'/',lang)+hash} hrefLang={LANGUAGE_TAGS[lang]} lang={LANGUAGE_TAGS[lang]} aria-current={locale===lang?'true':undefined} onClick={event=>{event.currentTarget.closest('details')?.removeAttribute('open')}}><span className="language-check" aria-hidden="true">{locale===lang?'✓':''}</span>{LANGUAGE_NAMES[lang]}<small>{lang.toUpperCase()}</small></Link>)}</nav></details>}
