/**
 * Crawls the production preview from "/" like a search engine (raw HTML, real <a href> only) and
 * fails on: broken internal links or #anchors, href="#" / empty / javascript: links, redirect
 * chains, sitemap URLs the crawl can't reach (orphans), pages deeper than 3 clicks, and any
 * redirect in scripts/redirects.mjs (+ case, .html, trailing slash) that isn't a single 301.
 * External links are checked too (< 400); hosts that refuse bots are listed, not failed.
 *
 * Usage: node scripts/qa/link-check.mjs [base=http://localhost:4173] [--no-external]
 */
import { parse } from "node-html-parser";

import { REDIRECTS } from "../redirects.mjs";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:4173";
const EXTERNAL = !process.argv.includes("--no-external");
const SITE = "https://www.xingtattoo.in";
const MAX_DEPTH = 3;

const failures = [];
const fail = (msg) => failures.push(msg);
const toLocal = (u) => u.replace(SITE, BASE);

// ── Crawl ────────────────────────────────────────────────────────────────
const pages = new Map(); // path → { depth, ids:Set, status }
const anchorsWanted = []; // { from, path, hash }
const external = new Map(); // url → first page linking it
const queue = [["/", 0]];
const seen = new Set(["/"]);

while (queue.length) {
  const [path, depth] = queue.shift();
  const res = await fetch(BASE + path, { redirect: "manual" });
  if (res.status >= 300 && res.status < 400) {
    fail(`internal link to a redirect: ${path} → ${res.headers.get("location")}`);
    continue;
  }
  if (res.status !== 200) {
    fail(`${path}: HTTP ${res.status}`);
    continue;
  }
  const doc = parse(await res.text());
  const ids = new Set(doc.querySelectorAll("[id]").map((e) => e.getAttribute("id")));
  pages.set(path, { depth, ids });

  for (const a of doc.querySelectorAll("a")) {
    const href = a.getAttribute("href");
    if (href == null || href.trim() === "" || href === "#" || /^javascript:/i.test(href)) {
      fail(`${path}: bad link href=${JSON.stringify(href)} ("${a.text.trim().slice(0, 40)}")`);
      continue;
    }
    if (/^(mailto|tel):/.test(href)) continue;
    const url = new URL(href, BASE + path);
    const isInternal = url.origin === BASE || url.origin === SITE;
    if (!isInternal) {
      if (/^https?:/.test(url.protocol) && !external.has(url.href)) external.set(url.href, path);
      continue;
    }
    if (url.search) fail(`${path}: internal link with a query: ${href}`);
    const target = url.pathname;
    if (url.hash)
      anchorsWanted.push({ from: path, path: target, hash: decodeURIComponent(url.hash.slice(1)) });
    if (!seen.has(target)) {
      seen.add(target);
      queue.push([target, depth + 1]);
    }
  }
}

// ── Anchors ──────────────────────────────────────────────────────────────
for (const { from, path, hash } of anchorsWanted) {
  const page = pages.get(path);
  if (page && !page.ids.has(hash))
    fail(`${from}: link to ${path}#${hash}, but no element has that id`);
}

// ── Sitemap coverage and depth ───────────────────────────────────────────
const idx = await (await fetch(`${BASE}/sitemap.xml`)).text();
const sitemapPaths = [];
for (const [, sm] of idx.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (sm.includes("sitemap-images")) continue;
  const xml = await (await fetch(toLocal(sm))).text();
  for (const [, u] of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g))
    sitemapPaths.push(u.replace(SITE, "") || "/");
}
for (const p of sitemapPaths) {
  const page = pages.get(p);
  if (!page) fail(`orphan: ${p} is in the sitemap but no link reaches it from /`);
  else if (page.depth > MAX_DEPTH) fail(`${p}: ${page.depth} clicks from home (max ${MAX_DEPTH})`);
}
const maxDepth = Math.max(...sitemapPaths.map((p) => pages.get(p)?.depth ?? 0));

// ── Redirects: each a single 301 to a 200 page ───────────────────────────
const redirectCases = [
  ...REDIRECTS.map((r) => (r.prefix ? [`${r.prefix}realism`, `${r.to}realism`] : [r.from, r.to])),
  ["/index.html", "/"],
  ["/About", "/about"],
  ["/SERVICES/Realism", "/services/realism"],
  ["/faq/", "/faq"],
  ["/gallery.html", "/gallery"],
];
for (const [from, to] of redirectCases) {
  const r = await fetch(BASE + from, { redirect: "manual" });
  const loc = r.headers.get("location")?.replace(SITE, "");
  if (r.status !== 301 || loc !== to) {
    fail(`redirect ${from}: expected 301 → ${to}, got ${r.status} → ${loc}`);
    continue;
  }
  const next = await fetch(BASE + to.split("#")[0], { redirect: "manual" });
  if (next.status !== 200)
    fail(`redirect ${from} → ${to}: target answers ${next.status} (chain or broken)`);
}
const nf = await fetch(`${BASE}/this-page-does-not-exist`, { redirect: "manual" });
if (nf.status !== 404) fail(`unknown URL answers ${nf.status}, not 404`);

// ── External links ───────────────────────────────────────────────────────
const blocked = [];
if (EXTERNAL) {
  for (const [url, from] of external) {
    try {
      let r = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      if (r.status === 405 || r.status === 403 || r.status === 429)
        r = await fetch(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(15000),
          headers: { "User-Agent": "Mozilla/5.0" },
        });
      if (r.status === 403 || r.status === 429 || r.status === 999)
        blocked.push(`${url} (${r.status})`);
      else if (r.status >= 400) fail(`${from}: external link ${url} answers ${r.status}`);
    } catch (e) {
      blocked.push(`${url} (${e.name})`);
    }
  }
}

console.log(
  `link-check ${BASE}: ${pages.size} pages crawled, ${sitemapPaths.length} sitemap URLs, max depth ${maxDepth}, ` +
    `${anchorsWanted.length} anchor links, ${redirectCases.length} redirects, ${external.size} external links`,
);
if (blocked.length) console.log(`  blocks bots (not failed):\n    ${blocked.join("\n    ")}`);
for (const f of failures) console.log(`  FAIL ${f}`);
console.log(`${failures.length} failures`);
process.exit(failures.length ? 1 : 0);
