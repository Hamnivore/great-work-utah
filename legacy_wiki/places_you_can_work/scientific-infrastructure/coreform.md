# Coreform

**Tier:** A — strong; genuine technical breakthrough with real commercial traction
**Domain:** Scientific infrastructure — Engineering simulation / IGA solver
**Also relevant to:** [Manufacturing & materials](../manufacturing-and-materials/), [Energy](../energy/) (MOOSE nuclear framework integration)
**Type:** Company (private)
**Stage:** Private, operational; DOE SBIR Phase II recipient
**HQ:** Orem, UT
**Founded:** 2014
**Website:** [coreform.com](https://coreform.com)

## Mission

Eliminate the geometry-to-mesh translation bottleneck from engineering simulation by running finite element analysis directly on CAD geometry using isogeometric analysis (IGA).

## Why it matters

The average engineering team spends approximately 86% of its simulation budget on mesh-related work: defeaturing complex geometry, generating the mesh, checking mesh quality, and re-doing it when the design changes. This is not physics — it is bookkeeping that the geometry-to-mesh translation problem imposes. Isogeometric analysis removes this bottleneck by using the same mathematical basis (splines) for both geometry description and simulation — the CAD model *is* the simulation model.

The counterfactual: if IGA remains academic, the cost of high-fidelity simulation stays high and engineering design iteration stays slow. Every field that depends on simulation — aerospace structures, automotive crashworthiness, biomedical implant design, nuclear reactor components — inherits the inefficiency. Coreform is one of the few companies commercializing production-grade IGA, with the company founded by the people who invented the theory.

## The hard problem

Mesh generation for complex CAD geometry is a hard computational geometry problem — no general algorithm generates a high-quality conforming mesh for arbitrary BREP geometry without human intervention. IGA sidesteps the problem entirely, but making it work robustly on production engineering geometry (T-splines, trimmed surfaces, multi-patch assemblies) required 20 years of theoretical development after Thomas Hughes introduced IGA in 2005. Coreform's Flex solver is the first commercial implementation capable of general-purpose engineering problems.

## Mechanism of impact

Foundational tool: faster and more accurate simulation compresses design cycles across every physics-heavy engineering domain. DOE SBIR Phase II (2023) funds coupling Coreform Flex to MOOSE (the INL nuclear simulation framework) — if successful, IGA enters the most safety-critical simulation domain there is. Longer-term, adoption in commercial CAD/CAE pipelines would mean every aerospace, automotive, and biomedical design loop runs faster.

## What kind of contributor thrives here

Computational scientists, numerical analysts, and software engineers with backgrounds in finite element methods, computational geometry, or CAD kernel development. People who care about the mathematical correctness of simulation results, not just the UI on top of it. Small team (order of tens), Utah-based, strong academic culture — individual contribution is directly visible in the solver.

## Ownership

Private. Funded partially through DOE SBIR grants and (presumably) seed/venture capital — no public round disclosures found. Founder-controlled based on public profiles. The SBIR funding model aligns revenue with technical excellence rather than with AUM.

## Caveats / red flags

- Market size for CAE solver software is limited — this competes with ANSYS, Abaqus, and MSC, which have deeply entrenched workflows and customer lock-in built up over decades
- Adoption barriers in simulation are unusually high: engineers retrain on new tools reluctantly, and certification bodies (FAA, NRC) take years to accept new simulation methods as approved means of compliance
- DOE SBIR Phase II is promising but does not guarantee commercial adoption in nuclear or aerospace; the path from solver to certified-for-use tool is long
- MOOSE coupling is a specific use case; broader commercial penetration requires winning over general engineering firms

## Learn more

- [Coreform website](https://coreform.com)
- [IGA explainer](https://coreform.com/products/coreform-iga/about-iga/)
- [Hughes, Cottrell, Bazilevs (2005)](https://www.sciencedirect.com/science/article/pii/S0045782505002063) — founding IGA paper
- [DOE SBIR award context](https://business.utah.gov/innovation-center/department-of-energy-awards-utah-companies-8-2-million-in-research-and-development-grants/)
