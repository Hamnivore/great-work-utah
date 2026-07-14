import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { hardenMarkdown, loadSourceUrls } from './scripts/lib/harden-md.mjs' // typed via scripts/lib/harden-md.d.ts

// In production the build hardens+copies wiki into dist/. In dev, serve from wiki/
// with the same Evidence/See Also hardening so WebFetch tests match production.
function serveWiki(): Plugin {
  const pagesDir = path.join(import.meta.dirname, 'wiki', 'pages')
  let sourceUrl: Map<string, string> | null = null
  const urls = () => {
    if (!sourceUrl) sourceUrl = loadSourceUrls(pagesDir, fs)
    return sourceUrl
  }
  return {
    name: 'serve-wiki',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        const m = url.match(/^\/(pages|views|meta)\/([a-z0-9-]+\.md)$/)
        if (!m) return next()
        const file = path.join(import.meta.dirname, 'wiki', m[1], m[2])
        if (!fs.existsSync(file)) return next()
        let body = fs.readFileSync(file, 'utf8')
        if (m[1] === 'pages') body = hardenMarkdown(body, urls())
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
        res.end(body)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serveWiki()],
})
