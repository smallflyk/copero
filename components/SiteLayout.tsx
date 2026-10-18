import type {ReactNode} from 'react'
import {Header,Footer} from './Shell'
import LanguageProvider from './LanguageProvider'
import {LANGUAGE_TAGS,type Locale} from '@/lib/i18n/config'
import {t} from '@/lib/i18n/translate'
import GoogleTag from './GoogleTag'
import PlausibleTag from './PlausibleTag'
export default function SiteLayout({children,locale}:{children:ReactNode;locale:Locale}){return <html lang={LANGUAGE_TAGS[locale]}><head><GoogleTag/><PlausibleTag/></head><body><LanguageProvider locale={locale}><a className="skip-link" href="#main">{t('Skip to content',locale)}</a><Header/><main id="main">{children}</main><Footer/></LanguageProvider></body></html>}
