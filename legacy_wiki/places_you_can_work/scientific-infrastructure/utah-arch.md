# Utah Arch Research Group

**Tier:** A — strong; not globally category-defining but excellent
**Domain:** Scientific infrastructure — Hardware architecture for ML & encrypted computation
**Also relevant to:** [Machine intelligence](../machine-intelligence/)
**Type:** University research group (University of Utah School of Computing)
**HQ:** Salt Lake City, UT
**Website:** [arch.cs.utah.edu](https://arch.cs.utah.edu)

## Mission

Re-architect the hardware stack underneath machine learning and privacy-preserving computation, from the transistor up — specifically, accelerators for ML, fully homomorphic encryption (FHE), and emerging compute substrates like 3D nanofabric.

## Why it matters

Two problems this group is aimed at matter disproportionately:

1. **Encrypted inference (FHE-ML)**. Running ML on encrypted data without ever decrypting it is the closest thing we have to "upload your medical records to a model and get an answer, without the model ever seeing your data." The math has existed for years; the practical performance overhead has been 10,000x or worse. Getting FHE-ML into the single-digit-slowdown regime is a hardware problem, and it is what unblocks a whole category of privacy-preserving applications in health, finance, and government.

2. **Post-Moore compute substrates**. Silicon scaling has slowed; domain-specific accelerators and new compute fabrics (3D nanofabric, processing-in-memory, carbon-nanotube logic) are the next era. Utah Arch is one of the academic groups publishing seriously on these at the top venues (HPCA, ASPLOS, ISCA, IEEE S&P).

The counterfactual: if encrypted ML accelerators end up in real production systems in the next decade, the academic work that got it there will include contributions from groups like this one. Academic hardware research is under-glamorized; it is also often where the designs that eventually ship in commercial silicon first get proven.

## The hard problem

Encrypted computation on accelerator hardware is a stack problem: lattice cryptography has radically different memory access and arithmetic patterns than neural networks, and neither matches what GPU-class hardware was designed for. Getting orders-of-magnitude speedups requires co-designing circuits, microarchitecture, memory hierarchies, and compilers together. The 3D nanofabric work is an even earlier-stage bet: how do you build logic when the substrate itself is post-silicon?

## Mechanism of impact

Scientific knowledge that feeds industrial design. Publications at top systems-security and architecture conferences are read by design teams at Apple, NVIDIA, Google, Intel, and the emerging FHE hardware startups (Niobium, Optalysys, others). PhD graduates flow into those teams and carry the ideas into commercial silicon. Mechanism is slower than a startup but broader in eventual footprint.

## What kind of contributor thrives here

PhD students and postdocs who want to do hardware architecture at the intersection of ML and security. Requires a stack-deep background: circuits, microarchitecture, cryptography math, and at least some ML. Small group, so individual output is visible and mattering. Not the right place for someone who wants to ship a product in two years; the right place for someone who wants to be an author on the paper that changes a field.

## Ownership

University research group. Funded by NSF, DARPA, industry collaborations. Standard academic research autonomy. Mission integrity is high by default — the work is publishing, training students, and open research, not chasing an exit.

## Caveats

- Academic research group, not a company; no commercial pathway directly, though spinouts are possible
- Encrypted ML at useful speeds is a 5–15 year problem, not a 1–3 year one
- The 3D nanofabric research is genuinely speculative; bet on it because you want to work on hard problems, not because you expect near-term applications
- Success depends on continued federal research funding, which is currently volatile

## Learn more

- [Utah Arch Research Group](https://arch.cs.utah.edu)
- Publications at HPCA, ASPLOS, ISCA, IEEE S&P — search "Utah" + "FHE" / "encrypted inference" / "3D nanofabric"
