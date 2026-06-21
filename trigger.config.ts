import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_pcfhzhdwdtpzvikznxcj",
  dirs: ["./src/trigger"],
  additionalFiles: ["./wiki/**/*.md", "./legacy_wiki/great_work/**/*.md"],
  maxDuration: 300, // 5 minutes default; override per-task as needed
});