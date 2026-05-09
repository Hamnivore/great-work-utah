# Utah Data Sources (Scrape Targets)

We're planning to scrape these for canonical content, taxonomies, and starter data for both hackathon entries. Notes captured here for quick reference; raw scrapes will land in `data/` (gitignored if/when needed).

## 1. `startup.utah.gov` — Startup State Initiative

> Source: <https://startup.utah.gov/>

The state-run portal we're explicitly invited to "replace or enhance" in the GOEO hackathon. This is the **primary scrape target** for the Founder's Navigator.

### Top-level IA

- **Start Your Journey** — entry-point onboarding flow
- **Resources**
  - Create Your Business Plan
  - Resource List ← *this is the gold; full categorized resource directory*
- **Get Funding**
  - Pitch Competitions
  - Grants
  - Other Funding Sources
- **Why Utah?**
  - Events
  - News
- **Contact**

### Stated journeys (good seed for personalization buckets)

- "I'm thinking of starting my business"
- "Start my business"
- "Grow my business"
- "Close or sell my business"

### Notes

- Site is currently in **Beta** — they're actively soliciting feedback, which strengthens the case for replacing it.
- Run by Governor's Office of Economic Opportunity (GOEO). Branded as "the Startup Capital of the World."
- Designated by Gov. Spencer Cox (2023) — the political framing matters for the demo narrative.

## 2. `business.utah.gov` — GOEO Programs

> Source: <https://business.utah.gov/>

Parent department site. Useful for the **broader program catalog** (deeper than the Startup State portal alone).

### Programs & Services worth indexing

- APEX Accelerator
- Business Recruitment & Expansion
- Center for Rural Development
- International Trade & Diplomacy
- Opportunity Zones
- **Startup State Initiative** ← parent of `startup.utah.gov`
- UPSTART
- Utah Center for Global Talent
- Utah Film Commission
- Utah Office of Regulatory Relief
- Utah Office of Tourism
- Utah Small Business Credit Initiative

### Useful auxiliary content

- Accolades & Rankings (great for the "Why Utah?" investor view)
  - #1 Best Economic Outlook (Rich States Poor States, Apr 2026)
  - #2 Best State to Start a Business (WalletHub, Jan 2026)
  - #1 Most Independent State (WalletHub, Jun 2025)
- Community Data Profiles
- Targeted Industries
- Statewide Economic Development Contacts
- News feed (recent press releases — useful for "What's happening" surfaces)

## 3. `nucleusutah.org` — Nucleus Institute

> Source: <https://www.nucleusutah.org/>

Already summarized in [`nucleus-overview.md`](./nucleus-overview.md). For the Nucleus track, we should also pull:

- `/contact` — current "connections hub" form (the thing we're replacing)
- Programs subpages: Nucleus Fund, Nucleus Grow, PolicyLab, MarketEdge, UTIF
- Newsroom (signal of who's active in the ecosystem)

## 4. Reference (don't scrape, just look at)

- [pampam.city/utah-startup-map](https://pampam.city/utah-startup-map) — reference design for the Utah Startup Map deliverable.

## Scraping Plan (rough)

- Static pages → straight HTTP fetch + HTML parse (e.g., `httpx` + `selectolax` / `beautifulsoup4`).
- Resource List is likely the densest page — handle pagination / dynamic loading if present.
- Cache raw HTML to disk; parse separately so we can iterate on extractors without re-hitting servers.
- Respect `robots.txt` and rate-limit politely; these are public state sites but we should be good citizens.
- Final structured output: JSON or SQLite, normalized to a shared schema across both hackathon tracks (resource taxonomy + persona/journey tags).
