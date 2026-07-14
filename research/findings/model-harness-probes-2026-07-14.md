# Cross-model wiki probes (Cursor harness)

**Date:** 2026-07-14  
**Site:** https://greatutah.work (live only)  
**Design:** Same 3 tasks × providers. Issues tagged with model + harness.

## Matrix

| Provider | Model slug | Job seeker | SaaS founder | Slug discovery |
|----------|------------|------------|--------------|----------------|
| Anthropic | `claude-sonnet-5-thinking-high` | **API limit** | **API limit** | **API limit** |
| Anthropic | `claude-4.5-sonnet-thinking` | **API limit** | **API limit** | **API limit** |
| OpenAI | `gpt-5.6-sol-medium` | **API limit** | **API limit** | **API limit** |
| OpenAI | `gpt-5.2-codex` | **API limit** | **API limit** | **API limit** |
| Cursor Composer | `composer-2.5-fast` | **done** | **done** | **done** |
| xAI / Grok | `cursor-grok-4.5-high-fast` | **done** | **done** | **done** |

### Harness note

Every Anthropic and OpenAI Task launch failed immediately with:  
`API usage limit reached Switched to composer-2.5 after reaching API limit.`

No wiki content was probed on those models — **Cursor harness / account quota**, not a wiki defect. True three-provider comparison blocked until quota recovers.

**Completed comparison:** Grok × 3 + Composer × 3.

## Shared tasks

1. **Job seeker** — mission/RF-defense SWE; start `/llms.txt`; 3 next stops  
2. **SaaS founder** — Lehi B2B; capital + advisors; Medium+ over Low stubs  
3. **Slug discovery** — Silicon Slopes + find-an-advisor without knowing slugs  

## Results

### Job seeker

| | Grok | Composer |
|--|------|----------|
| Top 3 | IMSAR, L3Harris, Fortem | L3Harris, Fortem, IMSAR (same set, different order) |
| Careers found | IMSAR applicantpro; L3Harris careers; Fortem weak | L3Harris careers; Fortem Paylocity; IMSAR contact form |
| Wiki issues | no careers on pages; dead L3Harris Evidence; needs unfiltered | same + no skill-axis filter; region hides commutable employers |
| Harness | WebFetch strip + timeouts; contribute brief `type/body` ≠ live `kind/content` → 400 once | WebFetch timeouts; left wiki to search ATS |
| Notes | [#87](https://github.com/Hamnivore/great-work-utah/issues/87) | [#84](https://github.com/Hamnivore/great-work-utah/issues/84), [#85](https://github.com/Hamnivore/great-work-utah/issues/85), [#95](https://github.com/Hamnivore/great-work-utah/issues/95) |

### SaaS founder

| | Grok | Composer |
|--|------|----------|
| Verdict | Yes for advisors; weak SaaS equity | Partially useful — same split |
| Path | advisor guide → SCORE/SBDC → Kinect; VC stubs watchlist | same + Wilson Sonsini missing from advisor guide |
| Wiki issues | empty capital hub; Focus sludge; deep-tech capital bias; `sillicon-slopes`; helpers≠SCORE | same + Album Low; Kinect not cross-linked from capital guide; by-region Lehi omits community |
| Harness | WebFetch timeout on capital page; invented saas-* slugs 404 | WebFetch timeout on advisor (2/2); large views as side files |
| Notes | [#86](https://github.com/Hamnivore/great-work-utah/issues/86) | [#88](https://github.com/Hamnivore/great-work-utah/issues/88), [#94](https://github.com/Hamnivore/great-work-utah/issues/94) |

### Slug discovery

| | Grok | Composer |
|--|------|----------|
| Silicon Slopes | `sillicon-slopes` via 308 from correct spelling | same |
| Advisor | llms.txt + guides | index → guides |
| Wiki issues | typo canonical; stale summit dates; agent 404 recovers to `/v/*` SPA; soft `/p/` 200 | same + page bodies lack backtick paths after WebFetch strip |
| Harness | invents wrong slugs; WebFetch strip + timeout | invents first (`silicon-slopes` luckily redirects); hit `/p/` SPA before reading llms |
| Notes | [#89](https://github.com/Hamnivore/great-work-utah/issues/89)–[#92](https://github.com/Hamnivore/great-work-utah/issues/92) | [#93](https://github.com/Hamnivore/great-work-utah/issues/93) |

## Cross-provider patterns

### Shared wiki defects (both models)

1. **`sillicon-slopes` typo is canonical** (correct spelling redirects *into* the typo).  
2. **No careers/apply URLs on ventures** — job-seeker procedure asks for them; agents leave the wiki.  
3. **Capital path dead-ends for SaaS** — Medium guides + Low VC stubs + empty `domain-capital-programs` + Focus sludge.  
4. **Soft `/p/*` 404s** (HTTP 200 SPA).  
5. **Agent markdown 404 recovery points at `/v/*` HTML**, not `/views/*.md`.  
6. **L3Harris Evidence URLs dead** (already flagged on page).

### Shared Cursor-harness defects (both models)

1. **WebFetch strips markdown link targets** — views’ backtick paths mitigate; page Evidence/See Also often don’t.  
2. **WebFetch intermittent timeouts** — both models fell back to `curl` on the same pages (advisor, Fortem, capital).  
3. **Slug invention despite “don’t guess”** — both tried paraphrases; Grok listed more 404s; Composer’s first Silicon Slopes guess was rewarded by 308.

### Model-leaning differences (small n=3 each)

| Tendency | Grok | Composer |
|----------|------|----------|
| Job-seeker apply path | Found IMSAR **applicantpro** board | Found Fortem **Paylocity**; IMSAR contact form |
| Contribute volume | Fewer, denser notes | More notes (#84–95 cluster) |
| Schema friction | Hit contribute **400** when following experiment brief (`type`/`body`) vs live `kind`/`content` | Used live schema cleanly |
| First-route habit | Stayed on `/pages` after llms | Briefly hit `/p/` SPA before correcting |
| Depth vs breadth | Strong procedure fidelity + harness callouts | Stronger meta suggestions (`**Careers:**` field, Medium-only resource view) |

**Takeaway:** Wiki failure modes dominate and are **provider-agnostic**. The measurable model/harness differences are fetch reliability (WebFetch), contribute schema discipline, and how far off-wiki they go for careers URLs — not divergent shortlists (IMSAR/L3Harris/Fortem; SCORE/Kinect for founders).

## Harness mitigations shipped (2026-07-14, same day)

| Friction | Fix |
|----------|-----|
| WebFetch strips Evidence hrefs | `copy-wiki-hardened.mjs` + vite `serveWiki` append `· \`/pages/…\`` + source absolute URL |
| WebFetch timeouts | `Cache-Control` on `/pages|/views|/meta|/llms.txt`; llms.txt “retry then curl” tip |
| Contribute `type`/`body` 400 | `normalizeContribute` accepts aliases + optional `.md` |
| Agent 404 → `/v/*` HTML | `404.html` + SPA NotFound list `/views/*.md` |
| `sillicon-slopes` canonical typo | Renamed to `silicon-slopes`; typo → correct 308 |

## Re-run when quota recovers

Repeat the same three tasks with `claude-sonnet-5-thinking-high` (or Opus) and `gpt-5.6-sol-medium` / `gpt-5.2-codex` to complete the original matrix.
