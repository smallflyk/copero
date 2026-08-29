import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const roots = ['app', 'components', 'content', 'data']
const sourceExtensions = new Set(['.ts', '.tsx', '.md', '.mdx', '.json'])
const forbiddenPlaceholders = ['待确认', '暂无']
const failures = []

function scan(path) {
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) scan(join(path, entry))
    return
  }

  if (!sourceExtensions.has(extname(path))) return

  const lines = readFileSync(path, 'utf8').split('\n')
  lines.forEach((line, index) => {
    for (const placeholder of forbiddenPlaceholders) {
      if (line.includes(placeholder)) {
        failures.push(`${relative(process.cwd(), path)}:${index + 1} contains ${placeholder}`)
      }
    }
  })
}

roots.forEach(scan)

if (failures.length) {
  console.error(`Found ${failures.length} untranslated Chinese placeholder occurrences:`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log('PASS: no untranslated Chinese placeholders in site source')
