import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import { MarkdownDoc } from './components/MarkdownDoc'
import { ContributePage } from './pages/Contribute'

function PageRoute() {
  const { slug } = useParams()
  return <MarkdownDoc docPath={`pages/${slug}.md`} />
}

function ViewRoute() {
  const { view } = useParams()
  return <MarkdownDoc docPath={`views/${view}.md`} />
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5">
        <header className="flex items-baseline justify-between border-b border-sandstone/50 py-4">
          <Link to="/" className="font-display text-lg text-twilight no-underline">
            Great Work — Utah
          </Link>
          <nav className="flex gap-4 font-sans text-sm">
            <Link to="/v/needs" className="text-twilight-soft hover:text-twilight">
              needs
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
          </Routes>
        </main>
        <footer className="border-t border-sandstone/50 py-4 font-sans text-xs text-ink-soft">
          Raw markdown at stable URLs. AI agents: fetch{' '}
          <a href="/llms.txt" className="text-twilight">
            /llms.txt
          </a>{' '}
          — this site is built for you.
        </footer>
      </div>
    </BrowserRouter>
  )
}
