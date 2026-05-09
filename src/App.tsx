import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { DirectoryPage } from './pages/Directory'
import { EntryPage } from './pages/Entry'
import { TierSystemPage } from './pages/TierSystem'
import { HowItWorksPage } from './pages/HowItWorks'
import { MatchPage } from './pages/Match'
import { AskPage } from './pages/Ask'
import { RaiseHandPage } from './pages/RaiseHand'
import { TemplatesPage } from './pages/Templates'
import { MarkdownDemosPage } from './pages/MarkdownDemos'
import { NavbarPrototypesPage } from './pages/NavbarPrototypes'
import { NavbarShapePrototypesPage } from './pages/NavbarShapePrototypes'
import { HomePrototypesPage } from './pages/HomePrototypes'
import { HomePrototypeFullPage } from './pages/HomePrototypeFull'
import { PageTransitionProvider } from './lib/page-transitions'
import { SearchOverlayProvider } from './components/SearchOverlay'

function AppRoutes() {
  return (
    <PageTransitionProvider>
      {(location) => (
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/entry/:source/:slug" element={<EntryPage />} />
          <Route path="/tier-system" element={<TierSystemPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/match/:slug" element={<MatchPage />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/raise-hand" element={<RaiseHandPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route
            path="/templates/from-markdown"
            element={<MarkdownDemosPage />}
          />
          <Route
            path="/prototypes/navbar"
            element={<NavbarPrototypesPage />}
          />
          <Route
            path="/prototypes/navbar-shapes"
            element={<NavbarShapePrototypesPage />}
          />
          <Route path="/prototypes/home" element={<HomePrototypesPage />} />
          <Route
            path="/prototypes/home/:id"
            element={<HomePrototypeFullPage />}
          />
        </Routes>
      )}
    </PageTransitionProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SearchOverlayProvider>
        <AppRoutes />
      </SearchOverlayProvider>
    </BrowserRouter>
  )
}
