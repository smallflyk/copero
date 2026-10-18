import Link from 'next/link'
import {getGuides} from '@/data/localized-content'
import {Breadcrumbs} from '@/components/Article'
import {localize} from '@/lib/i18n/render'
import type {Locale} from '@/lib/i18n/config'
export default function GuideIndex({locale}:{locale:Locale}){return localize(<><Breadcrumbs title="Copero guides" path="/guides" locale={locale}/><section className="container guide-index"><p className="eyebrow">THE COPERO PLAYBOOK</p><h1>A little knowledge.<br/><em>A different career.</em></h1><p className="lede">Understand the choices before you make them. These guides describe the rules of this Copero edition, with practical examples and clear trade-offs.</p><div className="guide-grid">{getGuides(locale).map(guide=><Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}><span>{guide.category}</span><h2>{guide.title}</h2><p>{guide.description}</p><span className="guide-bottom">{guide.readTime} min read <b>↗</b></span></Link>)}</div></section></>,locale)}
