# How the builder list works

This is the rubric behind the builder tier list. It is a third ladder over the fact corpus, separate
from [impact](tiers.md) and from [founder resources](founder-tiers.md).

The impact ladder asks what the subject could change in the world. This ladder asks a more personal
question:

> **Assuming the most generous interpretation consistent with the public record, how strongly does
> the work reveal people worth betting on?**

"Character" here means **builder character visible in the work**: specific conviction, agency,
craft, costly commitment, endurance, honest contact with reality, and the ability to gather people
around a demanding purpose. It is not a claim about anyone's private morality, kindness, motives, or
intrinsic worth. A wiki page cannot know those things, and a low or unknown letter must never be read
as a judgment that the people involved lack them.

The list is deliberately generous. Assume the builders' deepest recoverable belief is true, that
their mission is carried to completion, and that apparent setbacks are problems they can learn from.
Do not assume facts absent from the page, invent a private mission, or turn generic marketing into a
specific conviction.

## The letters

| | |
|---|---|
| **S** | extraordinary builder character is legible: rare agency, devotion, taste, and institution-making that would make you bet on these people across projects |
| **A** | unusually strong builders: a specific belief joined to repeated costly execution, high standards, or durable community formation |
| **B** | real builder signal: ownership, craft, persistence, or care beyond routine administration, though the record is narrower or less revealing |
| **C** | competent work is visible, but the page reveals little that distinguishes the builders from other capable teams |
| **D** | mostly administration, distribution, or participation; the work may be useful, but little builder character is legible in this atom |
| **F** | a duplicate, listing, unsupported claim, or inert shell from which no builders can responsibly be inferred |
| **unranked** | the page is too thin or too indirect to judge the people through the work; this is the preferred answer when in doubt |

There is no `*` bump and no `n/a`. Every fact page embodies or points toward human work, but many
pages honestly reveal too little to rate.

## The calls that decide placements

1. **Read the work as evidence of people, not the brand as a person.** Rank what the page reveals
   through choices and sustained action. Never write "this company is courageous" when the page only
   shows a mission statement. A specific technical architecture pursued through hard milestones is
   evidence; adjectives on an About page are not.

2. **Maximum faith is not maximum credulity.** Give the strongest charitable interpretation of
   documented behavior. Assume the thesis succeeds and the team learns its way through obstacles.
   Do not manufacture a thesis the page cannot support. `unranked` is more faithful than fan fiction.

3. **Magnitude is not character.** A hospice director, rural manufacturer, teacher, or maintainer can
   outrank a famous frontier founder. Conversely, weapons, extraction, surveillance, and predatory
   finance can exhibit formidable builder character. Moral direction remains prose, not the letter.

4. **Specific belief beats generic ambition.** "Transform healthcare" says nothing. A non-obvious
   causal model, product architecture, institutional design, or standard of care that organizes years
   of action is evidence of conviction and taste.

5. **Costly commitment beats presentation.** Years spent on an unfashionable technical bottleneck,
   regulated clinical work, physical manufacturing, patient service, repeated field deployment, or
   stewardship through failure reveal more than funding, press, awards, valuation, or polished copy.
   Money matters only when the way it is used reveals judgment.

6. **Community formation counts when the community is the product.** A program can rank high when it
   deliberately forms people through demanding shared work rather than merely convening them.
   Sandbox is the anchor: its public model embeds full-time company-building inside accredited
   degrees and is expanding that institutional form across universities. Under maximum faith, that
   is A-shaped even before its demonstrated impact is large.

7. **Maintenance is building.** Quiet decades of keeping a neonatal device, public dataset, open-source
   tool, rural institution, or safety service alive can show more character than a fashionable launch.
   Novelty is not required; ownership and standards are.

8. **Rank the page's atom.** A source page is out of scope because it records evidence rather than a
   subject. A company page ranks the company-building record, a person page the career pattern, a work
   page the builders embodied in that achievement, and a resource page the people who made and steward
   the institution—not the impressive founders who merely passed through it.

9. **Failure can raise the letter; unsupported claims cannot.** An honest, technically serious attempt
   sustained through setbacks can reveal exceptional people even if the impact tier falls. A dormant
   page needs enough record to show the attempt. A logo, directory listing, or unverifiable promise is
   F or unranked, never a romanticized A.

10. **Fame is actively ignored.** Name recognition, valuation, institutional prestige, and inclusion
    on other lists are not priors. The builder list exists to find the people a popularity list misses.

11. **Chosen leverage is strong positive evidence, never a requirement.** Pay special attention when
    people appear to have asked where their particular skills, access, history, or temperament can
    uniquely move the world, then organized their work around that answer. This may look like a
    clinician attacking a bottleneck only practitioners see, a machinist preserving a capability no
    one else will maintain, or a community builder designing the institution they once needed. The
    signal is the fit between person, neglected leverage point, and sustained action—not a grandiose
    claim to maximize impact. Its absence means nothing: outsiders usually cannot see why someone
    chose their work, and many great builders never narrate the choice publicly.

11. **Counterfactual self-placement is additional signal.** People often reveal character by choosing
    a place where their particular skills, relationships, or obsession can change an outcome that
    would otherwise stay stuck—even when the absolute change is small. Look for an explicit or
    behaviorally legible answer to: *why are these people unusually suited to this neglected problem,
    community, institution, or technical bottleneck?* A founder returning to a rural manufacturing
    constraint, a clinician building the missing device they repeatedly needed, or a maintainer
    preserving infrastructure nobody else will own can rank above a team chasing a larger fashionable
    market. This is evidence only when choice and action line up. Claims about "maximizing impact,"
    prestige-driven problem selection, and outsider savior narratives do not earn credit by themselves.

## Gems and the gap

The best discovery signal is not the builder letter alone. It is the disagreement between ladders:

`builder:A · impact:D · gap:+3`

A high builder tier with low demonstrated impact says: *the public record does not yet show large
displacement, but the work reveals people whose conviction and execution are unusually worth
attention.* The generated view leads with active S/A pages whose impact tier is C or below, then
prints the complete builder ladder.

The numerical gap is a browsing convenience, not a new score. Use base letters in order
S/A/B/C/D/F; `unranked` has no gap, and impact stars are stripped before comparison.

## How this hooks into the wiki

- `**Builder-tier:**` carries the letter on every fact page (`venture`, `person`, `helper`,
  `resource`, `work`). Source and guide pages take none.
- `views/builder-tier-list.md` is generated from that attribute. Never edit it by hand.
- The rating argument lives in `research/builder-tier-list/results/*.tsv`, not on the page. This
  prevents a generous inference from being mistaken for a sourced fact.
- Ratings are applied centrally with `node scripts/apply-builder-tiers.mjs`; subagents never edit
  wiki pages.

Expected shape is not a quota. S should be rare, A selective, and `unranked` may be large because
many pages were built to document services or outcomes rather than reveal the humans behind them.
If almost every startup lands in A, the rubric has collapsed into admiration. If only famous people
land there, it has collapsed into consensus.
