import { createContext, useContext } from 'react'

interface SearchOverlayContextValue {
  isOpen: boolean
  openSearch: (initialValue?: string) => void
  closeSearch: () => void
}

export const SearchOverlayContext =
  createContext<SearchOverlayContextValue | null>(null)

export function useSearchOverlay() {
  const ctx = useContext(SearchOverlayContext)
  if (!ctx) {
    throw new Error('useSearchOverlay must be used inside SearchOverlayProvider')
  }
  return ctx
}
