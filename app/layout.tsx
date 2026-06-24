import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { site, socialImage } from '@/lib/seo'
import './globals.css'
import './expansion.css'

const homeDescription = 'Explore the Pokémon Champions guide with active codes, tier list, best teams, Pokémon builds, Regulation Set M-B tips, and a free team builder.'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Pokémon Champions: Codes, Tier List, Best Teams & Builder', template: '%s | ChampionsDex' },
  description: homeDescription,
  alternates: { canonical: 'https://www.pokemonchampions.pro/' },
  openGraph: {
    title: 'Pokémon Champions: Codes, Tier List, Best Teams & Builder',
    description: homeDescription,
    url: 'https://www.pokemonchampions.pro/',
    siteName: site.name,
    locale: 'en_US',
    type: 'website',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokémon Champions: Codes, Tier List, Best Teams & Builder',
    description: homeDescription,
    images: [socialImage.url],
  },
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en">
    <head>
      <meta name="google-adsense-account" content="ca-pub-5422937940034036" />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5422937940034036"
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
