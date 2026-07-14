#!/usr/bin/env node
// Copy wiki/{pages,views,meta} → dist/ with page Evidence/See Also/Relates hardened
// for HTML-sanitizing fetchers. Source wiki/pages stays clean for human editors.
import fs from 'node:fs'
import path from 'node:path'
import { hardenMarkdown, loadSourceUrls } from './lib/harden-md.mjs'

const ROOT = new URL('..', import.meta.url).pathname
const WIKI = path.join(ROOT, 'wiki')
const DIST = path.join(ROOT, 'dist')
const pagesSrc = path.join(WIKI, 'pages')
const sourceUrl = loadSourceUrls(pagesSrc, fs)

function copyDir(src, dest, { harden = false } = {}) {
  fs.mkdirSync(dest, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name)
    const to = path.join(dest, name)
    if (fs.statSync(from).isDirectory()) {
      copyDir(from, to, { harden })
      continue
    }
    if (harden && name.endsWith('.md')) {
      fs.writeFileSync(to, hardenMarkdown(fs.readFileSync(from, 'utf8'), sourceUrl))
    } else {
      fs.copyFileSync(from, to)
    }
  }
}

for (const sub of ['pages', 'views', 'meta']) {
  const dest = path.join(DIST, sub)
  fs.rmSync(dest, { recursive: true, force: true })
  copyDir(path.join(WIKI, sub), dest, { harden: sub === 'pages' })
}

const sample = fs.readFileSync(path.join(DIST, 'pages', 'imsar.md'), 'utf8')
const n = (sample.match(/· `\/pages\//g) || []).length
console.log(`copy-wiki-hardened: → dist/ (imsar.md has ${n} fetcher-safe path tokens)`)
