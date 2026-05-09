# Great Work Agent Prompts

This directory tracks reusable prompts for agents working on the `great_work` wiki.

- [`source-expansion-agent.md`](source-expansion-agent.md) - find, verify, write, and index new Great Work entries.
- [`wiki-editor-agent.md`](wiki-editor-agent.md) - read, critique, rerank, refresh, expand, and maintain existing wiki entries.

Use the source-expansion prompt when the main task is discovering new work. Use the wiki-editor prompt when the main task is improving judgment, continuity, freshness, attribution, article quality, or the operating system around existing work.

Wiki-editor agents should also update the active ledger in `great_work/agent_ops/editorial_passes/` so partial article audits accumulate into whole-wiki coverage.
