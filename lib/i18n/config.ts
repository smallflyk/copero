export const LOCALES=['es','en','it','pt','zh','de'] as const
export type Locale=typeof LOCALES[number]
export const LANGUAGE_NAMES:Record<Locale,string>={es:'Español',en:'English',it:'Italiano',pt:'Português',zh:'简体中文',de:'Deutsch'}
export const LANGUAGE_TAGS:Record<Locale,string>={es:'es',en:'en',it:'it',pt:'pt',zh:'zh-Hans',de:'de'}
export const isLocale=(value:string):value is Locale=>(LOCALES as readonly string[]).includes(value)
export function localizedPath(path:string,locale:Locale):string {
 if(!path.startsWith('/')||path.startsWith('//')||path.startsWith('/_next')||/\.(?:svg|png|ttf|woff2?)$/.test(path)||path.startsWith('/opengraph-image'))return path
 const clean=path.replace(/^\/(es|en|it|pt|zh|de)(?=\/|[?#]|$)/,'')||'/'
 if(locale==='es'&&(clean==='/'||clean===''||clean.startsWith('/#')||clean.startsWith('/?')))return clean||'/'
 return `/${locale}${clean==='/'?'':clean.startsWith('/#')||clean.startsWith('/?')?clean.slice(1):clean}`
}
export const routeLocale=(path:string):Locale=>{const value=path.split('/')[1];return isLocale(value)?value:'es'}
