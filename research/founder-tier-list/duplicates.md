# One program, several pages

Rating the whole founder shelf in one pass forced a direct comparison the alphabetical index never
does: you cannot assign two letters to the same organization without noticing it is the same
organization. Eight cases turned up, covering 18 pages.

These are page defects, not rating defects. Each set carries the same `**Founder-tier:**` until
someone merges it, so the ladder stays internally consistent while the corpus is still wrong. Merging
is not mechanical — several of these pages carry distinct evidence, distinct Region metadata, and
inbound links from other pages — so nothing here was merged as part of the tiering pass.

| Program | Pages | Founder-tier | Note |
|---|---|---|---|
| Nucleus Grow (Utah's SBIR/STTR partner) | `nucleus-grow.md`, `utah-innovation-center.md` | A | Same office; the second is the pre-rename name. Both pages say so. |
| Nucleus Fund | `nucleus-fund.md`, `utah-innovation-fund.md` | D | Same fund, same rename pattern. |
| Utah Small Business Credit Initiative | `utah-small-business-credit-initiative.md`, `utah-small-business-credit-initiative-usbci.md` | B / unranked | The only split letter here, and deliberately: the first page documents the loan structures, the second is a thin directory card with nothing to rate. Merging resolves it to B. |
| 1 Million Cups | `1-million-cups-orem.md`, `1-million-cups-salt-lake.md`, `1mc-salt-lake.md` | F | Two of the three are the same Salt Lake chapter. Orem is a genuinely separate chapter and should survive the merge. |
| Atwood Innovation Plaza (Utah Tech, St. George) | `atwood-innovation-plaza.md`, `utah-tech-university-atwood-innovation-center.md`, `business-resource-center-utah-tech-university.md` | D | One campus, three names. The BRC is arguably a distinct service inside the plaza; the other two are not distinct from each other. |
| The Mill (SLCC, Sandy) | `salt-lake-community-college-slcc-the-mill.md`, `the-mill-entrepreneurship-center.md` | D | Same incubator, same Miller Campus, same Work/Learn/Network framing. |
| SERDA / SEUALG (southeastern Utah) | `southeastern-association-of-local-governments.md`, `southeastern-utah-association-of-local-governments-economic-development.md` | D | Same council of governments; the second scopes itself to the ED function, which is most of what the first describes. |
| R6 Regional Council (central Utah) | `r6-regional-council.md`, `six-county-association-of-governments.md` | D | Same council; the second is the former name. |

## Why the ladder found these and the index didn't

The type index sorts alphabetically and prints one line per page, so `nucleus-fund` and
`utah-innovation-fund` are 40 lines apart and read as two funds. A ranking pass has to answer "how
does this compare to the others" for every page, which puts the duplicate pair in the same bucket for
the same reason and makes the collision unavoidable.

The same effect showed up in the first impact-ladder pass, which is recorded in `research/tier-list/`.
That is worth stating as a general property rather than a coincidence: **ranking a corpus is a
deduplication pass that happens to also produce an ordering.** If a third ladder is ever built over
another facet, expect it to surface a different set of collisions.
