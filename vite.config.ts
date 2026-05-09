import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

function triggerApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'trigger-api',
    configureServer(server) {
      server.middlewares.use('/api/trigger-token', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        try {
          process.env.TRIGGER_SECRET_KEY = env.TRIGGER_SECRET_KEY
          const { auth } = await import('@trigger.dev/sdk/v3')
          const token = await auth.createTriggerPublicToken('search-agent')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ token }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), triggerApiPlugin(env)],
  }
})
