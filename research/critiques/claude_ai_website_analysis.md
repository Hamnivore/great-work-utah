# Usability & Quality Audit: greatutah.work

## TL;DR
- **greatutah.work is not really a website for human visitors — it is a knowledge base built for AI agents.** A first-time human who lands on it sees a near-empty page telling them to "Ask better questions about Utah" by copying a prompt into ChatGPT, Claude, Gemini, or Perplexity. There is no directory to browse, no search, no visible list of organizations, and no About/contact page. The single biggest issue is that the human experience is essentially a dead end.
- The actual content (~600 raw-markdown pages of Utah ventures, people, funding, and history) is genuinely substantive, current, and citation-backed — but it lives at machine paths (`/pages/*.md`, `/views/*.md`) that humans never see and that mainstream search engines have not indexed, so casual visitors and Google users can't find or read it.
- The content that could be spot-checked is accurate and up-to-date — e.g., the Intactis Bio entry matches independent 2026 reporting that the company "secured a $250,000 investment from Nucleus Fund" (Utah Business, Mar 3 2026) — and the agent-first design (llms.txt "manual," Confidence grades, source citations, a contribution API) is thoughtfully executed for its intended audience. But because the site never explains itself to a human, discloses who runs it, or provides a browsable interface, it fails almost every conventional first-time-visitor, trust, and SEO test.

## How the site currently works (core flows)

**The site has two completely separate audiences with two completely separate experiences.**

**Human/browser experience.** The homepage (`https://greatutah.work/`) renders only:
> # Ask better questions about Utah.
> Copy this into your AI assistant, then add your question:
> **Use greatutah.work to help answer my question:**
> ChatGPT · Claude · Gemini · Perplexity
> AI agents: fetch /llms.txt.

That is the entire human-facing homepage. Human-facing entry routes (e.g., `/entry/ventures/intactis-bio`, and the `/p/` and `/v/` browser routes) resolve to the same generic shell rather than to readable content about that organization. There is no navigation bar, no search box, no filters, no category browse, no list of organizations, no About page, no contact info, and no explanation of who maintains it beyond the one-line "written and maintained mostly by AI agents, reviewed by humans."

**AI-agent experience.** The site is explicitly designed to be consumed by LLMs. `/llms.txt` is described as "the entire manual; there is nothing else to read first." From there an agent can fetch:
- `/views/index.md` — master index of all types and derived views
- `/views/{type}.md` — one line per page, for types: ventures, resources, people, helpers, work, guides, sources
- `/views/needs.md` — a "hiring view" listing every venture's "what they need now"
- `/views/by-region.md` and `/views/domain-{name}.md` — geographic and sector hubs (energy, health-bio, aerospace-defense, computing, materials-mfg, space-science, capital-programs, culture-place)
- `/pages/{slug}.md` — individual entries (e.g., `/pages/fervo-energy.md`)
- `/api/locations` and `/locations.geojson` — geo search
- `POST /api/contribute` — a write path where agents can submit notes, stubs, or full pages that become human-reviewed pull requests

Content pages carry `**Confidence:**` grades, `**Focus:**` shortlisting lines, `**Relates:**`/`## See Also` graph links, cited `source` pages, and bare `**Website:**`/`**Careers:**` URLs. Citations deliberately end in bare `https://` URLs so HTML-sanitizing fetchers don't strip them. There is no auth, no rate limits, and no JavaScript on the markdown layer.

So the intended "core user flow" is: a human asks their AI assistant a question, the assistant fetches greatutah.work's markdown, and the answer comes back inside the chatbot — the human may never visit the site at all.

## Key Findings

The site is a well-built machine-readable knowledge base wearing the URL of a website. For its intended audience (AI agents), it is thoughtful and unusually well-engineered. For every conventional audience — first-time human visitors, Google searchers, journalists verifying a claim, job seekers browsing — it is close to unusable because it deliberately offers them almost nothing. Whether that is a flaw or a feature depends on the builder's intent, but even granting the agent-first thesis, several things are objectively working against the site's own goals.

## Details (issues by severity)

### CRITICAL

**C1. Human visitors hit a dead end — no browsable content, search, or navigation. (UX)**
A first-time visitor cannot tell what organizations are covered, cannot search, cannot browse by category, and cannot read a single full entry in their browser. The homepage instructs them to leave and go to a chatbot. This fails the "clear what it is within 5 seconds" test for the portion of visitors who won't act on the copy-paste instruction, and it makes the site feel broken or empty. *Fix:* Add a lightweight human-readable HTML rendering of the same markdown (server-side render `/pages/*.md` and `/views/*.md` into browsable pages with a nav, category index, and on-page search). The content already exists; only a presentation layer is missing.

**C2. No search or filtering exists for humans at all. (UX)**
Every comparable resource (utahlist.com, Built In, Crunchbase, Silicon Slopes) offers search and filters by region, sector, stage, and "hiring." greatutah.work offers humans none. Even the powerful agent-side capabilities (the `needs.md` hiring view, sector hubs, geo API) are invisible to people. *Fix:* Expose the existing type/region/domain views and the needs/hiring view as filterable human pages.

