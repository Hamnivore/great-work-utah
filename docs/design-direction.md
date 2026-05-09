# Design Direction

> **The soul:** Atlas Obscura for Utah's great work and the people who do it. A *travel guide* for ambition — calm, readable, opinionated, and built for exploration. The same feeling you get clicking around Atlas Obscura: "wait, that's a thing? where? tell me more."

Sam's reference collection lives in [`pinterest-a-love-letter-to-utah/`](./pinterest-a-love-letter-to-utah/), grouped into `color-ideas/`, `font-ideas/`, and `layout-n-misc/`. This doc distills it.

## Chosen Direction: D — Hybrid

Locked in after exploring four directions. See renders in [`design-direction-renders/`](./design-direction-renders/).

- `direction-a-editorial.png` — magazine-cover energy, photo-led
- `direction-b-typographic.png` — book-interior energy, Caslon-led
- `direction-c-postcard.png` — desert-postcard energy, place-led
- **`direction-d-hybrid.png`** ← chosen
- `ask-interface-mobile.png` — Ask interface, three states (empty / streaming / complete)
- `ask-interface-desktop.png` — Ask interface, desktop two-column layout
- `app-flow.png` — End-to-end mobile flow (Discover → Ask → Entry → Person → Hand-raise → Guide / Match) with the LLM-wiki agent layer underneath

**Direction D = B as default + A as featured treatment.** Same card grammar everywhere; the visual fill adapts to the content. The ~10–15 entries that earn a great photograph get the full editorial spread (Direction A); the rest get the typographic spread (Direction B). Same masthead, same recommendation voice, same color palette, same Caslon — judges shouldn't be able to tell which entry was "the one we had a good photo for."

## The Three-Word Test

Every screen should feel:

1. **Calming** — generous space, no jitter, no notifications-anxiety, no "you must act now."
2. **Readable** — Caslon set with care, body text you'd actually want to read, type that doesn't fight you.
3. **Exploratory** — one click leads to another and another. Wandering is the intended verb. Surprise is the intended emotion.

If a screen fails any of the three, redesign.

## Reference Vibes (in priority order)

1. **Atlas Obscura** — local, specific, surprising. Each entry feels like a hidden gem someone wanted you to know about.
2. **A great travel magazine** — *Travel + Leisure*, *Conde Nast Traveler*, *Field Mag*, *Monocle*. Cover-driven, contents-page rhythm, beautiful spreads, photographic anchors.
3. **The Obscura magazine cover** in our refs (Voices of the Contemporary, Winter 2012) — masthead-led, a single human portrait, pull-quote subtitle, restrained.
4. **Gospel Library reading view** — useful as a typography reference for *long-form on mobile done well*: generous line height, calm dark surface, headings that breathe. We're borrowing the typographic discipline, not the tone.
5. **Stripe Press, Are.na, Field Mag** — modern editorial that doesn't try to look like an app.
6. **Smash Bros / Tekken tier lists** — for the spirit of contextual guide rankings. Confident, plainly-stated judgments for a specific audience. Opinionated, slightly playful, fun to argue with.

What we're explicitly *not* shopping for: Notion-clones, Vercel-clone landing pages, generic SaaS dashboards, LinkedIn / Wellfound / Indeed.

## Type

### Primary: Caslon

**Caslon for everything that carries editorial weight** — headlines, entry titles, pull-quotes, section headers, names of people and projects. Caslon Italic is a star: pull-quotes and "what they're trying to do" lines should lean on it.

Why Caslon:
- Calm and warm — easy on the eyes for long reads
- Has personality without shouting — looks human, not corporate
- Italic forms are genuinely beautiful, perfect for pull-quotes
- A *travel magazine* font, not a tech-startup font

Web implementation options (decide at build time):
- **Adobe Caslon Pro** via Adobe Fonts (paid; cleanest cut)
- **Libre Caslon Text** (Google Fonts; free; good)
- **Big Caslon** for display sizes
- Test Caslon at body size on mobile early — some cuts get fragile below 16px

### Companion: a quiet sans for UI chrome

Caslon shouldn't carry navigation, buttons, captions, or form fields. Pair it with a near-invisible modern sans:

- **Inter** (default safe choice; system-feeling)
- **ABC Diatype** or **Söhne** (more editorial; paid)
- System UI stack as a fallback

Two-font rule: Caslon for content, sans for chrome. No third typeface.

## Color: the Utah Desert Palette

Drawn from Sam's color-ideas refs (Bryce Canyon, sandstone-and-sky combos). Specifically *not* the generic blue-purple SaaS gradient.

