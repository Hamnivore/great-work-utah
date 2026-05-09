# World-Changing Companies Wiki — Research Plan

## Purpose

A wiki of companies doing work that could drastically change the world. Not an investment guide — a guide for people who want to spend their working hours on something that matters. Meant to inspire, not just inform. Readers may not end up at these companies; that's fine.

Geographic scope starts with **Utah**.

## Inclusion bar — be very generous

The future is not obvious. Ford was dismissed for betting on combustion engines; the Wright brothers were ridiculed before they flew. This wiki includes companies generously, not selectively. The **tier system is the visibility control** — not exclusion. Put anything plausibly interesting in the wiki; let the tier signal how seriously to take it. When a company looks mediocre, write that into the entry honestly (Caveats section, or a "Why this is not ⭐" note). Never exclude because of uncertainty or low confidence — that's what the F tier is for.

**Tier system:**
- **⭐ S** — Standout. Proven scale, unique position, strong counterfactual. Star emoji in README table and at top of entry file.
- **A** — Strong case. Real traction, hard problem, good leverage for a contributor.
- **B** — Worth reading. Interesting angle, real product, weaker on one or two heuristics.
- **C** — Plausible. Some signal, not enough to be confident. Read before applying.
- **D** — Weak but in. In the wiki because something is there; don't spend a lot of time here.
- **F** — "Why is this in the wiki?" tier. Minimal entry, one or two lines. Placeholder for things spotted in research that might be worth revisiting. No full-form entry required.

**Entry format by tier:** S/A/B use the full entry format. C/D can use a shorter form. **F entries can be a single line** — just enough to remember why it was noticed. All entries can be expanded later.

---

## Heuristics for Great Work

A company earns a place here if it scores well on most of these:

1. **Mechanism of impact** — how does the work change the world? (foundational tool, direct deployment, scientific knowledge, policy lever)
2. **Counterfactual importance** — would the world be meaningfully worse if this company didn't exist?
3. **Hard problem** — is the core challenge genuinely unsolved, not just under-executed?
4. **Leverage of a single contributor** — can one great person meaningfully move the needle?
5. **Talent magnet** — are exceptional people choosing this over safer options? Strong signal the mission is real.
6. **Mission integrity** — does the revenue model align with the mission, or work against it?
7. **Mission autonomy** — is the company in control of its own direction? A company majority-owned by outside investors is more likely to be redirected toward exits than toward a 20-year mission. Look for founder control, nonprofit structures, government backing, or unusual ownership arrangements.
8. **Timeline to impact** — flag whether impact lands in ~5 years or ~50. Neither disqualifies; both are worth knowing.

---

## Company Entry Format

Each company gets a structured entry:

```
## Company Name
**Domain:** [e.g., AI Infrastructure, Biotech, Energy]
**Stage:** [e.g., Seed, Series B, Public, Nonprofit]
**Location:** [City, UT]
**Website:** [url]

**Mission:** One sentence.

**Why it matters:** Counterfactual argument — what breaks or stalls without this work?

**The hard problem:** What is genuinely unsolved at the core of what they do?

**Mechanism of impact:** How does their work change the world (tool, deployment, knowledge, etc.)?

**What kind of contributor thrives here:** Skills, disposition, working style.

**Ownership:** Who controls the company? (founder-led, VC-majority, nonprofit, public, government-backed) Flag if outside investors hold majority stake.

**Caveats / red flags:** Honest concerns about mission drift, viability, or hype.

**Learn more:** Papers, talks, interviews, repos.
```

---

## Taxonomy

Each entry lives in one of these domain directories. Geography and org type are fields inside entries, not directory structure. University labs and research programs belong alongside companies.

**First-order** (solving specific problems):
- `energy/` — clean, firm, cheap power at civilization scale
- `transportation/` — moving people and things on Earth
- `space/` — expanding humanity's presence beyond Earth
- `manufacturing-and-materials/` — making physical things better, cheaper, cleaner
- `food-and-agriculture/` — feeding people sustainably
- `health-and-longevity/` — keeping humans alive and well longer
- `biological-engineering/` — programming living systems as a platform
- `defense-and-security/` — protecting civilization

**Second-order** (expanding human capacity):
- `machine-intelligence/` — AI hardware, new modeling paradigms
- `tools-for-thought/` — interfaces that augment how humans reason and create
- `scientific-infrastructure/` — tools that make all scientific progress faster
- `education/` — how humans learn, teach, and accumulate knowledge
- `art-and-meaning/` — new creative mediums, meaning-making at scale

**Wildcard:**
- `other/` — genuine oddballs that clear the bar but fit nowhere else (e.g., Bitcoin)

---

## Search Strategy

### Phase 1 — Domain Sweeps (Utah)

Research one domain at a time, focusing on Utah-based organizations.

