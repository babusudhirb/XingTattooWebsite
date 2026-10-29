/**
 * URL parity snapshot: for every sitemap URL (plus the 404 page) records status, title, H1,
 * canonical, robots and the JSON-LD graph — with asset file names normalised, since those may
 * change between builds. Compare two snapshots to prove a refactor changed nothing for search.
 * Usage: node scripts/qa/url-snapshot.mjs <out.json> [base=http://localhost:4173]
 *        node scripts/qa/url-snapshot.mjs --diff qa/before.json qa/after.json
 */
import fs from "node:fs";

import { parse } from "node-html-parser";

if (process.argv[2] === "--diff") {
  // Image files may be renamed or moved (they must still answer 200 — seo-audit checks that)
  const normImages = (text) =>
    text.replace(
      /(https:\/\/www\.xingtattoo\.in)?\/[\w/.*-]+?\.(webp|avif|png|jpe?g|svg)/g,
      "<image>",
    );
  const [a, b] = [process.argv[3], process.argv[4]].map((f) =>
    JSON.parse(normImages(fs.readFileSync(f, "utf8"))),
  );
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
  let diffs = 0;
  for (const k of keys) {
    const x = JSON.stringify(a[k]);
    const y = JSON.stringify(b[k]);
    if (x !== y) {
      diffs++;
      console.log(`DIFF ${k}\n  before: ${x?.slice(0, 300)}\n  after:  ${y?.slice(0, 300)}`);
    }
  }
  console.log(diffs ? `${diffs} URLs differ` : `identical (${keys.length} URLs)`);
  process.exit(diffs ? 1 : 0);
}

const OUT = process.argv[2];
const BASE = process.argv[3] ?? "http://localhost:4173";
const SITE = "https://www.xingtattoo.in";
/** Asset URLs: keep only the folder, so a renamed or re-hashed file doesn't count as a change. */
const normAssets = (s) =>
  s.replace(/\/assets\/[^"'\s,)]+?\.(webp|avif|png|jpe?g|svg|js|css|woff2)/g, "/assets/*.$1");

const idx = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = ["/404"];
for (const [, sm] of idx.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (sm.includes("sitemap-images")) continue;
  const xml = await (await fetch(sm.replace(SITE, BASE))).text();
  for (const [, u] of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g))
    paths.push(u.replace(SITE, "") || "/");
}
const snap = {};
for (const p of paths.sort()) {
  const res = await fetch(BASE + p, { redirect: "manual" });
  const doc = parse(await res.text());
  snap[p] = {
    status: res.status,
    title: doc.querySelector("title")?.text ?? null,
    h1: doc.querySelector("h1")?.text.replace(/\s+/g, " ").trim() ?? null,
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    robots: doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
    description: doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
    jsonLd: normAssets(doc.querySelector('script[type="application/ld+json"]')?.text ?? ""),
  };
}
fs.writeFileSync(OUT, JSON.stringify(snap, null, 1));
console.log(`snapshot: ${paths.length} URLs → ${OUT}`);
