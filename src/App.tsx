import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import { MarkdownDoc } from './components/MarkdownDoc'
import { ContributePage } from './pages/Contribute'

const MapPage = lazy(() => import('./pages/Map').then((module) => ({ default: module.MapPage })))

function PageRoute() {
  const { slug = '' } = useParams()
  const clean = slug.replace(/\.md$/i, '')
  return <MarkdownDoc docPath={`pages/${clean}.md`} />
}

function ViewRoute() {
  const { view = '' } = useParams()
  const clean = view.replace(/\.md$/i, '')
  return <MarkdownDoc docPath={`views/${clean}.md`} />
}

function NotFound() {
  return (
    <div className="font-sans text-sm text-ink-soft">
      <p>404 — not found. Don't guess slugs.</p>
      <p className="mt-2">
        <Link to="/" className="text-twilight">
          home
        </Link>
        {' · '}
        <Link to="/v/needs" className="text-twilight">
          looking for work
        </Link>
        {' · '}
        <Link to="/v/guides" className="text-twilight">
          founding
        </Link>
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
        {' · '}
        <a href="/views/needs.md" className="text-twilight">
          /views/needs.md
        </a>
      </p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5">
        <header className="flex items-baseline justify-between border-b border-sandstone/50 py-4">
          <Link to="/" className="font-display text-lg text-twilight no-underline">
            Great Work — Utah
          </Link>
          <nav className="flex flex-wrap gap-4 font-sans text-sm">
            <Link to="/v/needs" className="text-twilight-soft hover:text-twilight">
              looking for work
            </Link>
            <Link to="/v/by-region" className="text-twilight-soft hover:text-twilight">
              by place
            </Link>
            <Link to="/map" className="text-twilight-soft hover:text-twilight">
              map
            </Link>
            <Link to="/v/guides" className="text-twilight-soft hover:text-twilight">
              founding
            </Link>
            <Link to="/contribute" className="text-twilight-soft hover:text-twilight">
              contribute
            </Link>
          </nav>
        </header>
        <main className="flex-1 py-8">
          <Routes>
            <Route path="/" element={<MarkdownDoc docPath="views/index.md" />} />
            <Route path="/p/:slug" element={<PageRoute />} />
            <Route path="/v/:view" element={<ViewRoute />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/map" element={<Suspense fallback={<p className="font-sans text-sm text-ink-soft">Loading map...</p>}><MapPage /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="border-t border-sandstone/50 py-4 font-sans text-xs text-ink-soft">
          A wiki of high-impact Utah work. Humans: browse above. Agents: fetch{' '}
          <a href="/llms.txt" className="text-twilight">
            /llms.txt
          </a>
          .
        </footer>
      </div>
    </BrowserRouter>
  )
}
