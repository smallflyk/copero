'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLocaleFromPathname, localizedPath, type Locale } from '@/lib/i18n'
import { siteLinks } from '@/data/site'

const copy = {
  en: {
    legal: 'PokémonChampions.pro is an unofficial fan-made guide and is not affiliated with Nintendo, The Pokémon Company, Game Freak, or any official Pokémon brand.',
    explore: 'Explore', pokemon: 'Pokémon Database', tier: 'Tier List', teams: 'Best Teams', builder: 'Team Builder',
    guides: 'Guides', beginner: 'Beginner Guide', codes: 'Mystery Gift Codes', regulation: 'Regulation Set M-B', hub: 'Regulation Hub', download: 'Download Guide',
    about: 'About', privacy: 'Privacy Policy', terms: 'Terms', made: 'Made for trainers, by trainers', official: 'Official Links', website: 'Official Website', discord: 'Official Discord', youtube: 'Official YouTube', pending: 'Pending confirmation',
  },
  ja: {
    legal: 'PokémonChampions.pro は非公式のファンガイドであり、任天堂、株式会社ポケモン、ゲームフリーク、その他の公式ポケモンブランドとは関係ありません。',
    explore: '探す', pokemon: 'ポケモン図鑑', tier: 'ティアリスト', teams: 'おすすめチーム', builder: 'チームビルダー',
    guides: 'ガイド', beginner: '初心者ガイド', codes: 'ふしぎなおくりものコード', regulation: 'レギュレーション M-B', hub: 'レギュレーション一覧', download: 'ダウンロードガイド',
    about: 'このサイトについて', privacy: 'プライバシーポリシー', terms: '利用規約', made: 'トレーナーによる、トレーナーのためのガイド', official: '公式リンク', website: '公式サイト', discord: '公式 Discord', youtube: '公式 YouTube', pending: '未確認',
  },
} satisfies Record<Locale, Record<string, string>>

export default function Footer() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const labels = copy[locale]
  return <footer className="footer">
    <div className="footer-grid wrap">
      <div>
        <Link className="brand footer-brand" href={localizedPath('/', locale)}><span className="brand-mark"><i /></span><span>Pokémon <span>Champions</span></span></Link>
        <p className="legal-note">{labels.legal}</p>
      </div>
      <div><h3>{labels.explore}</h3><Link href={localizedPath('/pokemon', locale)}>{labels.pokemon}</Link><Link href="/tier-list">{labels.tier}</Link><Link href="/best-teams">{labels.teams}</Link><Link href="/team-builder">{labels.builder}</Link></div>
      <div><h3>{labels.guides}</h3><Link href="/beginner-guide">{labels.beginner}</Link><Link href="/codes">{labels.codes}</Link><Link href="/regulation-set-m-b">{labels.regulation}</Link><Link href="/regulation-guide">{labels.hub}</Link><Link href="/download">{labels.download}</Link></div>
      <div><h3>{labels.official}</h3><a href={siteLinks.officialWebsite} target="_blank" rel="noreferrer">{labels.website}</a><span className="pending-link">{labels.discord}: {labels.pending}</span><span className="pending-link">{labels.youtube}: {labels.pending}</span><Link href="/about">{labels.about}</Link><Link href="/privacy-policy">{labels.privacy}</Link><Link href="/terms">{labels.terms}</Link></div>
    </div>
    <div className="footer-bottom wrap"><span>© 2026 Pokémon Champions Wiki</span><span>{labels.made} <b>♥</b></span></div>
  </footer>
}
