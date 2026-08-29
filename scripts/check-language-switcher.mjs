import { readdirSync, readFileSync } from 'node:fs'

const pages = [
  {
    path: 'out/index.html',
    current: 'English',
    currentHref: '/',
    alternate: '日本語',
    alternateHref: '/ja',
  },
  {
    path: 'out/ja.html',
    current: '日本語',
    currentHref: '/ja',
    alternate: 'English',
    alternateHref: '/',
  },
  {
    path: 'out/pokemon.html',
    current: 'English',
    currentHref: '/pokemon',
    alternate: '日本語',
    alternateHref: '/ja/pokemon',
  },
  {
    path: 'out/ja/pokemon.html',
    current: '日本語',
    currentHref: '/ja/pokemon',
    alternate: 'English',
    alternateHref: '/pokemon',
  },
  {
    path: 'out/pokemon/metagross.html',
    current: 'English',
    currentHref: '/pokemon/metagross',
    alternate: '日本語',
    alternateHref: '/ja/pokemon/metagross',
  },
  {
    path: 'out/ja/pokemon/metagross.html',
    current: '日本語',
    currentHref: '/ja/pokemon/metagross',
    alternate: 'English',
    alternateHref: '/pokemon/metagross',
  },
]

for (const page of pages) {
  const html = readFileSync(page.path, 'utf8')
  const switcher = html.match(/<div class="language-switcher"[\s\S]*?<\/div>/)?.[0]

  if (!switcher) {
    console.error(`Language switcher not found in ${page.path}`)
    process.exit(1)
  }

  const trigger = switcher.match(/<button([^>]*)class="language-trigger"([^>]*)>([\s\S]*?)<\/button>/)
  const triggerAttributes = `${trigger?.[1] ?? ''}${trigger?.[2] ?? ''}`
  const options = [...switcher.matchAll(/<a class="language-option"([^>]*)>([\s\S]*?)<\/a>/g)]
  const currentOption = options.find((option) => option[2].includes(`<span>${page.current}</span>`))
  const alternateOption = options.find((option) => option[2].includes(`<span>${page.alternate}</span>`))

  if (
    !trigger?.[3].includes(`<span>${page.current}</span>`)
    || !triggerAttributes.includes('aria-haspopup="menu"')
    || !triggerAttributes.includes('aria-expanded="false"')
    || !triggerAttributes.includes('aria-controls="language-options"')
  ) {
    console.error(`Language trigger is missing its current locale or ARIA contract in ${page.path}`)
    process.exit(1)
  }

  if (!switcher.includes('id="language-options"') || !switcher.includes('role="menu"')) {
    console.error(`Language options menu is missing its accessible identity in ${page.path}`)
    process.exit(1)
  }

  if (
    options.length !== 2
    || !currentOption?.[1].includes(`href="${page.currentHref}"`)
    || !currentOption[1].includes('role="menuitemradio"')
    || !currentOption[1].includes('aria-checked="true"')
    || !alternateOption?.[1].includes(`href="${page.alternateHref}"`)
    || !alternateOption[1].includes(`hrefLang="${page.alternate === '日本語' ? 'ja' : 'en'}"`)
    || !alternateOption[1].includes('role="menuitemradio"')
    || !alternateOption[1].includes('aria-checked="false"')
  ) {
    console.error(`Language options do not preserve the English/Japanese routes in ${page.path}`)
    process.exit(1)
  }
}

const css = readdirSync('out/_next/static/css')
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(`out/_next/static/css/${file}`, 'utf8'))
  .join('')
  .replace(/\r?\n/g, '')

if (!css.includes('@media(max-width:1100px){.menu-button{display:block}.nav-links{display:none')) {
  console.error('Built CSS does not collapse the expanded header before it wraps')
  process.exit(1)
}

console.log('PASS: language switcher exposes both supported locales with accessible selected state')
