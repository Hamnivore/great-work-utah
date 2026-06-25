import { task, metadata } from "@trigger.dev/sdk";
import OpenAI from "openai";
import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { ghReadFile, ghWriteFile } from "./github-wiki";

function getClient() {
  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
}

const WIKI_ROOT = path.resolve(process.cwd(), "wiki");
const LEGACY_WIKI_ROOT = path.resolve(process.cwd(), "legacy_wiki/great_work");
const WRITABLE_WIKI_DIRS = new Set([
  "answers",
  "guides",
  "helpers",
  "matches",
  "people",
  "resources",
  "sources",
  "ventures",
  "work",
]);

function isInside(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function normalizeWikiToolPath(input: unknown): { ok: true; path: string } | { ok: false; error: string } {
  if (typeof input !== "string" || !input.trim()) {
    return { ok: false, error: "path must be a non-empty string" };
  }

  const normalized = input.replaceAll("\\", "/").replace(/^wiki\//, "");
  const parts = normalized.split("/").filter(Boolean);

  if (
    path.posix.isAbsolute(normalized) ||
    parts.length !== 2 ||
    parts.some((part) => part === "." || part === "..")
  ) {
    return { ok: false, error: "path must look like 'category/slug.md'" };
  }

  const [category, filename] = parts;
  if (!WRITABLE_WIKI_DIRS.has(category)) {
    return {
      ok: false,
      error: `category must be one of: ${Array.from(WRITABLE_WIKI_DIRS).sort().join(", ")}`,
    };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename)) {
    return { ok: false, error: "filename must be a lowercase slug ending in .md" };
  }

  return { ok: true, path: `${category}/${filename}` };
}

function searchWiki(query: string): string {
  const roots = [WIKI_ROOT, LEGACY_WIKI_ROOT];
  const allFiles: string[] = [];
  const allSnippets: string[] = [];

  for (const root of roots) {
    try {
      const files = execFileSync("grep", ["-F", "-r", "-i", "-l", "--include=*.md", query, root], {
        encoding: "utf8",
        timeout: 5000,
      })
        .trim()
        .split("\n")
        .filter(Boolean);
      allFiles.push(...files);

      const snippets = execFileSync(
        "grep",
        ["-F", "-r", "-i", "-n", "--include=*.md", "-m", "15", query, root],
        { encoding: "utf8", timeout: 5000 }
      );
      allSnippets.push(snippets);
    } catch {
      // no matches in this root
    }
  }

  if (!allFiles.length) return `No wiki files found matching "${query}"`;
  return `Files matching "${query}":\n${allFiles.join("\n")}\n\nSnippets:\n${allSnippets.join("\n")}`;
}

async function readFile(filePath: string): Promise<string> {
  const wikiToolPath = normalizeWikiToolPath(filePath);
  if (wikiToolPath.ok) {
    return ghReadFile(`wiki/${wikiToolPath.path}`);
  }

  const resolved = path.resolve(
    filePath.startsWith("/") ? filePath : path.join(WIKI_ROOT, filePath)
  );

  // New wiki: read via GitHub API so agents always see the latest content,
  // including pages written after the last Trigger.dev deploy.
  if (isInside(WIKI_ROOT, resolved)) {
    const repoRelative = "wiki/" + path.relative(WIKI_ROOT, resolved);
    return ghReadFile(repoRelative);
  }

  // Legacy wiki: bundled at deploy time; local read is fine (these don't change).
  if (isInside(LEGACY_WIKI_ROOT, resolved)) {
    try {
      return await fs.readFile(resolved, "utf8");
    } catch {
      return `Error: could not read ${filePath}`;
    }
  }

  return "Error: path is outside wiki directories";
}

const SYSTEM_PROMPT = `You are the Great Work Utah wiki agent — a field guide for Utah's startup, research, and talent ecosystem.

When answering a question reveals a clear gap — a company, person, or topic that deserves a wiki page but doesn't have one yet — mention the gap in the answer. Only use write_file when runtime configuration explicitly allows writes. Keep new pages concise and factual. Use the same markdown style as existing wiki entries.

You have access to two wiki corpora:

1. New wiki (${WIKI_ROOT}):
   - wiki/ventures/   — Utah companies and research groups
   - wiki/people/     — Notable individuals
   - wiki/helpers/    — Advisors, investors, service providers
   - wiki/resources/  — Programs, funds, accelerators
   - wiki/guides/     — Topic guides

2. Legacy wiki (${LEGACY_WIKI_ROOT}):
   - aerospace-and-propulsion/
   - computing-and-software/
   - culture-and-arts/
   - defense-and-security/
   - environment-and-earth/
   - industry-and-infrastructure/
   - mathematics-and-theoretical-science/
   - medicine-and-biology/
   - physics-and-materials/

Search both. Prefer the new wiki when entries overlap, but draw on the legacy wiki for depth and breadth.

Before calling any tool, write 1–3 sentences explaining your reasoning: what you're looking for, why, and what you expect to find. Think step by step.

Use your tools to search the wiki, then read the relevant files, then write a thorough response.
Always respond in well-formatted markdown with headers, bullets, and bold text. Cite specific entries.`;

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_wiki",
      description:
        "Grep all wiki .md files for a keyword. Returns matching file paths and snippets. Run multiple searches with different terms to cover synonyms.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Keyword or phrase to grep for" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the full contents of a specific wiki file.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              "File path — either a full path like /home/.../wiki/ventures/foo.md or relative like ventures/foo.md",
          },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description:
        "Create a new wiki page only when writes are enabled by runtime configuration. Path is relative to wiki/, e.g. 'ventures/new-company.md' or 'guides/utah-vc-landscape.md'. Existing pages are never overwritten.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Wiki-relative path, e.g. 'ventures/new-company.md'",
          },
          content: {
            type: "string",
            description: "Full markdown content of the page",
          },
          commit_message: {
            type: "string",
            description: "Short git commit message, e.g. 'search-agent: add XYZ entry'",
          },
        },
        required: ["path", "content", "commit_message"],
      },
    },
  },
];

type FunctionToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

type StreamDelta = {
  content?: string | null;
  reasoning_content?: string;
  tool_calls?: Array<{
    index: number;
    id?: string;
    function?: {
      name?: string;
      arguments?: string;
    };
  }>;
};

function stringArg(args: Record<string, unknown>, key: string): string {
  const value = args[key];
  return typeof value === "string" ? value : "";
}

async function runToolCallRound(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  thinkingAcc: string
): Promise<{
  done: boolean;
  thinkingAcc: string;
  toolCalls: FunctionToolCall[];
  textContent: string;
  reasoningContent: string;
}> {
  const stream = await getClient().chat.completions.create({
    model: "deepseek-v4-flash",
    max_tokens: 1024,
    messages,
    tools,
    tool_choice: "auto",
    stream: true,
  });

  let textContent = "";
  let reasoningContent = "";
  let finishReason: string | null = null;
  const toolCallsMap: Record<number, { id: string; name: string; arguments: string }> = {};

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta as StreamDelta | undefined;
    finishReason = chunk.choices[0]?.finish_reason ?? finishReason;

    if (delta?.reasoning_content) {
      reasoningContent += delta.reasoning_content;
    }

    if (delta?.content) {
      textContent += delta.content;
    }

    if (delta?.tool_calls) {
      for (const tc of delta.tool_calls) {
        if (!toolCallsMap[tc.index]) {
          toolCallsMap[tc.index] = { id: tc.id ?? "", name: tc.function?.name ?? "", arguments: "" };
        }
        if (tc.id) toolCallsMap[tc.index].id = tc.id;
        if (tc.function?.name) toolCallsMap[tc.index].name = tc.function.name;
        if (tc.function?.arguments) toolCallsMap[tc.index].arguments += tc.function.arguments;
      }
    }
  }

  await metadata.set("thinking", thinkingAcc);

  const toolCalls = Object.values(toolCallsMap).map((tc) => ({
    id: tc.id,
    type: "function" as const,
    function: { name: tc.name, arguments: tc.arguments },
  }));

  const done = finishReason === "stop" || toolCalls.length === 0;
  return { done, thinkingAcc, toolCalls, textContent, reasoningContent };
}

