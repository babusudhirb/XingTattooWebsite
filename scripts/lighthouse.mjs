/**
 * Lighthouse (mobile, default throttling) on the five gate pages against the production preview.
 * Fails unless Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95 and SEO = 100.
 * Each page runs `RUNS` times and the median Performance score counts (scores vary run to run).
 * Usage: node scripts/lighthouse.mjs [base=http://localhost:4173]
 */
import fs from "node:fs";

import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:4173";
const PAGES = ["/", "/services/realism", "/gallery", "/contact", "/blog/tattoo-aftercare-guide"];
const RUNS = 3;
const MIN = { performance: 90, accessibility: 95, "best-practices": 95, seo: 100 };
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
].find((p) => fs.existsSync(p));

const chrome = await chromeLauncher.launch({ chromePath: CHROME, chromeFlags: ["--headless=new"] });
const rows = [];
let failed = 0;
for (const p of PAGES) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const { lhr } = await lighthouse(BASE + p, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      formFactor: "mobile",
      onlyCategories: Object.keys(MIN),
    });
    runs.push(lhr);
  }
  const median = runs.sort(
    (a, b) => a.categories.performance.score - b.categories.performance.score,
  )[Math.floor(RUNS / 2)];
  const score = (k) => Math.round(median.categories[k].score * 100);
  const a = median.audits;
  const row = {
    page: p,
    performance: score("performance"),
    accessibility: score("accessibility"),
    "best-practices": score("best-practices"),
    seo: score("seo"),
    LCP: a["largest-contentful-paint"].displayValue,
    CLS: a["cumulative-layout-shift"].displayValue,
    TBT: a["total-blocking-time"].displayValue,
  };
  const bad = Object.entries(MIN).filter(([k, min]) => row[k] < min);
  if (bad.length) {
    failed++;
    // What Lighthouse blames, for the failing categories
    for (const [k] of bad)
      for (const ref of median.categories[k].auditRefs)
        if (ref.weight > 0 && a[ref.id].score !== null && a[ref.id].score < 0.9)
          console.log(
            `  ${p} ${k}: ${a[ref.id].title} (${a[ref.id].displayValue ?? a[ref.id].score})`,
          );
  }
  rows.push(row);
}
await chrome.kill();

console.log(
  "| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |\n|---|---|---|---|---|---|---|---|",
);
for (const r of rows)
  console.log(
    `| ${r.page} | ${r.performance} | ${r.accessibility} | ${r["best-practices"]} | ${r.seo} | ${r.LCP} | ${r.CLS} | ${r.TBT} |`,
  );
console.log(`\nlighthouse: ${failed} of ${PAGES.length} pages below the gate`);
process.exit(failed ? 1 : 0);
