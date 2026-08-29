import { readFileSync } from 'node:fs'

const activeCodes = ['W0R1DCHAMP10NS26', 'HAJ1MAR1G1FT', 'CHAMP10N']
const archivedCodes = ['NA1CCHAMP', 'L12ARD0NPJCS26', 'DRAG0NDANCEPTC26']

const pages = [
  { path: 'out/index.html', codes: activeCodes, label: 'Copy' },
  { path: 'out/ja.html', codes: activeCodes, label: 'コピー' },
  { path: 'out/codes.html', codes: [...activeCodes, ...archivedCodes], label: 'Copy' },
]

for (const { path, codes, label } of pages) {
  const html = readFileSync(path, 'utf8')
  const rows = [...html.matchAll(/<div class="code-copy-row(?: compact)?">(.*?)<\/div>/gs)]
  const copyButtons = [...html.matchAll(/<button[^>]*data-copy-value="[^"]+"[^>]*>/g)]

  for (const code of codes) {
    const matchingRows = rows.filter((row) => row[1].includes(`>${code}</span>`))

    if (matchingRows.length !== 1) {
      console.error(`Expected exactly one copy row for ${code} in ${path}`)
      process.exit(1)
    }

    const row = matchingRows[0][1]
    const expectedButton = new RegExp(
      `<button(?=[^>]*type="button")(?=[^>]*data-copy-value="${code}")(?=[^>]*aria-label="${label} ${code}")[^>]*>`,
    )

    if (!expectedButton.test(row)) {
      console.error(`Missing accessible copy button for ${code} in ${path}`)
      process.exit(1)
    }

    if (!row.includes('aria-live="polite"') || !row.includes('aria-atomic="true"')) {
      console.error(`Copy feedback is not announced for ${code} in ${path}`)
      process.exit(1)
    }
  }

  if (rows.length !== codes.length || copyButtons.length !== codes.length) {
    console.error(`Unexpected number of copy controls in ${path}: ${copyButtons.length}`)
    process.exit(1)
  }
}

console.log('PASS: code copy buttons cover every primary code display without changing hero decorations')