| Role | Name | Hex | Use |
|---|---|---|---|
| Page background (light) | **Cream / Almond** | `#F5DFC5` *(or near-white `#FAF6EE`)* | Default body background |
| Surface / card | **Sandstone / Khaki** | `#CBB093` | Elevated cards, sidebars |
| Primary accent (warm) | **Sandstone Orange / Fawn** | `#D37945` | Tier marks, key callouts |
| Deep accent | **Redwood / Rust** | `#A4624D` *(or deeper `#81401B`)* | Pull-quote highlight, headlines |
| Body type | **Deep Ink** | `#2A1F18` *(deep warm brown-black, not pure black)* | All running text |
| Cool counter (interactive) | **Twilight Blue** | `#386775` | Links, focus states, "ask" affordance |
| Sky / quiet cool | **Sky Blue** | `#C7D7DF` | Quiet section dividers, chips |

Dark mode: invert thoughtfully. The Gospel Library screenshot is a useful template — deep neutral background, Caslon set in cream. Save dark mode for v1.5 unless trivial.

**No pure white, no pure black.** Both feel sterile against the desert palette.

## Layout Grammar (the "travel magazine" rules)

Design-system bones we apply consistently:

- **Generous margins.** Magazines breathe. We breathe.
- **Strong vertical rhythm.** Type sets on a baseline grid; headings don't float arbitrarily.
- **Editorial hierarchy:** Display Caslon (entry titles) → Caslon italic pull-quote → body Caslon → small sans caption / metadata.
- **One image per "spread"** when imagery is used. No image walls. The image earns its placement.
- **Recommendations are confident, not coy.** When a guide ranks options, the criteria should be visible and the judgment should be plainly stated. Smash Bros tier list energy belongs in contextual guides, not as a universal score stamped on every entity.
- **"Why it matters" is the pull-quote slot** on every entry — set big, italic, in a warmer color.
- **Citations are first-class typography**, not footnotes in 10pt grey. Every recommendation, every claim — visibly sourced. (Especially important since guides and matches make real judgments about real organizations and people.)

## Voice (copywriting)

A travel guide written by someone who lives here, knows everyone, and is genuinely fascinated by what's being built.

- **Curious.** The voice of someone who finds this stuff actually interesting and wants you to find it interesting too. Atlas Obscura entries always sound like the writer just discovered the thing themselves.
- **Specific.** Names, places, dates. ("Founded in a basement in Lehi, 2017.") Not "innovative startup."
- **Confident enough to recommend in public.** "For first-time medical-device founders, start here because..." No corporate hedging, no apology for having an opinion, but always name the audience and evidence.
- **Inviting.** "Worth knowing" beats "world-class." Bring people in, don't gate-keep.
- **Local-knowing without insidery.** A first-time visitor should feel welcomed; a longtime local should feel *seen*.
- **Calm, not muted.** Personality is welcome — wit is welcome — superlatives are not. We don't have to whisper to be calming.

The voice for Priya's `Ask` answer should feel like a knowledgeable friend writing back over email, not a chatbot. Possibly a friend with a sense of humor.

## What This Means for Each Home-Screen Element

- **Masthead** — the slim header that lives on every screen. "Great Work" set in small Caslon italic, optionally with "UTAH, USA" below in tracked-out small caps. Carries the back chevron when relevant ("← Back to Spiral Jetty"). No tab bar, no hamburger unless we run out of options later.
- **Search / Ask bar** — *persistent, just below the masthead, on every screen.* A calm Caslon-italic input field reading "Ask the guide anything." This is the primary interaction; it shouldn't be tucked away.
- **Suggestions under the search** — a row of italic-Caslon prompts (desktop) or stacked italic-Caslon questions (mobile). See *Suggested Questions* below.
- **Showcase** — the *cover and contents* of this issue of the guide. One large photographic / typographic spread of a single piece of great work, with a contents-page rhythm of more below. Same card grammar throughout; different visual fill (photo when one earns it, typography otherwise).

> **Deferred:** Ranking controls. Worth keeping in our back pocket for v1.5 if we want a kinetic way to widen or narrow a guide. For the demo, guides explain their own criteria.

## The Ask Interface

Ask is not a chatbot. **Ask is article generation.** The user types a question; the guide writes them an article in response.

- **The article appears live** as it's being written (streaming). It feels like reading the piece over the editor's shoulder as they write it.
- **Length is responsive to question depth.** "When was Recursion founded?" gets a one-sentence answer with a single citation. "Who in Utah is working on AI for biology?" gets a 6-paragraph essay with multiple cited entities. Same template, different lengths.
- **Browser back is the conversation history.** No chat thread state, no message bubbles, no "scroll up to find what I asked." The user can just hit back to retrieve a previous answer.
- **A persistent Ask bar lives at the top of every article** — to refine or follow up, the user just asks a new, sharper question, which generates a new article. (This implicitly trains people toward better questions, which is what we want.)
- **Every article has a URL.** Priya can text Helen a link to "the article I asked about Ben." That's a viral loop a chat thread can't do.
- **Articles file back into the wiki.** Per the Karpathy pattern: "good answers can be filed back as new pages." Ask history compounds.
- **Citations are first-class.** Every claim links back to a wiki entry or a primary source. Citations stack at the bottom of the article in the same Caslon italic typography as the rest of the body — *not* small grey footnote text.
- **"Related" exit ramps** at the bottom of every article — calm wandering: "You might also want to read…" with 2–4 related entries rendered as magazine-style cards.

