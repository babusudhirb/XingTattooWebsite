/**
 * Mobile copy budget at 375×812: words visible before any "Read more" per page, and every
 * visible paragraph over 3 lines (the budget is 3 lines; longer copy goes behind ReadMore).
 * Usage: node scripts/qa/text-budget.mjs [base=http://localhost:4173] [--only=/,/about] [--json=file]
 */
import fs from "node:fs";

import { chromium } from "playwright-core";

const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:4173";
const ONLY = process.argv
  .find((a) => a.startsWith("--only="))
  ?.slice(7)
  .split(",");
const JSON_OUT = process.argv.find((a) => a.startsWith("--json="))?.slice(7);
const PAGES = ONLY ?? [
  "/",
  "/services",
  "/services/realism",
  "/services/portrait",
  "/services/black-grey",
  "/services/geometric",
  "/services/traditional",
  "/services/minimalist",
  "/gallery",
  "/tattoo-artist",
  "/faq",
  "/about",
  "/contact",
  "/blog",
];
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
].find((p) => fs.existsSync(p));

const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  isMobile: true,
  hasTouch: true,
});
const out = {};
for (const p of PAGES) {
  const page = await ctx.newPage();
  await page.goto(BASE + p, { waitUntil: "load" });
  out[p] = await page.evaluate(() => {
    const main = document.querySelector("main");
    const shown = (el) => {
      for (let e = el; e && e !== document.body; e = e.parentElement) {
        const s = getComputedStyle(e);
        if (s.display === "none" || s.visibility === "hidden") return false;
        if (e.classList.contains("sr-only")) return false;
      }
      return true;
    };
    let words = 0;
    const long = [];
    for (const el of main.querySelectorAll("p, li, dd, blockquote > p")) {
      if (el.closest("nav, footer, header, button, a") || !shown(el)) continue;
      if (el.querySelector("p, li")) continue;
      const text = el.textContent.trim().replace(/\s+/g, " ");
      if (!text) continue;
      const n = text.split(" ").length;
      const clamp = el.closest(".read-more-clamp, .line-clamp-2, .line-clamp-3, .line-clamp-4");
      const box = clamp ?? el;
      const ratio = clamp ? Math.min(1, box.clientHeight / Math.max(1, box.scrollHeight)) : 1;
      words += Math.round(n * ratio);
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 24;
      const lines = Math.round(el.getBoundingClientRect().height / lh);
      const linkText = [...el.querySelectorAll("a")].reduce((n, a) => n + a.textContent.length, 0);
      const maxLines = el.closest(".review-card") ? 4 : 3; // reviews: 4-line clamp by design
      const exempt =
        el.closest("[data-faq-a], address") ||
        el.tagName === "LI" ||
        linkText > text.length / 2 || // a row of links, not copy
        /560037/.test(text); // the full GBP address is shown whole
      if (!clamp && lines > maxLines && !exempt)
        long.push(`${lines} lines, ${n} words: "${text.slice(0, 60)}…"`);
    }
    return { words, long };
  });
  await page.close();
}
await browser.close();
for (const [p, r] of Object.entries(out)) {
  console.log(
    `${p}: ${r.words} words visible before Read more; ${r.long.length} paragraphs over 3 lines`,
  );
  for (const l of r.long) console.log(`    ${l}`);
}
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 2));