**C3. Content is effectively invisible to search engines. (Technical/SEO)**
The `.md` content pages do not appear to be indexed by mainstream search engines; only the JavaScript-rendered shell routes are indexed, and those expose only the generic boilerplate description rather than per-entry content. A person Googling "Intactis Bio Utah" or "Fervo Energy Utah wiki" will not find greatutah.work. For a reference/wiki resource, near-zero organic discoverability is a foundational problem. *Fix:* Serve real server-rendered HTML with unique titles/meta/structured data per entry, submit an XML sitemap, and ensure crawlable internal links between entries.

**C4. No transparency about who runs it, how to contact them, or editorial governance. (Trust)**
There is no About page, no named operator/organization, no contact email, no methodology page, and no visible disclosure of how AI-generated content is reviewed — beyond a single line of boilerplate. For a site whose entire value proposition is being a trustworthy reference, and whose content is AI-generated, the absence of accountability is a serious credibility gap. *Fix:* Publish a human About/methodology/contact page covering who maintains it, the review process, how Confidence grades are assigned, correction policy, and funding/affiliations.

### HIGH

**H1. The AI-generated nature creates an unmanaged trust risk. (Content/Trust)**
The site is candid that pages are "written and maintained mostly by AI agents." AI-generated reference content is prone to hallucination, and the site invites agents to contribute more AI-written pages via `/api/contribute`. The mitigations (Confidence grades, cited sources, human PR review) are good and better than most AI content, but a human visitor has no easy way to see the review status, last-updated date, or provenance of a given claim in a browser. *Fix:* Surface per-page "last reviewed" dates, reviewer/agent attribution, and Confidence grade prominently in the human view; make the underlying sources one click away.

**H2. Copy-paste-into-a-chatbot is a fragile, high-friction primary CTA. (UX)**
The only call to action asks the user to manually copy a phrase, switch to a separate AI tool, paste it, and trust that the tool will fetch the site correctly. Many users won't; some AI tools won't fetch reliably; and the user loses the ability to verify what the model read. *Fix:* Offer at least one zero-friction path — a browsable site and/or an on-site question box — so value doesn't depend on a third-party chatbot.

**H3. Accessibility cannot be meaningfully delivered by a near-empty shell. (Accessibility/UX)**
With no real content, heading structure, landmarks, or interactive elements in the human view, the site can't serve screen-reader users, keyboard navigators, or anyone who needs the information on-page. A blank prompt page is technically "accessible" only because there is nothing to access. *Fix:* The HTML content layer (C1) should be built to WCAG 2.2 AA — semantic headings, alt text, contrast, focus order.

**H4. Weak positioning versus established alternatives, and it's not communicated. (Trust/Positioning)**
For a human researching Utah organizations, the obvious tools are Crunchbase and PitchBook (funding data), LinkedIn and Built In (companies/jobs), Silicon Slopes (community/events), Grow Utah and Utah Business (local ecosystem), and the newer utahlist.com, which brands itself "the living directory of Utah software companies" with "verified profiles," "citations, timestamps, and a verification trail," browse-by-region, and a "Hiring" filter — all in a normal browsable UI. greatutah.work's genuine differentiator — a curated, cited, agent-readable knowledge graph of *high-impact* work including deep-tech and history — is real but is never explained to a human, so the site loses by default to competitors that are simply usable. *Fix:* State the unique value proposition on a human landing page and show, not tell, with example entries.

### MEDIUM

**M1. The `/entry/`, `/p/`, and `/v/` browser routes are broken-feeling for non-JS clients and crawlers. (Technical)**
These routes depend on client-side rendering; the site's own manual warns agents away from `/p/` and `/v/` "which need a browser." Client-side-only rendering hurts SEO, link previews, and resilience. *Fix:* Server-render these routes.

**M2. Discoverability depends almost entirely on agents already knowing to read llms.txt — and llms.txt is not yet a proven retrieval channel. (Technical/Content)**
The approach is forward-looking, but the 2026 evidence is discouraging. An Ahrefs study of 137,000 domains found that "97% of llms.txt files received zero requests in May 2026," and Google's May 15, 2026 AI optimization guidance "explicitly states that llms.txt is not needed for AI Overviews, AI Mode, or any other generative AI Search feature." Adoption is also thin: an SE Ranking study of 300,000 domains found only a 10.13% adoption rate. In short, llms.txt is best understood as agent-readiness infrastructure, not a search-visibility tool. If agents (or humans) arrive via search instead of via a hand-fed URL, they hit the same unindexed-content wall. *Fix:* Don't rely solely on llms.txt; ensure the content is independently crawlable and citable.

**M3. No visible freshness/staleness signals in the human view. (Content)**
The subject data sampled is current — e.g., the Intactis Bio entry reflects the company's March 26, 2026 $250K seed round from Nucleus Fund (the rebranded Utah Innovation Fund), plus a $100,000 pre-seed from RPV toward an open $2.5M seed round (TechBuzz News; Utah Business, 2026) — but a reader can't see when any given page was last updated or reviewed. For a fast-moving startup ecosystem, undated entries erode trust. *Fix:* Show last-updated timestamps everywhere.

