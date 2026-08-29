import { readdirSync, readFileSync } from 'node:fs'

const html = readFileSync('out/index.html', 'utf8')
const footer = html.match(/<footer class="footer">(.*?)<\/footer>/s)?.[1]

if (!footer) {
  console.error('Footer not found in out/index.html')
  process.exit(1)
}

const descriptionColumn = footer.match(/<div class="footer-grid wrap"><div>(.*?)<\/div><div>/s)?.[1]
const paragraphs = [...(descriptionColumn || '').matchAll(/<p(?: class="[^"]+")?>(.*?)<\/p>/gs)]
const expected = 'PokémonChampions.pro is an unofficial fan-made guide and is not affiliated with Nintendo, The Pokémon Company, Game Freak, or any official Pokémon brand.'

if (paragraphs.length !== 1 || !paragraphs[0][1].includes(expected)) {
  console.error(`Expected one footer description with the approved copy, found ${paragraphs.length}`)
  process.exit(1)
}

for (const [path, removedLabels, retainedLinks, bodyLabels] of [
  [
    'out/index.html',
    ['Official Discord', 'Official YouTube', 'Pending confirmation'],
    [
      ['Official Website', 'https://champions.pokemon.com/en-us/'],
      ['About', '/about'],
      ['Privacy Policy', '/privacy-policy'],
      ['Terms', '/terms'],
    ],
    ['Official Discord', 'Official YouTube', 'Pending confirmation'],
  ],
  [
    'out/ja.html',
    ['公式 Discord', '公式 YouTube', '未確認'],
    [
      ['公式サイト', 'https://champions.pokemon.com/en-us/'],
      ['このサイトについて', '/about'],
      ['プライバシーポリシー', '/privacy-policy'],
      ['利用規約', '/terms'],
    ],
    ['公式 Discord', '公式 YouTube', '未確認'],
  ],
]) {
  const page = readFileSync(path, 'utf8')
  const pageFooter = page.match(/<footer class="footer">(.*?)<\/footer>/s)?.[1]

  if (!pageFooter) {
    console.error(`Footer not found in ${path}`)
    process.exit(1)
  }

  if (removedLabels.some((label) => pageFooter.includes(label))) {
    console.error(`Footer still contains an unverified community link in ${path}`)
    process.exit(1)
  }

  const footerLinks = [...pageFooter.matchAll(/<a([^>]*)>(.*?)<\/a>/gs)]
  const missingRetainedLink = retainedLinks.some(([label, href]) => !footerLinks.some((link) => (
    link[1].includes(`href="${href}"`) && link[2].includes(label)
  )))

  if (missingRetainedLink) {
    console.error(`Footer lost a retained official or legal link in ${path}`)
    process.exit(1)
  }

  const pageWithoutFooter = page.replace(/<footer class="footer">.*?<\/footer>/s, '')
  if (bodyLabels.some((label) => !pageWithoutFooter.includes(label))) {
    console.error(`Homepage research cards were removed outside the footer in ${path}`)
    process.exit(1)
  }
}

const css = readdirSync('out/_next/static/css')
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(`out/_next/static/css/${file}`, 'utf8'))
  .join('')

if (css.includes('.footer .pending-link')) {
  console.error('Built CSS still contains the removed footer placeholder style')
  process.exit(1)
}

console.log('PASS: footer keeps approved copy and removes unverified community links')
