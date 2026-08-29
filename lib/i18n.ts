export const locales = ['en', 'ja'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === '/ja' || pathname.startsWith('/ja/') ? 'ja' : defaultLocale
}

export function stripLocale(pathname: string): string {
  if (pathname === '/ja') return '/'
  return pathname.startsWith('/ja/') ? pathname.slice(3) || '/' : pathname
}

export function localizedPath(pathname: string, locale: Locale): string {
  const path = stripLocale(pathname)
  if (locale === 'en') return path

  if (path === '/' || path === '/pokemon' || path === '/pokemon/metagross') {
    return `/ja${path === '/' ? '' : path}`
  }

  return path
}

export function isLocalizedRoute(pathname: string): boolean {
  const path = stripLocale(pathname)
  return path === '/' || path === '/pokemon' || path === '/pokemon/metagross'
}
