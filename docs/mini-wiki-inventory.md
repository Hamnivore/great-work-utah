# Mini-Wiki Inventory

Sam has built **two substantial wikis** at `~/coding/research/cool_companies/`. Together they're ~280 entries with consistent page anatomy, a shared tier convention, and validation scripts. This is the data layer — most of the content lift for the hackathon is already done.

## Two Wikis, Two Time Slices

### `great_work/` — Historical (165 entries)

> "A wiki of work done in Utah that changed the world. Research, institutions, projects, and companies that originated here and genuinely moved the needle."

Famous past Utah work — University of Utah Computer Graphics Program, Jarvik-7, Recursion's predecessors, ARPANET fourth node, Browning firearms, Sundance Institute, Spiral Jetty, Thiokol, etc.

**Domains:**
- `aerospace-and-propulsion/`
- `computing-and-software/`
- `culture-and-arts/`
- `defense-and-security/`
- `environment-and-earth/`
- `industry-and-infrastructure/`
- `mathematics-and-theoretical-science/`
- `medicine-and-biology/`
- `physics-and-materials/`

**Totals:** 77 historical entries (9 S · 28 A · 37 B · 2 C · 1 D) + ~80 speculative watchlist entries (P-A / P-B / P-C).

### `places_you_can_work/` — Current (114 entries)

> "A wiki of organizations doing work that could drastically change the world. Not an investment guide — a guide for people who want to spend their working hours on something that matters."

Active Utah organizations — Fervo, Zanskar, Recursion, Hexcel, Merit Medical, Blackrock Neurotech, SCI Institute, Strider Technologies, IMSAR, Vector Defense, etc.

**Domains:**
- **First-order** (solving specific problems): `energy/`, `transportation/`, `space/`, `manufacturing-and-materials/`, `food-and-agriculture/`, `health-and-longevity/`, `biological-engineering/`, `defense-and-security/`
- **Second-order** (expanding human capacity): `machine-intelligence/`, `tools-for-thought/`, `scientific-infrastructure/`, `education/`, `art-and-meaning/`
- **Wildcard:** `other/`

**Totals:** 96 entries — 11 S · 28 A · 33 B · 11 C · 5 D · 8 F.

## Shared Conventions

### The Tier System (this is the magic)

| Tier | Meaning | UI treatment |
|---|---|---|
| ⭐ **S** | Definitively world-changing. Filename and H1 prefixed with ⭐. | Hero placement, distinctive visual |
| **A** | Strong contribution. Excellent. | Prominent |
| **B** | Real contribution with caveats. | Standard listing |
| **C** | Plausible but limited. Read before applying. | Faded; opt-in to view |
| **D** | Weak but in. World-changing claim contested. | Faded; opt-in to view |
| **F** | Placeholder stub. | Hidden by default |
| **P-A / P-B / P-C** | Speculative watchlist. Promising but unproven. | Separate "watchlist" view |

The inclusion philosophy: **"Be generous. Tier is the visibility control, not the filter."** Anything plausible goes in; the tier tells you how seriously to take it. This remains useful seed material, but the new hackathon schema moves universal rankings out of entity pages and into contextual guides.

Many entries also include a **"Why this is not ⭐"** note explaining what would have to change for the tier to upgrade. This is *exactly* the kind of explainability the Nucleus brief asks for.

### Page Anatomy

Header is bold-prefixed metadata lines (not YAML frontmatter):

```markdown
# Recursion Pharmaceuticals ⭐

**Tier:** S — category-defining; arguably the best place in the world to do this work
**Domain:** Health & longevity — AI-driven drug discovery
**Type:** Company (public, NASDAQ: RXRX)
**Stage:** Clinical stage (~$4B market cap, $785M cash as of late 2025)
**HQ:** Salt Lake City, UT
**Founded:** 2013
**Website:** [recursion.com](https://www.recursion.com)
```

Then narrative sections (consistent across all entries):

- `## Mission` *(places-you-can-work)* / `## What it was` *(great-work)*
- `## Why it matters` / `## Why it mattered`
- `## The hard problem` / `## The hard problem they solved`
- `## Mechanism of impact` *(places-you-can-work)*
- `## Lasting impact` *(great-work)*
- `## What kind of contributor thrives here` *(places-you-can-work)*
- `## Key people` *(great-work)*
- `## Ownership` *(places-you-can-work)*
- `## Caveats`
- `## Learn more`

### Other Useful Bits

- **Validation scripts** at `cool_companies/scripts/` — `check_great_work_totals.py`, `check_great_work_editorial_coverage.py`, `check_great_work_watchlist_links.py`. Keep tier counts and links in sync. Worth running in CI.
- **`agent_ops/PLAN.md`** in `great_work/` — extensive editorial conventions, attribution standards (strong/medium/weak), speculative entry rules. We should treat this as the schema-of-record (the `AGENTS.md` Karpathy talks about, but for content).
- **`_messy_thoughts.md`** files — Sam's working notes / candidate inbox. These shouldn't be rendered by the UI but are useful for the agent layer.

## How This Maps to Our Three Archetypes

| Archetype | Primary surface |
|---|---|
| **Seeker** (looking for meaningful work) | `places_you_can_work/` — sort by tier, filter by sector, drill into a company |
| **Researcher** (looking for executors) | Browse `places_you_can_work/` to see operators; later, raise hand to *post* a research opportunity |
| **Helper** (looking to mentor / advise) | Raise hand → creates a `people/` entry that the agent matches against open roles in `places_you_can_work/` |
| **Inspirational browse** (visitors / investors / press) | `great_work/` — "look at what Utah has built." This is the museum mode. |

## Implications for Our App

1. **The existing wiki is seed material, not the final schema.** It gives us substance, examples, and editorial taste; the new hackathon wiki is a separate prose-first field guide.
2. **Bold-prefix headers are the right human-readable pattern.** Not YAML frontmatter — use `**Field:** value` lines for the few things scripts absolutely need.
3. **The new wiki should separate fact pages from judgment pages.** Existing entries can inform `ventures/`, `work/`, and `resources/`; contextual rankings belong in `guides/`.
4. **The UI needs a `people/` and `helpers/` layer that the existing wikis don't have.** This is where hand-raises, operators, advisors, mentors, and business-service providers become first-class.
5. **The old tier system becomes guide material.** Its spirit is useful for confident recommendations, but the new product should rank things by audience and criteria rather than stamping one universal tier on every item.

## Next Step

Symlink (or copy) the wikis into this repo so the React app can read them. Probably as a git submodule or a build-time copy — TBD in `plan.md`.
