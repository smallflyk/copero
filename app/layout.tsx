import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { site } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Pokémon Champions Guide – Codes, Tier List, Best Teams & Database', template: '%s | ChampionsDex' },
  description: 'Find Pokémon Champions codes, tier lists, best teams, Pokémon guides, and competitive battle tools.',
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
