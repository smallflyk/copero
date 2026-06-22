'use client'

import { useEffect, useMemo, useState } from 'react'
import { pokemon } from '@/data/pokemon'
import { getDefensiveWeaknesses } from '@/data/type-chart'
import { PokemonGlyph } from './ui'

const weatherAbilities: Record<string, string> = { Drought: 'Sun', Drizzle: 'Rain', 'Sand Stream': 'Sand', 'Snow Warning': 'Snow' }

export default function TeamBuilder() {
  const [team, setTeam] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const chosen = team.map((slug) => pokemon.find((entry) => entry.slug === slug)!).filter(Boolean)
  const available = pokemon.filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = (params.get('team') || '').split(',').filter((slug) => pokemon.some((entry) => entry.slug === slug)).slice(0, 6)
    if (requested.length) setTeam([...new Set(requested)])
  }, [])

  const analysis = useMemo(() => {
    const selectedTypes = chosen.flatMap((entry) => entry.types)
    const uniqueTypes = [...new Set(selectedTypes)]
    const duplicateTypes = [...new Set(selectedTypes.filter((type, index) => selectedTypes.indexOf(type) !== index))]
    const weaknessCounts = chosen.flatMap((entry) => getDefensiveWeaknesses(entry.types)).reduce<Record<string, number>>((counts, type) => ({ ...counts, [type]: (counts[type] || 0) + 1 }), {})
    const commonWeaknesses = Object.entries(weaknessCounts).filter(([, count]) => count >= 2).sort((a, b) => b[1] - a[1])
    const roles = chosen.flatMap((entry) => entry.roles)
    const roleBalance = {
      attackers: roles.filter((role) => role.includes('Attacker')).length,
      supports: roles.filter((role) => role === 'Support').length,
      tanks: roles.filter((role) => role === 'Tank').length,
      speedControl: roles.filter((role) => role === 'Speed Control').length,
    }
    const illegal = chosen.filter((entry) => !entry.regulationLegal)
    const weather = [...new Set(chosen.map((entry) => weatherAbilities[entry.ability]).filter(Boolean))]
    const hasTrickRoom = roles.includes('Trick Room')
    const hasFastMode = roles.includes('Speed Control')
    const beginnerScore = chosen.length ? Math.round(chosen.filter((entry) => entry.beginnerFriendly).length / chosen.length * 100) : 0
    const warnings: string[] = []
    const suggestions: string[] = []
    if (illegal.length) warnings.push(`Not marked M-B legal: ${illegal.map((entry) => entry.name).join(', ')}`)
    if (chosen.length >= 3 && roleBalance.speedControl === 0 && !hasTrickRoom) suggestions.push('Add Tailwind, Icy Wind, paralysis, priority, or Trick Room for speed control.')
    if (weather.length > 1) warnings.push(`Weather conflict: ${weather.join(' and ')} setters can overwrite each other.`)
    if (hasTrickRoom && hasFastMode) warnings.push('Mixed speed plans: Trick Room and fast speed control need separate matchup modes.')
    if (chosen.length >= 4 && roleBalance.supports === 0) suggestions.push('Add a Support Pokémon for safer setup, pivots, or disruption.')
    if (chosen.length >= 4 && roleBalance.attackers < 2) suggestions.push('Consider a second reliable damage dealer for different matchups.')
    if (commonWeaknesses[0]?.[1] >= 3) suggestions.push(`Three or more members share a ${commonWeaknesses[0][0]} weakness; add a resist or immunity.`)
    return { uniqueTypes, duplicateTypes, commonWeaknesses, roleBalance, illegal, weather, hasTrickRoom, beginnerScore, warnings, suggestions }
  }, [chosen])

  function toggle(slug: string) {
    setTeam((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 6 ? [...current, slug] : current)
    setMessage('')
  }

  function fallbackCopy(text: string) {
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
  }

  async function writeClipboard(text: string, success: string) {
    try { await navigator.clipboard.writeText(text) } catch { fallbackCopy(text) }
    setMessage(success)
    setTimeout(() => setMessage(''), 2200)
  }

  function copyTeam() {
    const text = chosen.map((entry, index) => `${index + 1}. ${entry.name} — ${entry.roles.join('/')} — ${entry.recommendedItem}`).join('\n')
    return writeClipboard(text, '✓ Team copied to clipboard')
  }

  function shareTeam() {
    const url = new URL(window.location.href)
    url.search = team.length ? `?team=${team.join(',')}` : ''
    window.history.replaceState({}, '', url)
    return writeClipboard(url.toString(), '✓ Shareable team URL copied')
  }

  return <div className="builder upgraded-builder">
    <section className="picker">
      <div className="picker-head"><div className="search-field" style={{ flex: 1 }}><input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 80 Pokémon…" /></div><span className="picker-count">{available.length} available</span></div>
      <div className="picker-list">{available.map((entry) => { const selected = team.includes(entry.slug); return <button className={`pick-card ${selected ? 'selected' : ''}`} key={entry.slug} onClick={() => toggle(entry.slug)} disabled={!selected && team.length >= 6}><PokemonGlyph pokemon={entry} /><span><strong>{entry.name}</strong><small>{entry.types.join(' / ')} · {entry.tier} Tier</small><small>{entry.regulationLegal ? 'M-B legal' : 'Check M-B legality'}</small></span></button> })}</div>
    </section>

    <aside className="team-panel">
      <header><div><span className="eyebrow blue" style={{ margin: 0 }}>Your Squad</span><h2 style={{ fontSize: '1.35rem' }}>Team analysis</h2></div><strong>{team.length}/6</strong></header>
      <div className="team-slots">{Array.from({ length: 6 }).map((_, index) => { const entry = chosen[index]; return <div className={`team-slot ${entry ? 'filled' : ''}`} key={index}>{entry ? <><PokemonGlyph pokemon={entry} /><strong>{entry.name}</strong><button className="remove" onClick={() => toggle(entry.slug)} aria-label={`Remove ${entry.name}`}>×</button></> : <span style={{ color: '#a8b4bb', fontSize: '.75rem' }}>＋ Empty slot</span>}</div> })}</div>

      <div className="summary-box"><h3>Role balance</h3><div className="summary-grid"><div><span>Attackers</span><strong>{analysis.roleBalance.attackers}</strong></div><div><span>Supports</span><strong>{analysis.roleBalance.supports}</strong></div><div><span>Tanks</span><strong>{analysis.roleBalance.tanks}</strong></div><div><span>Speed control</span><strong>{analysis.roleBalance.speedControl}</strong></div></div><div className="summary-line"><span>Beginner score</span><strong>{analysis.beginnerScore}%</strong></div><div className="scorebar"><i style={{ width: `${analysis.beginnerScore}%` }} /></div></div>

      <div className="analysis-block"><h3>Type coverage</h3><div className="analysis-chips">{analysis.uniqueTypes.length ? analysis.uniqueTypes.map((type) => <span key={type}>{type}</span>) : <small>Select Pokémon to see coverage.</small>}</div>{analysis.duplicateTypes.length > 0 && <div className="warning">Duplicate types: {analysis.duplicateTypes.join(', ')}</div>}</div>

      <div className="analysis-block"><h3>Shared weaknesses</h3>{analysis.commonWeaknesses.length ? <div className="weakness-list">{analysis.commonWeaknesses.slice(0, 6).map(([type, count]) => <span key={type}><b>{type}</b> {count}×</span>)}</div> : <small>No repeated weakness is visible yet.</small>}</div>

      {analysis.warnings.map((warning) => <div className="warning danger" key={warning}>{warning}</div>)}
      {analysis.suggestions.map((suggestion) => <div className="warning suggestion" key={suggestion}>{suggestion}</div>)}
      {team.length > 0 && !analysis.illegal.length && <div className="legal-check">✓ All selected Pokémon are marked M-B legal.</div>}

      <div className="panel-actions three"><button className="btn secondary small" onClick={() => { setTeam([]); setMessage('') }} disabled={!team.length}>Clear</button><button className="btn secondary small" onClick={copyTeam} disabled={!team.length}>Copy team</button><button className="btn blue small" onClick={shareTeam} disabled={!team.length}>Share URL</button></div>
      {message && <div className="toast">{message}</div>}
    </aside>
  </div>
}
