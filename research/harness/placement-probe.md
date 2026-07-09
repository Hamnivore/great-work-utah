# Placement probe — protocol

Measures a schema as a **writing target**: can a cold agent deterministically decide where new knowledge goes, and what navigation must update? Schemas that can't be written into deterministically decay regardless of read quality. The agent's stated ambiguities are the primary deliverable — we're surfacing *why* a schema fails, not scoring it.

One cheap agent per schema (no server needed — the schema's root/nav doc goes inline in the prompt). Same three fact bundles every time:

**Bundle 1 (clean single-domain venture):** VoltSafe Labs — Provo startup, 25 people, builds automated battery-cell test systems for energy-storage manufacturers; raised a $6M seed in 2026; hiring power-electronics and test-automation engineers.

**Bundle 2 (cross-cutting entity):** Wasatch Isotope Works — Ogden company producing medical isotopes *and* radioisotope power units for defense/space satellites; spun out of University of Utah nuclear engineering; needs radiochemists, nuclear engineers, and regulatory staff for both FDA and NRC tracks.

**Bundle 3 (historical achievement):** In 1970, University of Utah student Alan Kay's group demonstrated early object-oriented / personal-computing concepts that fed into the Dynabook vision — a foundational Utah computing contribution.

**Prompt template** (fill SCHEMA_DOC):

> You maintain a public wiki. Its organizing schema is described by its root/navigation document, reproduced below. Three new pieces of knowledge arrived (below). For each: (1) decide the exact path/location where the page (or content) should live, (2) list every navigation/index/hub document that must be updated for it to be findable, (3) state anything that felt ambiguous or arbitrary about the decision. Then answer: if this wiki doubled to 1,300 pages, what about this schema would start to hurt?
>
> SCHEMA_DOC
>
> [bundles]

**Scoring notes:** record path chosen, update fan-out (count of nav docs touched), stated ambiguities verbatim, and the scaling answer. Bundle 2 is the trap for tree schemas (H3/H7: which domain?); bundle 3 stresses opportunity-first (H6: no opening, where does context go?); bundle 1 should be easy everywhere — if a schema makes even bundle 1 ambiguous, that's disqualifying.
