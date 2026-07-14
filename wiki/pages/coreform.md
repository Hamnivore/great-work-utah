# Coreform

**Type:** venture
**Status:** Draft
**Confidence:** Medium
**Focus:** engineering simulation, isogeometric analysis, CAD, finite element analysis, CAE
**Stage:** Private; operational; DOE SBIR Phase II recipient
**Primary Location:** Orem, UT
**Utah Location:** Orem, UT
**Region:** Orem
**Map Location:** Coreform headquarters, 1427 S 550 E, Orem, UT 84097
**Coordinates:** 40.2709857, -111.6818388
**Location Precision:** exact
**Location Source:** https://coreform.com/support/contact/
**Website:** https://coreform.com
**Updated:** 2026-07-14
**Needs-reviewed:** 2026-07-14
**Hero:** https://picsum.photos/seed/coreform-isogeometric-analysis-2026/1600/1100
**Pull:** *Run finite element analysis directly on fully featured CAD geometry — without the mesh-generation bottleneck.*
**Relates:** cites [Official Website: Coreform](coreform-official-website.md) · https://greatutah.work/pages/coreform-official-website.md · https://coreform.com

## Summary

Coreform is a Utah-based engineering simulation company commercializing isogeometric analysis (IGA) — finite element analysis run directly on CAD geometry using the same spline basis for both design and simulation. Founded in 2014 and based in Orem, the company builds Coreform IGA solvers and related preprocessing tools such as Coreform Cubit.

For the wiki, Coreform matters because it attacks one of the most persistent bottlenecks in engineering simulation: mesh generation and geometry defeaturing consume a large share of analyst time before any physics is solved. The company was founded by researchers connected to the IGA field that Thomas Hughes and collaborators introduced in 2005.

## Impact

The impact case is strongest where high-fidelity simulation is load-bearing but design iteration is slow because meshing and geometry cleanup dominate the workflow. Coreform's public positioning argues that IGA removes the geometry-to-mesh translation step by letting engineers simulate on fully featured CAD models.

If that workflow proves robust at production scale, the benefit propagates across aerospace structures, automotive crashworthiness, biomedical implant design, nuclear components, and other physics-heavy domains. A DOE SBIR Phase II award (2023) funds coupling Coreform Flex to MOOSE, the Idaho National Laboratory nuclear simulation framework — a signal that IGA is being evaluated in one of the most safety-critical simulation domains.

The counterfactual is bounded but real: if IGA remains mostly academic, simulation cost and design-cycle time stay high across every field that depends on CAE.

## What They Are Building

Coreform builds IGA-based simulation software and supporting geometry tools. The official website highlights Coreform IGA for Abaqus, Coreform Cubit for CAD preprocessing, and a unified workflow for linear and nonlinear, static and dynamic, structural and multiphysics analyses.

The technical bet is that spline-based geometry can serve as both the design representation and the analysis model, sidestepping the general mesh-generation problem for complex BREP geometry. Making that work on production engineering geometry — trimmed surfaces, multi-patch assemblies, T-splines — required years of theory and implementation beyond the original 2005 IGA papers.

## What They Need Now

Likely needs include computational scientists, numerical analysts, finite-element-method specialists, computational-geometry engineers, CAD-kernel developers, and application engineers who can translate solver capability into customer workflows. The team appears small and Utah-based, with an academic engineering culture where individual technical contribution is visible.

## Who Could Help

Useful helpers include CAE-industry advisors, nuclear-simulation program managers familiar with MOOSE, aerospace and automotive simulation leads, IP counsel with simulation-software experience, and manufacturing partners evaluating solver adoption in certified engineering workflows.

## Utah Context

Coreform sits in Utah County alongside a broader Wasatch Front engineering and scientific-computing cluster. It is adjacent in spirit — though not institutionally — to university research institutes such as the [SCI Institute](sci-institute.md) that have long exported computational methods and research software from the University of Utah.

## Evidence

- [Official Website: Coreform](coreform-official-website.md) · https://greatutah.work/pages/coreform-official-website.md · https://coreform.com

## See Also

- [SCI Institute](sci-institute.md) · https://greatutah.work/pages/sci-institute.md — Utah's long-running scientific computing and research-software institute; useful context for local computational-methods talent.

## Open Questions

- No agent-readable careers/jobs page found (coreform.com/careers redirects to a contact page, not a job board).
- Which customer deployments, solver benchmarks, and certification milestones can be independently verified outside company marketing?
- How far has MOOSE coupling progressed from SBIR-funded research toward production nuclear simulation use?
- What is Coreform's current funding mix beyond DOE SBIR — seed, venture, or grant-only?
- The placeholder hero should be replaced with a cleared product, facilities, or simulation-visualization image when rights are confirmed.
