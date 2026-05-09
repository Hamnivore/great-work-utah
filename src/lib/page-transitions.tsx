import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import {
  useLocation,
  useNavigationType,
  type Location,
} from 'react-router-dom'

/**
 * Page-transition coordinator
 * ----------------------------------------------------------------------
 * Slides one route over another using the View Transitions API.
 *
 * The provider owns the *rendered* location: react-router's actual
 * location can update freely (a `Link` click, a `navigate()` call, the
 * browser back button), but the `<Routes>` keeps showing the previous
 * location until we commit. Committing happens inside
 * `document.startViewTransition()` via `flushSync`, which is what makes
 * the browser take the "old" snapshot before the swap and the "new"
 * snapshot after — without that gating, `<Routes>` would render the
 * new page before the transition starts and the animation would have
 * nothing to animate from.
 *
 * Direction:
 *   - Components that initiate a forward push call `markNextNavAs('next')`
 *     right before `navigate(...)`. The provider sees the explicit hint,
 *     applies the `vt-slide-next` class on <html>, and the keyframes in
 *     index.css push the new page in from the right.
 *   - The browser back/forward buttons surface as `useNavigationType()`
 *     returning `'POP'`. The provider implicitly treats POP as 'back'
 *     and applies `vt-slide-back`.
 *   - Components that initiate a programmatic back (the chrome's "←
 *     Back" button) call `markNextNavAs('back')` so a `navigate('/')`
 *     still feels like a pop, even though react-router records it as a
 *     PUSH.
 *
 * Anything we don't explicitly mark and isn't a POP renders instantly
 * with no animation — most navigations in the guide should still be
 * instant.
 */

type Direction = 'next' | 'back'

const PageTransitionContext = createContext<{
  markNextNavAs: (dir: Direction) => void
} | null>(null)

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext)
  if (!ctx) {
    throw new Error(
      'usePageTransition() must be used inside a <PageTransitionProvider>',
    )
  }
  return ctx
}

function supportsViewTransitions(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function'
  )
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

interface PageTransitionProviderProps {
  /**
   * Render-prop receives the location the routes should render against.
   * Pass it to `<Routes location={...}>` so the rendered tree lags the
   * "real" location until we commit it inside a view transition.
   */
  children: (renderedLocation: Location) => ReactNode
}

export function PageTransitionProvider({
  children,
}: PageTransitionProviderProps) {
  const location = useLocation()
  const navType = useNavigationType()
  const [renderedLocation, setRenderedLocation] = useState<Location>(location)
  // Set by `markNextNavAs` right before a programmatic navigate(). Read
  // (and consumed) by the next location-change effect.
  const explicitDirRef = useRef<Direction | null>(null)

  useEffect(() => {
    // Compare keys, not pathnames — the same path can navigate to itself
    // (e.g. clicking the active link) and we still want to animate; keys
    // change every navigation while pathnames may not.
    if (location.key === renderedLocation.key) return

    const explicitDir = explicitDirRef.current
    explicitDirRef.current = null

    // POP fires for browser back/forward, which we always treat as a
    // back-slide. PUSH/REPLACE are silent unless someone opted in.
    const dir: Direction | null =
      explicitDir ?? (navType === 'POP' ? 'back' : null)

    if (!dir || !supportsViewTransitions() || prefersReducedMotion()) {
      setRenderedLocation(location)
      return
    }

    const root = document.documentElement
    const cls = `vt-slide-${dir}`
    root.classList.add(cls)

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setRenderedLocation(location)
      })
    })

    transition.finished.finally(() => {
      root.classList.remove(cls)
    })
  }, [location, navType, renderedLocation.key])

  return (
    <PageTransitionContext.Provider
      value={{
        markNextNavAs: (dir) => {
          explicitDirRef.current = dir
        },
      }}
    >
      {children(renderedLocation)}
    </PageTransitionContext.Provider>
  )
}
