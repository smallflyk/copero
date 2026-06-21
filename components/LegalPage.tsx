import { PageHero } from './ui'
import type { ReactNode } from 'react'
export default function LegalPage({title,eyebrow,description,children}:{title:string;eyebrow:string;description:string;children:ReactNode}){return <><PageHero eyebrow={eyebrow} title={title} description={description}/><section className="section"><article className="article wrap">{children}</article></section></>}