### Editorial Conventions (adopt across the app)

These came out of the Ask interface renders and should apply universally to any article-shaped surface (Ask answers, entry pages, hand-raise summaries, etc.):

- **Related-article cards:** thumbnail + Caslon serif headline + small-caps caption like `8 MIN READ`. Sets editorial expectation and signals the next article is worth its own time.
- **Inline citations:** entity mentions are inline hyperlinks in twilight blue Caslon italic underlined. No `[1]` superscripts.
- **Citation block:** small-caps `CITATIONS` heading, then italic Caslon source links — same typography as inline citations, just listed at the foot of the article.

## Guide Rankings

Rankings live in guides, not on every entity page. A guide can be a map, playbook, contextual tier list, or journey page.

- Criteria should be visible near the ranking.
- Labels can be playful when useful, but warm labels like `First Call`, `Strong Fit`, and `Useful But Situational` will often be clearer than S/A/B.
- Every ranked recommendation should cite the fact pages or sources behind it.
- Entity pages should focus on impact, evidence, needs, offers, caveats, and open questions.

## Suggested Questions (under the search bar)

Mix of practical-finder, freshness, and discovery — shows the breadth of what the guide answers.

> *Try asking —*
> - *Senior engineers who'd join a hard-tech team in Utah*
> - *Fractional CFOs available right now*
> - *Investors who back deep tech in Utah*
> - *Who's raised their hand this week?*
> - *Utah's most surprising scientific moments*
> - *What's the next Recursion?*

Visual treatment: italic Caslon line on desktop (separated by middle dots), stacked italic Caslon questions on mobile.

The list should evolve over time as we see what people actually ask — the wiki itself can suggest new prompts based on emerging activity. Not part of v1.

## Navigation

- **No bottom tab bar.** Wrong soul. Travel magazines don't have tab bars.
- **Slim header** carries the masthead and a back chevron when relevant ("← Back to Spiral Jetty"). On mobile, edge-back-swipe also works.
- **No forward button.** Browser forward exists; nobody uses a UI forward button on content sites.
- **"Related" exit ramps** at the bottom of every article and entry page do the heavy lifting for wandering forward.

## Desktop

In scope from day one. Not just "the mobile design stretched."

- **More density per screen.** Article body on the left ~70% of the column; right rail for citations, related entries, "Try asking" suggestions.
- **The slim header runs full-width** with the masthead left, search bar centered, related exits or breadcrumb on the right.
- **Suggestions under the search render as an italic Caslon line** (vs. stacked on mobile). Middle-dot separators.
- **Type sizes scale up** but the rhythm stays magazine-feeling — no "responsive web app" stretched whitespace.

## Directory / List Conventions

- **Same row height** whether or not an entry has a thumbnail. Rhythm > completeness.
- **Guide/context label** can sit to the right of each entry name when the list is explicitly ranked.
- **One italic sentence** as the entry summary. No two-line descriptions.

## Open Questions

1. **Photograph sourcing for the ~10–15 hero entries.** Generated, licensed (Atlas Obscura / Field Mag photographers), shot by a friend, or curated from existing public sources? Decide before the demo.
2. **Display vs. text Caslon.** We probably want Big Caslon (or equivalent display cut) for mastheads / cover treatments and Caslon Text / Adobe Caslon Pro for body. Quick test in dev.
3. **Dark mode.** Yes-or-defer? My instinct: defer to post-hackathon unless trivial.
4. **Mobile-first proof of typography.** Caslon at small sizes on iOS Safari is a real test. Worth a one-hour spike before committing.
5. **Streaming UX.** When the article is being written, what fills the space below? A skeleton, a fading cursor, the suggestions still visible? Decide during prototyping.
6. **Sub-article-length answers.** What does a one-sentence answer look like vs. a six-paragraph essay? Same template, but visual hierarchy still needs to work for the short case.

## Sam's Pinterest

The full collection is in `docs/pinterest-a-love-letter-to-utah/`. Anyone designing should spend 10 minutes scrolling it before opening Figma — it's the source of truth for the vibe more than this doc is.

## Acknowledgements

Thanks to **Cambree Bernkopf** for design tips that shaped the direction of this work.
