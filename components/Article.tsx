import Link from 'next/link'
import type {ReactNode} from 'react'
import {breadcrumbSchema,jsonLd} from '@/lib/seo'
import {localize} from '@/lib/i18n/render'
import {localizeSchema} from '@/lib/i18n/schema'
import type {Locale} from '@/lib/i18n/config'
export default function Article({title,eyebrow,description,children,locale='en'}:{title:string;eyebrow:string;description:string;children:ReactNode;locale?:Locale}){return localize(<><div className="article-hero container"><Link className="back-link" href="/">← Copero</Link><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{description}</p></div><article className="article container">{children}<div className="article-cta"><p className="eyebrow">The next move is yours</p><h2>Put your plan on the pitch.</h2><Link className="button" href="/#create-player">Start a Copero career ↗</Link></div></article></>,locale)}
export function Breadcrumbs({title,path,locale='en'}:{title:string;path:string;locale?:Locale}){const items=[{name:'Copero',path:'/'},...(path.startsWith('/guides/')?[{name:'Copero guides',path:'/guides'}]:[]),{name:title,path}];return <>{localize(<nav className="breadcrumbs container" aria-label="Breadcrumb"><ol>{items.map((item,index)=><li key={item.path}>{index<items.length-1?<Link href={item.path}>{item.name}</Link>:<span aria-current="page">{item.name}</span>}</li>)}</ol></nav>,locale)}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(localizeSchema(breadcrumbSchema(items),locale))}}/></>}
