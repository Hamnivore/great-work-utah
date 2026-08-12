import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In production the build copies wiki/{pages,views,meta} into dist/. In dev, serve from wiki/.
function serveWiki(): Plugin {
  return {
    name: 'serve-wiki',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        const m = url.match(/^\/(pages|views|meta)\/([a-z0-9-]+\.md)$/)
        if (!m) return next()
        const file = path.join(import.meta.dirname, 'wiki', m[1], m[2])
        if (!fs.existsSync(file)) return next()
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
        res.end(fs.readFileSync(file))
      })
    },
  }
}

// Content routes are static HTML in production (scripts/prerender.mjs, served by
// Vercel's cleanUrls). Dev calls the same renderer per request so what you see
// locally is what ships — and so a page edit shows up on reload with no rebuild.
function servePrerendered(): Plugin {
  const ROUTES: [RegExp, string][] = [
    [/^\/p\/([a-z0-9-]+)$/, 'pages'],
    // The master index is published at the bare /v, the way cleanUrls serves an
    // index document; the capture is absent there and defaults to index.
    [/^\/v(?:\/([a-z0-9-]+))?$/, 'views'],
    [/^\/(about|charter|conventions|attributes)$/, 'meta'],
  ]
  return {
    name: 'serve-prerendered',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '').split('?')[0]
        if (url === '/llms.txt') {
          // The build expands corpus facts into the manual; do it here too so
          // dev never shows a raw token where production shows a number.
          const mod = await server.ssrLoadModule('/scripts/prerender.mjs')
          const raw = fs.readFileSync(path.join(import.meta.dirname, 'public', 'llms.txt'), 'utf8')
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(mod.expandBuildFacts(raw))
          return
        }
        if (url === '/search' || ROUTES.some(([re]) => re.test(url))) {
          // Imported per request so edits to the renderer take effect without a restart.
          const mod = await server.ssrLoadModule('/scripts/prerender.mjs')
          let html: string | null = null
          if (url === '/search') {
            html = mod.searchPage()
          } else {
            for (const [re, dir] of ROUTES) {
              const m = url.match(re)
              if (m) {
                html = mod.renderDocument(dir, m[1] ?? 'index')
                break
              }
            }
          }
          if (html) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(html)
            return
          }
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(mod.notFoundPage())
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serveWiki(), servePrerendered()],
})
