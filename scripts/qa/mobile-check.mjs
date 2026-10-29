/**
 * Mobile gate: every sitemap URL at 7 viewports in real Chrome (playwright-core), against the
 * production preview. Fails on: horizontal overflow, visible text under 12px, tap targets under
 * 44×44 (inline links in running text are exempt, as in WCAG 2.5.8), an H1 over 3 lines on
 * phones, hero CTAs below the first viewport, the sticky bar covering a link or button at the
 * bottom of the page, fixed/sticky bars without safe-area insets, console errors and failed
 * requests. Saves a full-page screenshot per page and size to qa/screens/.
 *
 * Usage: node scripts/qa/mobile-check.mjs [base=http://localhost:4173] [--only=/,/gallery] [--no-shots]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright-core";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:4173";
const ONLY = process.argv
  .find((a) => a.startsWith("--only="))
  ?.slice(7)
  .split(",");
const SHOTS = !process.argv.includes("--no-shots");
const SITE = "https://www.xingtattoo.in";
const SHOT_DIR = path.join(APP, "qa/screens");
const CONCURRENCY = 4;

const SIZES = [
  { w: 360, h: 740, phone: true },
  { w: 375, h: 812, phone: true },
  { w: 390, h: 844, phone: true },
  { w: 430, h: 932, phone: true },
  { w: 844, h: 390, phone: true, landscape: true },
  { w: 768, h: 1024 },
  { w: 1280, h: 800 },
];
/** Pages whose hero carries CTAs that must be visible without scrolling. */
const HERO_CTA = (p) =>
  p === "/" || /^\/services\/[^/]+$/.test(p) || ["/contact", "/tattoo-artist"].includes(p);

const CHROME =
  [
    process.env["CHROME_PATH"],
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => p && fs.existsSync(p)) ?? undefined;

async function sitemapPaths() {
  const idx = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const out = [];
  for (const [, sm] of idx.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (sm.includes("sitemap-images")) continue;
    const xml = await (await fetch(sm.replace(SITE, BASE))).text();
    for (const [, u] of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g))
      out.push(u.replace(SITE, "") || "/");
  }
  return out;
}

/** Runs in the page. Returns a list of problems. */
function inspect({ phone, landscape, heroCta }) {
  const problems = [];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) return false;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) return false;
    if (el.closest("[aria-hidden='true'], [inert], .sr-only, [hidden]")) return false;
    return true;
  };
  const label = (el) =>
    `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || el.getAttribute("href") || "").trim().replace(/\s+/g, " ").slice(0, 40)}"`;

  // 1. Horizontal overflow
  const sw = document.documentElement.scrollWidth;
  if (sw > vw) problems.push(`horizontal overflow: scrollWidth ${sw} > ${vw}`);

  // 2. Visible text under 12px
  const small = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || small.has(el) || el.closest("script, style, noscript, svg")) continue;
    if (parseFloat(getComputedStyle(el).fontSize) < 12 && visible(el)) small.add(el);
  }
  for (const el of [...small].slice(0, 5))
    problems.push(`text ${getComputedStyle(el).fontSize}: ${label(el)}`);

  // 3. Tap targets ≥ 44×44 (inline links inside running text are exempt)
  const RUNNING = "p, li, dd, td, blockquote, figcaption, label, address";
  for (const el of document.querySelectorAll(
    "a[href], button, [role='button'], input:not([type='hidden']), select, textarea, summary",
  )) {
    if (!visible(el)) continue;
    if (el.tagName === "A" && getComputedStyle(el).display === "inline" && el.closest(RUNNING)) {
      const block = el.closest(RUNNING);
      if (block.textContent.trim().length > el.textContent.trim().length + 3) continue;
    }
    if (el.closest(".blog-prose")) continue; // article body links are inline text
    // Stretched links (::after covers the card): the whole card is the tap target
    const after = getComputedStyle(el, "::after");
    const r =
      after.position === "absolute" && after.content !== "none"
        ? (el.offsetParent ?? el).getBoundingClientRect()
        : el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44)
      problems.push(`tap target ${Math.round(r.width)}×${Math.round(r.height)}: ${label(el)}`);
  }

  // 4. H1 at most 3 lines on phones
  const h1 = document.querySelector("h1");
  if (h1 && phone) {
    const lh =
      parseFloat(getComputedStyle(h1).lineHeight) ||
      parseFloat(getComputedStyle(h1).fontSize) * 1.2;
    const lines = Math.round(h1.getBoundingClientRect().height / lh);
    if (lines > 3) problems.push(`H1 ${lines} lines`);
  }

  // 5. Hero CTAs in the first viewport
  if (heroCta) {
    const main = document.querySelector("main");
    const cta = [
      ...main.querySelectorAll(
        "[data-track='click_book_consultation'], [data-track='click_whatsapp'], [data-track='click_call']",
      ),
    ].filter((el) => !el.closest(".mobile-action-bar, header, footer") && visible(el))[0];
    const bar = document.querySelector(".mobile-action-bar");
    // Landscape phones are too short for a hero: there the sticky bar's CTAs count
    if (landscape && bar && visible(bar) && bar.getBoundingClientRect().bottom <= vh) {
      /* CTAs visible in the bar */
    } else if (!cta) problems.push("no hero CTA");
    else if (cta.getBoundingClientRect().bottom > vh)
      problems.push(
        `hero CTA below the fold (bottom ${Math.round(cta.getBoundingClientRect().bottom)} > ${vh})`,
      );
  }

  // 6. Fixed/sticky bars respect the safe areas (checked on the CSS rules that style them)
  const rulesFor = (el) => {
    const out = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      const visit = (list) => {
        for (const rule of list) {
          if (rule.cssRules && !rule.selectorText) visit(rule.cssRules);
          else if (rule.selectorText) {
            try {
              if (el.matches(rule.selectorText)) out.push(rule.cssText);
            } catch {}
          }
        }
      };
      visit(rules);
    }
    return out.join("\n") + (el.getAttribute("style") ?? "");
  };
  for (const el of document.querySelectorAll("header, .mobile-action-bar")) {
    if (!visible(el)) continue;
    const pos = getComputedStyle(el).position;
    if (pos !== "fixed" && pos !== "sticky") continue;
    if (!/safe-area-inset|var\(--sa[tblr]\)|--action-bar-h/.test(rulesFor(el)))
      problems.push(
        `${el.tagName.toLowerCase()}.${el.className.split(" ")[0]} (${pos}) has no safe-area inset`,
      );
  }
  return problems;
}

