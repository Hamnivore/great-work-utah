// Shared markdown hardening for HTML-sanitizing fetchers (Cursor WebFetch).
// After [text](slug.md) in Evidence / See Also / Relates, append · `/pages/slug.md`
// and the source page's **URL:** absolute when available. Idempotent.

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

export function loadSourceUrls(pagesDir, fs) {
  const map = new Map()
  for (const f of fs.readdirSync(pagesDir)) {
    if (!f.endsWith('.md')) continue
    const raw = fs.readFileSync(`${pagesDir}/${f}`, 'utf8')
    const m = raw.match(/^\*\*URL:\*\* (\S+)/m)
    if (m) map.set(f, m[1])
  }
  return map
}

function hardenLine(line, sourceUrl) {
  if (!line.includes('](')) return line
  if (/\]\([^)]+\)\s*·\s*`\/pages\//.test(line)) return line
  return line.replace(LINK_RE, (full, _text, href) => {
    if (/^https?:\/\//i.test(href)) {
      if (line.includes(`· ${href}`)) return full
      return `${full} · ${href}`
    }
    const slugFile = href.replace(/^\.\//, '')
    if (!/^[a-z0-9-]+\.md$/i.test(slugFile)) return full
    const extras = [`\`/pages/${slugFile}\``]
    const url = sourceUrl?.get(slugFile)
    if (url) extras.push(url)
    return `${full} · ${extras.join(' · ')}`
  })
}

export function hardenMarkdown(raw, sourceUrl = new Map()) {
  let out = raw
  for (const heading of ['Evidence', 'See Also']) {
    const re = new RegExp(`(## ${heading}\\n)([\\s\\S]*?)(?=\\n## |$)`)
    out = out.replace(re, (_, head, body) => {
      const lines = body.split('\n').map((line) => hardenLine(line, sourceUrl))
      return head + lines.join('\n')
    })
  }
  out = out.replace(/^(\*\*Relates:\*\* .+)$/gm, (line) => hardenLine(line, sourceUrl))
  return out
}
