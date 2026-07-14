declare module '*harden-md.mjs' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function loadSourceUrls(pagesDir: string, fs: any): Map<string, string>
  export function hardenMarkdown(raw: string, sourceUrl?: Map<string, string>): string
}
