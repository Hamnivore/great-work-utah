import { schedules, logger } from "@trigger.dev/sdk";
import OpenAI from "openai";
import { ghListDir, ghReadFile, ghWriteFile } from "./github-wiki";

const WIKI_CATEGORIES = ["ventures", "people", "helpers", "resources", "guides"] as const;

function normalizeWikiFilename(input: string): string {
  const withoutExtension = input.trim().toLowerCase().replace(/\.md$/i, "");
  const slug = withoutExtension
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "untitled"}.md`;
}

export const wikiAgent = schedules.task({
  id: "wiki-agent",
  // Run every 2 hours — 12 new pages/day, 24/7
  cron: "0 */2 * * *",
  maxDuration: 120,
  run: async () => {
    if (process.env.WIKI_AGENT_WRITES_ENABLED !== "true") {
      logger.log("Wiki agent writes disabled", { env: "WIKI_AGENT_WRITES_ENABLED" });
      return { status: "skipped", reason: "WIKI_AGENT_WRITES_ENABLED is not true" };
    }

    const client = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    // 1. Survey existing wiki content so the agent doesn't duplicate
    const listings: string[] = [];
    for (const cat of WIKI_CATEGORIES) {
      const list = await ghListDir(`wiki/${cat}`);
      listings.push(`=== wiki/${cat} ===\n${list}`);
    }
    const inventory = listings.join("\n\n");

    logger.log("Wiki inventory loaded", { chars: inventory.length });

    // 2. Ask the LLM to pick one topic gap to fill — ask for JSON to avoid format drift
    const planRes = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      max_tokens: 256,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a wiki agent for Great Work Utah — a knowledge base about Utah's startup, research, and innovation ecosystem. Your job is to find gaps and write new entries. Always respond with valid JSON.`,
        },
        {
          role: "user",
          content: `Here is the current wiki inventory:\n\n${inventory}\n\nPick ONE Utah company, research group, notable person, or topic that is NOT yet in this wiki and is worth documenting. Choose something real and verifiable.\n\nRespond with JSON only:\n{"topic": "Name of Thing", "category": "ventures|people|helpers|resources|guides", "filename": "slug-here.md"}`,
        },
      ],
    });

    const planRaw = planRes.choices[0].message.content ?? "{}";
    logger.log("Wiki agent plan", { planRaw });

    let topic: string, category: string, filename: string;
    try {
      const parsed = JSON.parse(planRaw);
      topic = parsed.topic?.trim();
      category = parsed.category?.trim().toLowerCase();
      filename = normalizeWikiFilename(parsed.filename ?? "");
      if (
        !topic ||
        !category ||
        !WIKI_CATEGORIES.includes(category as typeof WIKI_CATEGORIES[number]) ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename)
      ) {
        throw new Error("missing or invalid fields");
      }
    } catch (e) {
      logger.error("Could not parse wiki agent plan", { planRaw, error: String(e) });
      return { status: "error", reason: "parse failure", planRaw };
    }

    const repoPath = `wiki/${category}/${filename}`;

    logger.log("Writing wiki page", { topic, repoPath });

    const existing = await ghReadFile(repoPath);
    if (!existing.startsWith("Error")) {
      logger.log("Wiki page already exists; skipping write", { topic, repoPath });
      return { status: "skipped", reason: "page already exists", topic, repoPath };
    }

    // 3. Write the entry
    const writeRes = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are writing a wiki entry for Great Work Utah. Be factual, concise, and cite what you know. Use this markdown format:

# [Name]
**Category:** [ventures|people|helpers|resources|guides]
**Domain:** [one-line domain, e.g. "biotech / drug discovery"]
**Website:** [url if known, otherwise omit]

## Overview
[2–3 paragraphs: what it is, what it does, why it matters]

## Utah connection
[How it relates to Utah's ecosystem]

## Key people
[Named individuals, if known; omit section if unknown]`,
        },
        {
          role: "user",
          content: `Write a wiki entry for: ${topic}`,
        },
      ],
    });

    const content = writeRes.choices[0].message.content ?? "";
    const result = await ghWriteFile(repoPath, content, `wiki-agent: add ${topic}`);
    if (result.startsWith("Error") || result.startsWith("Write blocked")) {
      logger.error("Wiki agent write failed", { topic, repoPath, result });
      return { status: "error", reason: result, topic, repoPath };
    }

    logger.log("Wiki agent done", { topic, repoPath, result });
    return { status: "ok", topic, repoPath, result };
  },
});
