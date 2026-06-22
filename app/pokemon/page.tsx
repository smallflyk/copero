import type { Metadata } from 'next'
import Link from 'next/link'
import PokemonExplorer from '@/components/PokemonExplorer'
import { PageHero } from '@/components/ui'
import { metadata as createMetadata } from '@/lib/seo'
export const metadata:Metadata=createMetadata('Pokémon Champions Pokémon List – Database, Builds, Types & Tier Rankings','Browse 80 Pokémon Champions guides with types, roles, tier rankings, recommended moves, items, teammates, counters, and beginner-friendly build tips.','/pokemon')
export default function PokemonPage(){return <><PageHero eyebrow="80 Build Guides" title="Pokémon Champions Pokémon List" description="Search 80 Pokémon by name, type, tier, role, beginner friendliness, and Regulation Set M-B legality, then open a complete battle build."/><section className="section"><div className="wrap"><PokemonExplorer/><div className="button-row" style={{justifyContent:'center',marginTop:42}}><Link className="btn secondary" href="/tier-list">Compare tier rankings</Link><Link className="btn secondary" href="/regulation-set-m-b">Read the M-B guide</Link><Link className="btn blue" href="/team-builder">Open Team Builder</Link></div></div></section></>}
