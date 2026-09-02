import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { site, socialImage } from '@/lib/seo'
import './globals.css'
import './expansion.css'

const homeTitle = 'Tornadus Pokemon Champions Guide — Build, Moves & Team'
const homeDescription = 'Use this Tornadus Pokemon Champions guide to learn its Tailwind support build, best moveset, item, teammates, weaknesses, counters, and legality notes.'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: homeTitle, template: '%s | Pokémon Champions Wiki' },
  description: homeDescription,
  keywords: 'tornadus pokemon champions, Tornadus build, moveset, team, Tailwind, counters',
  alternates: { canonical: 'https://www.pokemonchampions.pro/', languages: { en: 'https://www.pokemonchampions.pro/', ja: 'https://www.pokemonchampions.pro/ja' } },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: 'https://www.pokemonchampions.pro/',
    siteName: site.name,
    locale: 'en_US',
    type: 'website',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: homeDescription,
    images: [socialImage.url],
  },
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en">
    <head>
      <meta name="google-adsense-account" content="ca-pub-2781955398980978" />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2781955398980978"
        crossOrigin="anonymous"
      />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZNBPMX159V" />
      <script dangerouslySetInnerHTML={{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-ZNBPMX159V');
      ` }} />
    </head>
    <body><Header /><main>{children}</main><Footer /></body>
  </html>
}
