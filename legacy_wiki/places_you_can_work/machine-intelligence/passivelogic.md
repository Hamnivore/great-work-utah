# PassiveLogic

**Tier:** A — novel physical AI paradigm with compelling energy counterfactual; commercial scale is still early
**Domain:** Machine intelligence — Physical AI / autonomous building control
**Also relevant to:** [Energy](../energy/) (building decarbonization — ~40% of global energy use is in buildings)
**Type:** Company (private)
**Stage:** Series C ($74M; $125M+ total)
**HQ:** Salt Lake City, UT
**Founded:** 2016 (Troy Harvey, Jeremy Fillingim)
**Website:** [passivelogic.com](https://passivelogic.com)

## Mission

Replace rule-based building management systems with physics-based AI that autonomously controls every building system — HVAC, lighting, energy — by simulating millions of futures each second and executing the optimal path.

## Why it matters

Buildings account for roughly 40% of global energy consumption. The reason they are so inefficient is not a lack of hardware; it is that programming Building Management Systems (BMS) requires specialized engineers for every building, and the result is rule-based control that cannot adapt to changing conditions. Most commercial buildings run suboptimally because the configuration cost is prohibitive. PassiveLogic's autonomous platform requires no specialized BMS programming: a physics-based digital twin of the building is generated, and deep learning optimizes control in real time. Beta testing in Salt Lake City resulted in 30% average energy savings.

The counterfactual: if building control stays rule-based, the efficiency ceiling is permanently capped by the slowest human engineer. If generalized autonomous building control succeeds, the energy efficiency gains compound across every commercial, industrial, and residential building on earth — without requiring building-by-building manual optimization.

## The hard problem

Building physics is deeply heterogeneous — every building has different geometry, HVAC configuration, occupancy patterns, and local climate. Classical model predictive control requires site-specific engineering models that are expensive to build. Deep learning alone fails because building data is too sparse and too noisy for training. PassiveLogic's solution fuses first-principles physics simulation with deep learning: the physics model constrains the search space; the learning model optimizes within it. Executing this at edge-compute speeds ("millions of sequence futures per second" on their Hive hardware) while remaining general across building types is the core unsolved problem.

## Mechanism of impact

Deployed infrastructure layer: PassiveLogic installs Hive hardware at the edge (the building), which runs the physics-AI autonomy loop locally without cloud dependency. Scale is through contractor deployment and OEM partnerships (Johnson Controls is both an investor and a distribution partner). The 30% energy savings figure, if it holds at commercial scale, is one of the largest near-term decarbonization levers available — larger in absolute terms than most direct-air capture or clean energy plays.

## What kind of contributor thrives here

Physical AI researchers (intersection of physics simulation and deep learning), embedded systems and edge inference engineers, HVAC/mechanical engineers who want to work at the AI layer rather than the equipment layer. Founders Troy Harvey and Jeremy Fillingim came from sustainable building design, not from enterprise software — the culture reflects that.

## Ownership

Private. $125M+ raised. Key investors: noa (Europe's largest built-world VC, led Series C), Prologis Ventures, **Johnson Controls** (strategic, also a potential distribution partner), **NVentures (NVIDIA's VC arm)** — NVIDIA's bet reflects their view on "physical AI" as the next wave after language AI, **Addition**, Brookfield, Keyframe. The Johnson Controls investment is both validation and a potential strategic alignment (JCI is a major BMS incumbent; they may be hedging against disruption as much as enabling it).

## Caveats / red flags

- 30% energy savings in beta (~20 buildings in SLC) is a promising pilot; commercial deployments at scale, with harder buildings and more demanding customers, have not yet published comparable data
- The incumbent BMS market (Honeywell, Siemens, Johnson Controls) is deeply entrenched with long-term facility contracts; displacing them requires both technical superiority and a procurement process change in a notoriously conservative industry
- Johnson Controls is an investor — this creates a potential conflict of interest if JCI sees PassiveLogic as more useful as an acquisition target than as a disruptive competitor
- The "generative autonomy" platform framing is broad; whether the physics-AI approach generalizes cleanly from buildings to other physical systems is an open question
- NVIDIA's investment is notable but small; NVentures takes many small bets. The $74M Series C was led by noa, which has more relevant domain focus

## Learn more

- [PassiveLogic website](https://passivelogic.com)
- [Series C announcement](https://www.prnewswire.com/news-releases/rewiring-autonomy-passivelogic-raises-74-million-to-scale-physical-ai-in-the-real-world-302559864.html)
- [Axios: AI to reduce carbon emissions with autonomous buildings](https://www.axios.com/2023/11/06/ai-carbon-emissions-heating-cooling)
- [Buildings.com: PassiveLogic and the path to net zero](https://www.buildings.com/building-systems-om/automation-controls/article/33018011/passivelogic-sees-autonomous-buildings-run-by-ai-as-the-path-to-net-zero)
