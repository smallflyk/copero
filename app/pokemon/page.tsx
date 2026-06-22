import type { Metadata } from 'next'
import Link from 'next/link'
import PokemonExplorer from '@/components/PokemonExplorer'
import { PageHero } from '@/components/ui'
import { metadata as createMetadata } from '@/lib/seo'
export const metadata:Metadata=createMetadata('Pokémon Champions Pokémon List – Full Database & Battle Guide','Browse the Pokémon Champions database by name, type, tier, and role to find recommended moves, items, teammates, counters, builds, and battle tips.','/pokemon')
export default function PokemonPage(){return <><PageHero eyebrow="Battle Database" title="Pokémon Champions Pokémon List" description="Find a partner, understand its role, and open a focused battle guide. The MVP launches with 20 editable entries."/><section className="section"><div className="wrap"><PokemonExplorer/><div className="button-row" style={{justifyContent:'center',marginTop:42}}><Link className="btn secondary" href="/tier-list">Compare tier rankings</Link><Link className="btn blue" href="/team-builder">Open Team Builder</Link></div></div></section></>}
