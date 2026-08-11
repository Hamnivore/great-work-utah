import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { ContributePage } from './pages/Contribute'
import { HomePage } from './pages/Home'

const MapPage = lazy(() => import('./pages/Map').then((module) => ({ default: module.MapPage })))

// /p/*, /v/*, /about and friends are prerendered static HTML (scripts/prerender.mjs)
// and never reach this router in production. The app is only the three routes that
// genuinely need to run code: the home handoff, the contribute form, and the map.

function NotFound() {
  return (
    <div className="font-sans text-sm text-ink-soft">
      <p>404 — not found. Don't guess slugs.</p>
      <p className="mt-2">
        <a href="/search" className="text-twilight">
          search
        </a>
        {' · '}
        <a href="/v/index" className="text-twilight">
          master index
        </a>
        {' · '}
        <a href="/v/by-role" className="text-twilight">
          looking for work
        </a>
        {' · '}
        <a href="/v/guides" className="text-twilight">
          founding
        </a>
      </p>
      <p className="mt-2 text-xs">
        Agents:{' '}
        <a href="/llms.txt" className="text-twilight">
          /llms.txt
        </a>
        {' · '}
        <a href="/views/index.md" className="text-twilight">
          /views/index.md
        </a>
      </p>
    </div>
  )
}

function SiteRoutes() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isMap = location.pathname === '/map'

  return (
    <>
      {isHome ? (
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      ) : (
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5">
          <header className={`flex items-baseline justify-between border-b border-sandstone/50 py-4 ${isMap ? 'w-[min(1120px,calc(100vw-2.5rem))] self-center' : ''}`}>
            <Link to="/" className="font-display text-lg text-twilight no-underline">
              Great Work — Utah
            </Link>
            <nav className="flex flex-wrap gap-4 font-sans text-sm">
              <a href="/search" className="text-twilight-soft hover:text-twilight">
                search
              </a>
              <a href="/v/by-role" className="text-twilight-soft hover:text-twilight">
                looking for work
              </a>
              <Link to="/map" className="text-twilight-soft hover:text-twilight">
                map
              </Link>
              <a href="/v/guides" className="text-twilight-soft hover:text-twilight">
                founder resources
              </a>
              <a href="/about" className="text-twilight-soft hover:text-twilight">
                about
              </a>
              <Link to="/contribute" className="text-twilight-soft hover:text-twilight">
                contribute
              </Link>
            </nav>
          </header>
          <main className="flex-1 py-8">
            <Routes>
              <Route path="/contribute" element={<ContributePage />} />
              <Route
                path="/map"
                element={
                  <Suspense
                    fallback={<p className="font-sans text-sm text-ink-soft">Loading map...</p>}
                  >
                    <MapPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="border-t border-sandstone/50 py-4 font-sans text-xs text-ink-soft">
            A wiki of high-impact Utah work, written and maintained mostly by AI agents and reviewed
            by a human before anything publishes.{' '}
            <a href="/about" className="text-twilight">
              How this is made
            </a>
            . Agents: fetch{' '}
            <a href="/llms.txt" className="text-twilight">
              /llms.txt
            </a>
            .
          </footer>
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteRoutes />
    </BrowserRouter>
  )
}
