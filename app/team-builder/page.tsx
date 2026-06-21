import type { Metadata } from 'next'
import TeamBuilder from '@/components/TeamBuilder'
import { PageHero } from '@/components/ui'
import { metadata as createMetadata } from '@/lib/seo'
export const metadata:Metadata=createMetadata('Pokémon Champions Team Builder – Build Your Best Battle Team','Create a 6-Pokémon team, check roles, type coverage, overlap, and beginner-friendly balance.','/team-builder')
export default function BuilderPage(){return <><PageHero eyebrow="Free Battle Tool" title="Pokémon Champions Team Builder" description="Choose up to six Pokémon. We’ll summarize your roles, type variety, overlaps, and how friendly the squad is for a new trainer."/><section className="section"><div className="wrap"><TeamBuilder/></div></section></>}
