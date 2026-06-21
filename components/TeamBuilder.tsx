'use client'

import { useMemo, useState } from 'react'
import { pokemon } from '@/data/pokemon'
import { PokemonGlyph } from './ui'

export default function TeamBuilder() {
  const [team, setTeam] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const chosen = team.map((slug) => pokemon.find((p) => p.slug === slug)!)
  const available = pokemon.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  const analysis = useMemo(() => {
    const roles = chosen.flatMap((p) => p.roles)
    const selectedTypes = chosen.flatMap((p) => p.types)
    const duplicate = [...new Set(selectedTypes.filter((x, i) => selectedTypes.indexOf(x) !== i))]
    const friendly = chosen.length ? Math.round(chosen.filter((p) => p.beginnerFriendly).length / chosen.length * 100) : 0
    return { attackers: roles.filter((x) => x.includes('Attacker')).length, supports: roles.filter((x) => x === 'Support').length, types: [...new Set(selectedTypes)], duplicate, friendly }
  }, [chosen])

  function toggle(slug: string) {
    setTeam((current) => current.includes(slug) ? current.filter((x) => x !== slug) : current.length < 6 ? [...current, slug] : current)
  }

  async function copy() {
    const text = chosen.map((p, i) => `${i + 1}. ${p.name} — ${p.roles.join('/')}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return <div className="builder">
    <section className="picker">
      <div className="picker-head">
        <div className="search-field" style={{ flex: 1 }}><input className="field" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Pokémon…" /></div>
        <select className="field" style={{ width: 150 }} aria-label="Sort Pokémon"><option>Tier order</option></select>
      </div>
      <div className="picker-list">{available.map((p) => {
        const selected = team.includes(p.slug)
        return <button className={`pick-card ${selected ? 'selected' : ''}`} key={p.slug} onClick={() => toggle(p.slug)} disabled={!selected && team.length >= 6}>
          <PokemonGlyph pokemon={p} /><span><strong>{p.name}</strong><small>{p.types.join(' / ')} · {p.tier} Tier</small></span>
        </button>
      })}</div>
    </section>
    <aside className="team-panel">
      <header><div><span className="eyebrow blue" style={{ margin: 0 }}>Your Squad</span><h2 style={{ fontSize: '1.35rem' }}>Battle team</h2></div><strong>{team.length}/6</strong></header>
      <div className="team-slots">{Array.from({ length: 6 }).map((_, i) => {
        const p = chosen[i]
        return <div className={`team-slot ${p ? 'filled' : ''}`} key={i}>{p ? <><PokemonGlyph pokemon={p} /><strong>{p.name}</strong><button className="remove" onClick={() => toggle(p.slug)} aria-label={`Remove ${p.name}`}>×</button></> : <span style={{ color: '#a8b4bb', fontSize: '.75rem' }}>＋ Empty slot</span>}</div>
      })}</div>
      <div className="summary-box">
        <div className="summary-line"><span>Attackers</span><strong>{analysis.attackers}</strong></div>
        <div className="summary-line"><span>Supports</span><strong>{analysis.supports}</strong></div>
        <div className="summary-line"><span>Unique types</span><strong>{analysis.types.length}</strong></div>
        <div className="summary-line"><span>Beginner score</span><strong>{analysis.friendly}%</strong></div>
        <div className="scorebar"><i style={{ width: `${analysis.friendly}%` }} /></div>
        {analysis.duplicate.length > 0 && <div className="warning">Type overlap: {analysis.duplicate.join(', ')}</div>}
        {team.length > 0 && analysis.supports === 0 && <div className="warning">Consider adding a Support Pokémon.</div>}
      </div>
      <div className="panel-actions"><button className="btn secondary small" onClick={() => setTeam([])} disabled={!team.length}>Clear</button><button className="btn blue small" onClick={copy} disabled={!team.length}>Copy team</button></div>
      {copied && <div className="toast">✓ Team copied to clipboard</div>}
    </aside>
  </div>
}