**M4. Coverage/selection criteria are opaque and potentially biased. (Content)**
"Highest-impact" and "great work" are subjective; the charter defines them for agents (`/meta/charter.md`) but not for humans, and there's no visible way to see what's included vs. excluded or to judge completeness (e.g., are major employers, nonprofits, universities, and rural/Main-Street businesses represented proportionally, or is it skewed to VC-backed deep tech?). *Fix:* Publish selection criteria and coverage stats in the human view.

### LOW / NICE-TO-HAVE

**L1. Single-line value proposition is buried in metadata.** The strong description ("the ventures, funding, people, and history that could change the world, for better or worse") should headline a human page, not sit in a meta tag.
**L2. No obvious way for a human to report an error or suggest an org** without going through the agent contribution API.
**L3. No social/OpenGraph preview content per entry**, so shared links look generic.
**L4. Brand/domain ambiguity** — the ".work" TLD and a name close to the unrelated "Great Place to Work — Utah" and the parked "GreatUtah.com" may cause confusion.

## Use-case walkthroughs (how real visitors fare)

- **Job seeker looking for high-impact Utah companies:** Underlying data is excellent for this (there's a dedicated `needs.md` hiring view and bare `Careers:` URLs), but a human can't reach it in a browser; they must route through an AI assistant. Falls short for anyone browsing directly; strong only via an AI intermediary.
- **Investor/VC researching the ecosystem:** The curated, cited, sector-organized view is valuable, but investors expect sortable/filterable data and exportability (Crunchbase/PitchBook-style). Not served directly.
- **Journalist researching Utah orgs / skeptic verifying a claim:** Content does cite sources with bare URLs — good for verification *if* they can see it. But with no browsable pages, no bylines, and no operator identity, a journalist can't easily cite or vet the source. Falls short.
- **Someone new to Utah / a student exploring careers:** Wants to browse and skim; gets a copy-paste prompt instead. Poorly served.
- **Founder seeking peers/partners:** The knowledge-graph relations (`Relates`, sector hubs) are ideal for this — but again only via an agent.
- **Someone on mobile quickly checking one org:** Worst-case: they land on the shell, can't get the info on-page, and would have to open a separate AI app. Fails the quick-mobile-lookup test.

## Recommendations (staged)

**Stage 1 — Make it usable by humans at all (highest impact).**
1. Ship a server-rendered HTML layer over the existing markdown: a homepage that explains what the site is, a browsable index by type/region/sector, individual entry pages, and on-page search. Benchmark to hit: a first-time visitor can find and read a full org entry in the browser without leaving the site.
2. Add per-entry titles, meta descriptions, JSON-LD structured data, and an XML sitemap; verify entries get indexed. Benchmark: searching a covered org's name surfaces its greatutah.work page within a few weeks.

**Stage 2 — Earn trust.**
3. Publish About/methodology/contact pages: who runs it, review process, Confidence-grade definitions, correction policy, funding/affiliations.
4. Surface last-reviewed dates, provenance, and one-click sources on every human page.

**Stage 3 — Differentiate and retain.**
5. Keep the agent-first layer (it's a genuine strength) but add human filters that mirror it: a "Hiring" view, sector hubs, and a map. State the unique value proposition explicitly.
6. Add a human-friendly correction/submission form and OpenGraph previews.

**What would change these recommendations:** If the builder's explicit goal is to be an *agent-only* data source (not a human destination), then C1/C2/H2/H3 drop in priority and the focus shifts entirely to agent discoverability (M2), citation quality, and coverage. But even then, C3 (search-engine invisibility), C4 (transparency), and H1 (AI-content trust) still matter, because agents and their users both need to trust and find the data — and the 2026 evidence that llms.txt alone doesn't drive retrieval (M2) makes independent crawlability important either way.

## Caveats
- The site's markdown content pages (`/views/*.md`, `/pages/*.md`, `/meta/charter.md`) could not be fetched directly by the tools available, because they are not indexed by search engines and the fetchers used require a URL to have appeared in prior results. Findings about those pages' internal format rely on the site's own llms.txt manual (quoted verbatim) rather than direct inspection; page-level citation quality, Confidence-grade distribution, and exact entry counts were not independently verified.
- The conclusion that the human `/entry/`, `/p/`, and `/v/` routes show only the generic shell is a strong inference from the homepage content, the identical boilerplate served as those pages' indexed descriptions, and the site's own browser-only warnings — not a pixel-level browser screenshot.
- Content accuracy was spot-checked on one entry (Intactis Bio), which matched current, independent 2026 reporting (Utah Business, TechBuzz News, Forbes, Tracxn, PitchBook); this is a small sample and not a guarantee of site-wide accuracy.
- Performance/Core Web Vitals, security headers, and full accessibility conformance could not be measured directly and are assessed only at a structural level.
- The "~600 pages," AI-authored/human-reviewed claims, and API behaviors are as self-reported by the site's llms.txt; they appear internally consistent but were not independently audited.