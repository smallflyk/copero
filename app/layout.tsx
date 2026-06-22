import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { site, socialImage } from '@/lib/seo'
import './globals.css'

const homeDescription = 'Explore Pokémon Champions codes, tier rankings, best teams, Pokémon builds, beginner guides, regulation tips, and a free team builder for every battle.'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Pokémon Champions Guide – Codes, Tier List, Teams & Database', template: '%s | ChampionsDex' },
  description: homeDescription,
  alternates: { canonical: 'https://www.pokemonchampions.pro/' },
  openGraph: {
    title: 'Pokémon Champions Guide – Codes, Tier List, Teams & Database',
    description: homeDescription,
    url: 'https://www.pokemonchampions.pro/',
    siteName: site.name,
    locale: 'en_US',
    type: 'website',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokémon Champions Guide – Codes, Tier List, Teams & Database',
    description: homeDescription,
    images: [socialImage.url],
  },
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en">
    <head>
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