- [x] Energy
- [x] Machine intelligence
- [x] Tools for thought
- [x] Transportation
- [x] Space
- [x] Health & longevity
- [x] Biological engineering
- [x] Scientific infrastructure
- [x] Defense & security
- [x] Manufacturing & materials
- [x] Food & agriculture
- [x] Education
- [x] Art & meaning
- [x] Other

---

### Phase 2 — Source Sweeps (Utah)

Phase 1 walked the wiki by domain. Phase 2 walks it by **source** — places where world-changing work is cataloged but domain-driven web searches miss it. Each candidate is evaluated against the 7 heuristics and slotted into existing domain directories.

#### Tier S — start here (pre-curated, fastest read)

- [~] **University spinout registries** — U of U TLO (330+ companies; initial sweep done, biotech-heavy, notable new finds: Coreform via BYU adjacency); BYU TTO (site not machine-readable; Coreform is the main spinout); USU TCO (WAVE Inc. found); UVU not yet swept. Follow-up: deep-read U of U TLO pages 4–10 for non-biotech entries.
- [~] **Utah SBIR/STTR awardees (last 5 years)** — SBIR.gov direct API blocked; found via Utah GOEO press releases: Ionic MT (DOE, halloysite silicon anodes), Wasatch Ionics (Army, Li-O2 batteries), Coreform (DOE, MOOSE coupling), Nielson Scientific, InnoSys. Follow-up: fetch full DOE SBIR Utah list and defense SBIR list.
- [ ] **Federal grant databases (Utah PIs)** — NSF, DOE, DARPA, ARPA-H, NIH; surfaces labs that don't spin out and don't market

#### Tier A — high yield, more effort

- [ ] **Faculty / lab walk** — U of U, BYU, USU: CS / ME / EE / BME / Chem / Physics / CompBio (extends the informal work already in `_messy_thoughts.md`)
- [~] **Local VC portfolios** — Sorenson Capital (done; all B2B SaaS, no deep tech), Peterson Partners (done; mixed portfolio, no deep tech standouts), Pelion (active in Vector, Torus, Creekstone — good defense/energy signal), Kickstart (in Vector). Album, Peak, Signal Peak, Epic not yet swept.
- [~] **Exit-founder traces** — Aaron Skonnard: leads 47G, invested in Recursion + Vector Defense. Ryan Smith: sports/entertainment fund (HXCO), not deep tech. Josh James: community building (Silicon Slopes). Scott Smith: philanthropy, academia. No major new deep tech ventures surfaced beyond what was already in wiki.
- [~] **Niche probes** (each is a hypothesis to test, not a size claim):
  - [x] Genealogy / FamilySearch ecosystem → FamilySearch entry in other/; no commercial spinouts found
  - [x] Great Salt Lake — lithium-from-brine → great-salt-lake.md updated; Lilac Solutions (CA) + International Battery Metals noted; HB 453 context; no dominant UT-HQ company yet
  - [x] Mining & minerals modernization — rare earths → Energy Fuels White Mesa (Tier A, manufacturing-and-materials); Ionic MT (Tier A, silicon anodes from halloysite)
  - [x] Cybersecurity → Strider Technologies (Tier A, defense-and-security); RADICL (Colorado, not UT); LiveView Technologies (not world-changing enough, messy_thoughts)
  - [x] Mental health / addiction recovery tech — Relay (BYU-adjacent app, bootstrapped, not world-changing); Huntsman Mental Health Institute research (academic); no standout Utah startup found
  - [x] Outdoor recreation tech & materials → Black Diamond (mature company, doesn't clear bar); no standout spinouts found
  - [x] Aridland agriculture & water-efficient ag → Renaissance Ag (Tier B); USU Integrated BioSystems (Tier B); Eden Technologies (desalination startup, too early)
  - [x] LDS humanitarian engineering / BYU-Pathway → BYU-Pathway Worldwide (Tier B, education); Welfare Square not researched

#### Tier B — fill in after Tier S/A

- [~] **Defense contractor trace** — 47G member directory swept: found IMSAR (SAR radar, Springville, Tier A entry), Teal Drones (Army SRR, Tier B entry), Vector (attritable drones, Tier A entry), Karman Space & Defense (loitering munition factory in West Valley City, ecosystem context), Baxter Aerospace (UAS + comms kits, St. George, messy_thoughts). SAM.gov direct sweep not yet done.
- [x] **YC + Techstars + a16z American Dynamism Utah grads** — YC swept (no Utah deep tech standouts), Techstars Salt Lake City no specific cohort found, a16z American Dynamism 50 list checked: no Utah companies on list.
- [ ] **USPTO assignee search by Utah** — catches industrial R&D we'd otherwise miss

#### Tier C — low-cost long shots (~1 hour each)

- [ ] Cold-email 10–20 Utah professors: "who's your most ambitious recent grad and where did they go?"
- [ ] Post a focused question on r/SiliconSlopes
- [ ] Grep HN "Who is Hiring?" archive for Utah
- [ ] Utah Business "40 under 40" / "Fast 50" archives
- [ ] Governor's Office of Economic Opportunity targeted-industry reports