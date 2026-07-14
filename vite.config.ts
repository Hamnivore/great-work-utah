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

export default defineConfig({
  plugins: [react(), tailwindcss(), serveWiki()],
})
