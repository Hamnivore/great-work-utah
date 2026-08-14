import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

type DevApiResponse = {
  setHeader(name: string, value: string): void
  status(code: number): DevApiResponse
  json(data: unknown): void
  end(): void
}

function readBody(req: NodeJS.ReadableStream) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

// Vercel discovers api/*.ts as functions in production. Vite otherwise treats
// those same URLs as source modules, so response.json() sees "import ..." in dev.
function serveApi(): Plugin {
  return {
    name: 'serve-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = new URL(req.url || '/', 'http://localhost')
        const modulePath = requestUrl.pathname === '/api/locations'
          ? '/api/locations.ts'
          : requestUrl.pathname === '/api/geocode'
            ? '/api/geocode.ts'
            : requestUrl.pathname === '/api/search'
              ? '/api/search.ts'
              : null
        if (!modulePath) return next()

        const query: Record<string, string | string[]> = {}
        for (const key of new Set(requestUrl.searchParams.keys())) {
          const values = requestUrl.searchParams.getAll(key)
          query[key] = values.length === 1 ? values[0] : values
        }
        const response: DevApiResponse = {
          setHeader: (name, value) => res.setHeader(name, value),
          status(code) {
            res.statusCode = code
            return response
          },
          json(data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify(data))
          },
          end: () => res.end(),
        }

        try {
          const body = ['POST', 'PUT', 'PATCH'].includes(req.method || '') ? await readBody(req) : undefined
          const mod = await server.ssrLoadModule(modulePath)
          await mod.default({ method: req.method, headers: req.headers, query, body }, response)
        } catch (error) {
          if (res.headersSent) return res.end()
          res.statusCode = 500
          response.json({ ok: false, error: { message: error instanceof Error ? error.message : String(error) } })
        }
      })
    },
  }
}

// vercel.json 308s only run on Vercel. Replay the exact (no `:param`) ones in
// dev so a renamed page does not 404 when you still have the old URL open.
function serveRedirects(): Plugin {
  return {
    name: 'serve-redirects',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        const config = JSON.parse(
          fs.readFileSync(path.join(import.meta.dirname, 'vercel.json'), 'utf8'),
        ) as { redirects?: { source: string; destination: string; statusCode?: number }[] }
        const hit = (config.redirects || []).find((r) => !r.source.includes(':') && r.source === url)
        if (!hit) return next()
        res.statusCode = hit.statusCode || 308
        res.setHeader('Location', hit.destination)
        res.end()
      })
    },
  }
}

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

function metaNames() {
  return fs
    .readdirSync(path.join(import.meta.dirname, 'wiki', 'meta'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

// Content routes are static HTML in production (scripts/prerender.mjs, served by
// Vercel's cleanUrls). Dev calls the same renderer per request so what you see
// locally is what ships — and so a page edit shows up on reload with no rebuild.
function servePrerendered(): Plugin {
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
        const pageMatch = url.match(/^\/p\/([a-z0-9-]+)$/)
        const viewMatch = url.match(/^\/v(?:\/([a-z0-9-]+))?$/)
        const metaMatch = url.match(/^\/([a-z0-9-]+)$/)
        const metaName =
          metaMatch && metaNames().includes(metaMatch[1]) ? metaMatch[1] : null
        if (url === '/search' || pageMatch || viewMatch || metaName) {
          // Imported per request so edits to the renderer take effect without a restart.
          const mod = await server.ssrLoadModule('/scripts/prerender.mjs')
          let html: string | null = null
          if (url === '/search') html = mod.searchPage()
          else if (pageMatch) html = mod.renderDocument('pages', pageMatch[1])
          else if (viewMatch) html = mod.renderDocument('views', viewMatch[1] ?? 'index')
          else if (metaName) html = mod.renderDocument('meta', metaName)
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
  plugins: [react(), tailwindcss(), serveApi(), serveRedirects(), serveWiki(), servePrerendered()],
})
