import { Link, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { usePageTransition } from '../lib/page-transitions'

interface LayoutProps {
  children: ReactNode
  /** When set, shows a back chevron at top-left with this label */
  backLabel?: string
  /** Optional explicit destination; defaults to `navigate(-1)` behavior */
  backTo?: string
  /** Hide the sticky page header (e.g. on Home where the cover IS the masthead) */
  hideHeader?: boolean
}

export function Layout({ children, backLabel, backTo, hideHeader = false }: LayoutProps) {
  const navigate = useNavigate()
  const { markNextNavAs } = usePageTransition()

  function handleBack() {
    // Tell the transition coordinator that this is conceptually a pop,
    // even though `navigate(backTo)` is technically a PUSH. The keyframes
    // in index.css then animate the destination in from the left while
    // the current page recedes to the right — same feel as a real
    // browser back, which is detected separately via navigationType.
    markNextNavAs('back')
    if (backTo) {
      navigate(backTo)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {!hideHeader && (
        <header className="sticky top-0 z-10 backdrop-blur-sm bg-paper/85 border-b border-sandstone/30">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-3">
            {backLabel ? (
              <button
                type="button"
                onClick={handleBack}
                className="text-twilight hover:text-orange font-serif italic text-sm transition-colors"
              >
                ← {backLabel}
              </button>
            ) : (
              <Link to="/" className="block">
                <div className="font-display italic text-twilight text-xl leading-none">
                  Great Work
                </div>
                <div className="smallcaps mt-0.5">Utah, USA</div>
              </Link>
            )}
          </div>
        </header>
      )}

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-6 sm:py-10">{children}</main>

      <footer className="max-w-3xl mx-auto px-5 sm:px-8 py-12 mt-8 border-t border-sandstone/30">
        <p className="font-serif italic text-sm text-ink-soft leading-relaxed">
          A travel guide to the great work being done in Utah.
          <br />
          Built on an LLM-maintained wiki that compounds knowledge over time.
        </p>
        <p className="smallcaps mt-4">
          <Link to="/tier-system" className="hover:text-twilight">
            The tier system
          </Link>
          {' · '}
          <Link to="/raise-hand" className="hover:text-twilight">
            Raise your hand
          </Link>
        </p>
      </footer>
    </div>
  )
}
