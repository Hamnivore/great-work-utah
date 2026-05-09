import { SearchSticky } from '../components/home-prototypes/SearchSticky'

/**
 * The front page.
 *
 * Promoted from /prototypes/home/search-sticky after the search
 * workshop. Two structural moves:
 *
 *   1. A thin sticky masthead pinned to the top — "GREAT WORK" set
 *      in tracked all-caps Caslon Display, with "Utah, USA" beneath.
 *      Reads as a newspaper masthead, not as a caption on whatever
 *      photograph happens to be on the cover today. Glass on photo
 *      at rest, paper-cream once you scroll past the cover.
 *
 *   2. The cover is a slow-rotating carousel of five featured
 *      entries (auto-advance every 7s, hover to pause, click a dot
 *      to jump). The variety carries the "this wiki is many things"
 *      signal the old single-cover "Featured · {domain}" kicker was
 *      doing the long way around.
 *
 * Search lives in the sticky bar. Click (or ⌘K) opens the polished
 * fullscreen panel — no header chrome, back button on the same
 * baseline as the input, suggestions as italic chips, featured
 * entries as paper cards.
 *
 * The previous front page (IssueHome — single cover, italic word-
 * mark, boxed Ask) is preserved at /prototypes/home/issue. Other
 * shapes the workshop tried live at /prototypes/home.
 *
 * The phonebook lives on at /directory.
 */
export function HomePage() {
  return <SearchSticky />
}
