'use client'

import { useMemo, useState } from 'react'
import { pokemon, roles, types } from '@/data/pokemon'
import type { Locale } from '@/lib/i18n'
import { PokemonCard } from './ui'

const copy = {
  en: {
    search: 'Search', placeholder: 'Search by Pokémon name…', all: 'All', type: 'Filter by type', tier: 'Filter by tier', role: 'Filter by role', beginner: 'Filter by beginner friendly', legal: 'Filter by Regulation Set M-B legality', yes: 'Yes', no: 'No', legalValue: 'Legal', illegalValue: 'Not legal', found: 'Pokémon found', database: '80-guide database · Sorted by tier', empty: 'No Pokémon found', retry: 'Try a broader search or reset a filter.',
  },
  ja: {
    search: '検索', placeholder: 'ポケモン名で検索…', all: 'すべて', type: 'タイプで絞り込む', tier: 'ティアで絞り込む', role: '役割で絞り込む', beginner: '初心者向けで絞り込む', legal: 'レギュレーション M-B の使用可否で絞り込む', yes: 'はい', no: 'いいえ', legalValue: '使用可', illegalValue: '使用不可', found: '匹のポケモン', database: '全80件 · ティア順', empty: '該当するポケモンがありません', retry: '検索語を広げるか、フィルターをリセットしてください。',
  },
} satisfies Record<Locale, Record<string, string>>

export default function PokemonExplorer({ locale = 'en' }: { locale?: Locale }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')
  const [tier, setTier] = useState('All')
  const [role, setRole] = useState('All')
  const [beginner, setBeginner] = useState('All')
  const [legal, setLegal] = useState('All')
  const labels = copy[locale]
  const filtered = useMemo(() => pokemon.filter((entry) =>
    (!query || entry.name.toLowerCase().includes(query.toLowerCase())) &&
    (type === 'All' || entry.types.includes(type)) &&
    (tier === 'All' || entry.tier === tier) &&
    (role === 'All' || entry.roles.includes(role)) &&
    (beginner === 'All' || (beginner === 'Yes' ? entry.beginnerFriendly : !entry.beginnerFriendly)) &&
    (legal === 'All' || (legal === 'Legal' ? entry.regulationLegal : !entry.regulationLegal))
  ), [query, type, tier, role, beginner, legal])

  return <>
    <div className="filter-bar expanded">
      <label className="search-field"><span className="sr-only">{labels.search}</span><input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.placeholder} /></label>
      <select className="field" value={type} onChange={(event) => setType(event.target.value)} aria-label={labels.type}><option value="All">{labels.all}</option>{types.map((entry) => <option key={entry}>{entry}</option>)}</select>
      <select className="field" value={tier} onChange={(event) => setTier(event.target.value)} aria-label={labels.tier}><option value="All">{labels.all}</option>{['S', 'A', 'B', 'C'].map((entry) => <option key={entry}>{entry}</option>)}</select>
      <select className="field" value={role} onChange={(event) => setRole(event.target.value)} aria-label={labels.role}><option value="All">{labels.all}</option>{roles.map((entry) => <option key={entry}>{entry}</option>)}</select>
      <select className="field" value={beginner} onChange={(event) => setBeginner(event.target.value)} aria-label={labels.beginner}><option value="All">{labels.all}</option><option value="Yes">{labels.yes}</option><option value="No">{labels.no}</option></select>
      <select className="field" value={legal} onChange={(event) => setLegal(event.target.value)} aria-label={labels.legal}><option value="All">{labels.all}</option><option value="Legal">{labels.legalValue}</option><option value="Not legal">{labels.illegalValue}</option></select>
    </div>
    <div className="results-row"><span>{locale === 'ja' ? `${filtered.length}${labels.found}` : `${filtered.length} ${labels.found}`}</span><span>{labels.database}</span></div>
    <div className="db-grid">{filtered.length ? filtered.map((entry) => <PokemonCard entry={entry} key={entry.slug} locale={locale} />) : <div className="empty-state"><h3>{labels.empty}</h3><p>{labels.retry}</p></div>}</div>
  </>
}