export const searchAgent = task({
  id: "search-agent",
  maxDuration: 120,
  run: async (payload: { query: string }) => {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: payload.query },
    ];

    let thinkingAcc = "Reading the wiki and preparing a sourced answer.";

    // Phase 1: tool call loop with streamed reasoning
    for (let round = 0; round < 8; round++) {
      const { done, thinkingAcc: newThinking, toolCalls, textContent, reasoningContent } =
        await runToolCallRound(messages, thinkingAcc);
      thinkingAcc = newThinking;

      // reasoning_content must be passed back to DeepSeek or it errors
      messages.push({
        role: "assistant",
        content: textContent || null,
        ...(reasoningContent ? { reasoning_content: reasoningContent } : {}),
        tool_calls: toolCalls.length ? toolCalls : undefined,
      } as OpenAI.Chat.Completions.ChatCompletionMessageParam);

      if (done) break;

      for (const toolCall of toolCalls) {
        let args: Record<string, unknown>;
        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: `Tool call failed: invalid JSON arguments (${String(error)})`,
          });
          continue;
        }
        let result: string;

        if (toolCall.function.name === "search_wiki") {
          const line = `\n\nSearching the wiki for "${stringArg(args, "query")}".`;
          thinkingAcc += line;
          await metadata.set("thinking", thinkingAcc);
          result = typeof args.query === "string" ? searchWiki(args.query) : "Search failed: query must be a string.";
        } else if (toolCall.function.name === "read_file") {
          const line = `\n\nReading ${typeof args.path === "string" ? path.basename(args.path) : "the requested file"}.`;
          thinkingAcc += line;
          await metadata.set("thinking", thinkingAcc);
          result = typeof args.path === "string" ? await readFile(args.path) : "Read failed: path must be a string.";
        } else if (toolCall.function.name === "write_file") {
          const safePath = normalizeWikiToolPath(args.path);
          const line = `\n\nConsidering a new wiki page at ${safePath.ok ? safePath.path : String(args.path)}.`;
          thinkingAcc += line;
          await metadata.set("thinking", thinkingAcc);
          if (!safePath.ok) {
            result = `Write blocked: ${safePath.error}.`;
          } else if (process.env.SEARCH_AGENT_WRITE_ENABLED !== "true") {
            result = `Write blocked: SEARCH_AGENT_WRITE_ENABLED is not true. Draft the proposed wiki/${safePath.path} content in your final answer instead.`;
          } else if (typeof args.content !== "string" || !args.content.trim()) {
            result = "Write blocked: content must be a non-empty string.";
          } else {
            // Safety: read first so we don't blindly overwrite existing wiki pages.
            const existing = await readFile(safePath.path);
            const exists = !existing.startsWith("Error");
            if (exists) {
              result = `Write blocked: wiki/${safePath.path} already exists (${existing.length} chars). Return a proposed patch in your final answer instead of overwriting it.`;
            } else {
              result = await ghWriteFile(
                `wiki/${safePath.path}`,
                args.content,
                typeof args.commit_message === "string" && args.commit_message.trim()
                  ? args.commit_message
                  : `search-agent: add ${safePath.path}`,
              );
            }
          }
        } else {
          result = "Unknown tool";
        }

        messages.push({ role: "tool", tool_call_id: toolCall.id, content: result });
      }
    }

    // Phase 2: stream the final response
    thinkingAcc += "\n\nWriting the final response.";
    await metadata.set("thinking", thinkingAcc);

    const finalStream = await getClient().chat.completions.create({
      model: "deepseek-v4-flash",
      max_tokens: 2048,
      messages: [
        ...messages,
        {
          role: "user",
          content:
            "Now write your final response in markdown based on what you found. Be specific and cite entries.",
        },
      ],
      stream: true,
    });

    let response = "";
    let tokenCount = 0;
    for await (const chunk of finalStream) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      if (content) {
        response += content;
        tokenCount++;
        if (tokenCount === 1 || tokenCount % 10 === 0) {
          await metadata.set("response", response);
        }
      }
    }
    await metadata.set("response", response);
    return { response };
  },
});