/** After scrolling to the bottom: nothing tappable sits under the sticky bar. */
async function stickyOverlap() {
  // Scroll to the very bottom after the last lazy section has laid out (two frames each)
  const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  for (let i = 0; i < 3; i++) {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await frames();
  }
  const bar = document.querySelector(".mobile-action-bar");
  if (!bar || getComputedStyle(bar).display === "none") return [];
  const b = bar.getBoundingClientRect();
  const out = [];
  for (const el of document.querySelectorAll(
    "main a[href], main button, footer a[href], footer button",
  )) {
    if (bar.contains(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1 || r.bottom <= 0 || r.top >= window.innerHeight) continue;
    if (r.bottom > b.top + 1 && r.top < b.bottom)
      out.push(
        `sticky bar covers ${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"`,
      );
  }
  return out;
}

const pages = ONLY ?? (await sitemapPaths());
if (SHOTS) fs.mkdirSync(SHOT_DIR, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const results = [];
const jobs = pages.flatMap((p) => SIZES.map((size) => ({ p, size })));

async function run({ p, size }) {
  const context = await browser.newContext({
    viewport: { width: size.w, height: size.h },
    deviceScaleFactor: 1,
    isMobile: !!size.phone,
    hasTouch: !!size.phone,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const problems = [];
  page.on(
    "console",
    (m) => m.type() === "error" && problems.push(`console: ${m.text().slice(0, 120)}`),
  );
  page.on("pageerror", (e) => problems.push(`page error: ${e.message.slice(0, 120)}`));
  page.on("requestfailed", (r) => {
    const u = r.url();
    // Third-party maps/analytics may be blocked in a headless run; our own files must load
    if (u.startsWith(BASE))
      problems.push(`request failed: ${u.replace(BASE, "")} (${r.failure()?.errorText})`);
  });
  page.on("response", (r) => {
    if (r.url().startsWith(BASE) && r.status() >= 400)
      problems.push(`HTTP ${r.status()}: ${r.url().replace(BASE, "")}`);
  });
  try {
    await page.goto(BASE + p, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(300);
    problems.push(
      ...(await page.evaluate(inspect, {
        phone: !!size.phone && !size.landscape,
        landscape: !!size.landscape,
        heroCta: HERO_CTA(p),
      })),
    );
    // Until the height settles: content-visibility sections and lazy images change it
    let last = -1;
    for (let i = 0; i < 8; i++) {
      const h = await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        return document.documentElement.scrollHeight;
      });
      await page.waitForTimeout(400);
      if (h === last) break;
      last = h;
    }
    problems.push(...(await page.evaluate(stickyOverlap)));
    if (SHOTS) {
      const name = `${p === "/" ? "home" : p.slice(1).replace(/\//g, "_")}@${size.w}x${size.h}.jpg`;
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(SHOT_DIR, name),
        fullPage: true,
        type: "jpeg",
        quality: 55,
      });
    }
  } catch (e) {
    problems.push(`load: ${e.message.split("\n")[0]}`);
  }
  await context.close();
  results.push({ p, size: `${size.w}×${size.h}`, problems: [...new Set(problems)] });
}

const queue = [...jobs];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await run(queue.shift());
  }),
);
await browser.close();

const failed = results.filter((r) => r.problems.length);
for (const r of failed.sort((a, b) => a.p.localeCompare(b.p)))
  for (const pr of r.problems) console.log(`${r.p} @${r.size}: ${pr}`);
console.log(
  `\nmobile-check: ${pages.length} pages × ${SIZES.length} sizes = ${results.length} runs, ${failed.length} with problems` +
    (SHOTS ? `; screenshots in qa/screens/` : ""),
);
process.exit(failed.length ? 1 : 0);
