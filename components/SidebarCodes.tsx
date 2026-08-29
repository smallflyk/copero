import { sidebarCodes } from '@/data/codes'
import type { Locale } from '@/lib/i18n'

const copy = {
  en: { title: 'Active codes', confirmed: 'confirmed', none: 'No active codes' },
  ja: { title: '有効なコード', confirmed: '件を確認済み', none: '有効なコードはありません' },
} satisfies Record<Locale, { title: string; confirmed: string; none: string }>

export default function SidebarCodes({ locale = 'en' }: { locale?: Locale }) {
  const labels = copy[locale]
  return <>
    <div className="float-card one">{labels.title}<small>{sidebarCodes.length ? `${sidebarCodes.length} ${labels.confirmed}` : labels.none}</small></div>
    {sidebarCodes.length ? sidebarCodes.map((item, index) => (
      <div className={`float-card ${index === 0 ? 'two' : 'three'}`} key={item.code}>
        <span className="code-text">{item.code}</span>
        <small>{item.reward}</small>
      </div>
    )) : <div className="float-card two">{labels.none}</div>}
  </>
}
