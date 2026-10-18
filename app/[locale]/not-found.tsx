'use client'
import Link from 'next/link'
import {useLanguage} from '@/components/LanguageProvider'
import {localize} from '@/lib/i18n/render'
export default function NotFound(){return localize(<section className="container empty-career"><p className="eyebrow">404</p><h1>Page not found</h1><p>This page is not in the current Copero playbook.</p><Link className="button" href="/">Back to kick-off ↗</Link></section>,useLanguage())}
