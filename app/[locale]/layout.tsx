import type { ReactNode } from 'react'

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <div lang="ja">{children}</div>
}
