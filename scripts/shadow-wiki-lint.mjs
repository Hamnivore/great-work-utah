import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = path.resolve(import.meta.dirname, '..', 'shadow_wiki')
const contentRoot = path.join(root, 'wiki')
const indexPath = path.join(contentRoot, 'index.md')
const excluded = new Set(['index.md', 'log.md'])
const findings = []

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

if (!fs.existsSync(indexPath)) findings.push('missing shadow_wiki/wiki/index.md')

const index = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : ''
const articles = walk(contentRoot).filter((file) => file.endsWith('.md') && !excluded.has(path.basename(file)))

for (const file of articles) {
  const relative = path.relative(contentRoot, file)
  const parts = relative.split(path.sep)
  const body = fs.readFileSync(file, 'utf8')
  if (parts.length !== 2) findings.push(`${relative}: articles must be exactly one topic directory deep`)
  if (!/^# .+/m.test(body)) findings.push(`${relative}: missing H1 title`)
  for (const field of ['Sources', 'Raw', 'Updated']) {
    if (!new RegExp(`^> ${field}:`, 'm').test(body)) findings.push(`${relative}: missing ${field} header`)
  }
  for (const section of ['Overview', 'Impact', 'Evidence', 'Open Questions']) {
    if (!body.includes(`## ${section}`)) findings.push(`${relative}: missing ${section} section`)
  }
  if (!index.includes(`](${relative.split(path.sep).join('/')})`)) findings.push(`${relative}: missing from index`)
}

if (findings.length) {
  console.error(`shadow-wiki-lint: ${findings.length} issue(s)`) 
  for (const finding of findings) console.error(`- ${finding}`)
  process.exitCode = 1
} else {
  console.log(`shadow-wiki-lint: checked ${articles.length} article(s); no issues`)
}
