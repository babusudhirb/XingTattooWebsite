/**
 * NAP guard: every page must match the GBP snapshot in src/data/business.ts exactly.
 * Usage: npm run build && npm run preview, then npm run check:nap  (base URL defaults to :4173)
 *   1. Pages = every sitemap URL + every internal page crawled from /, raw HTML (no JS).
 *   2. Fails on old/variant address, landmark, name, phone, hours, rating and ₹ strings.
 *   3. Fails when the TattooParlor JSON-LD differs from the data file (exactly one per page).
 *   4. Fails when the footer lacks the full name, full address, phone or the 7 hour lines.
 *   5. Fails on address/phone/hours string literals in src/ or content/ outside the data file.
 *   6. Fails on counts (years, tattoos, clients), offer wording/dates or service-name variants
 *      that differ from the data file, on every page and in llms.txt / llms-full.txt / rss.xml.
 * Prints failures and "N failures, M URLs"; exits 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.argv[2] ?? "http://localhost:4173").replace(/\/$/, "");
const biz = await import(new URL("../src/data/business.ts", import.meta.url).href);
const SITE = biz.SITE_URL;
const DATA_FILE = path.join("src", "data", "business.ts");

const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim();

// ── Patterns (§2) ──────────────────────────────────────────────────────────
const ALLOWED_SV = [biz.ADDRESS.full, biz.ADDRESS.street, biz.SHORT_ADDRESS, biz.ADDRESS.landmark];
const PATTERNS = [
  [/1st floor|first floor/, "floor spelling (use “First Floor”)"],
  [/D-Mart|DMart|Dmart|D Mart|DMART(?! Ready)/, "landmark casing (use “DMART Ready”)"],
  [/XING Tattoo Studio|Xing Tattoo Studio|XING TATTOO STUDIO/i, "old business name"],
  [/\b10 AM\b|\b9 PM\b/, "short time format (use 10:00 AM – 9:00 PM)"],
  [/Tuesday(?:\s*[:–-]\s*|\s+)(?!Closed\b|is\b|(?:\(|’|'))[A-Za-z0-9]/, "Tuesday label ≠ Closed"],
  [/(?<![\d.])(?!4\.9)\d\.\d★|(?<![\d.])4\.8(?!\d)/, "rating ≠ 4.9★"],
  [/₹/, "₹ figure"],
];
const PHONE_LIKE = /(?:\+?91[\s-]?|0)?(?<!\d)[6-9]\d{3,4}[\s-]?\d{5,6}(?!\d)/g;
const PHONE_OK = new Set(["+91 89700 07818", "+918970007818", "918970007818"]);

/** Element text with a space between elements, so "4.9" + "200+" never reads as "4.9200+". */
const spaced = (node) =>
  node.nodeType === 3 ? node.text : " " + node.childNodes.map(spaced).join("") + " ";

function scanText(where, text) {
  // Every "SV Plaza" must sit inside one of the data-file forms
  const covered = [];
  for (const v of ALLOWED_SV)
    for (let i = text.indexOf(v); i !== -1; i = text.indexOf(v, i + 1))
      covered.push([i, i + v.length]);
  for (const m of text.matchAll(/SV Plaza/g))
    if (!covered.some(([a, b]) => m.index >= a && m.index < b))
      fail(where, `SV Plaza variant "${text.slice(Math.max(0, m.index - 40), m.index + 60)}"`);
  for (const m of text.matchAll(/([\d,]+\+?) Google reviews/g))
    if (m[1] !== "200+") fail(where, `review count ≠ 200+ Google reviews: "${m[0]}"`);
  // The same counts everywhere (src/data/business.ts COUNTS)
  for (const m of text.matchAll(/(\d[\d,]*\+?) years?(?: of)?(?: tattooing)? experience/g))
    if (m[1] !== biz.COUNTS.years) fail(where, `years ≠ ${biz.COUNTS.years}: "${m[0]}"`);
  for (const m of text.matchAll(/(\d[\d,]*\+) tattoos/g))
    if (m[1] !== biz.COUNTS.tattoos) fail(where, `tattoo count ≠ ${biz.COUNTS.tattoos}: "${m[0]}"`);
  for (const m of text.matchAll(/(\d[\d,]*\+) (?:happy )?clients/g))
    if (m[1] !== biz.COUNTS.clients) fail(where, `client count ≠ ${biz.COUNTS.clients}: "${m[0]}"`);
  if (/more than 15 years/i.test(text))
    fail(where, `"more than 15 years" (use ${biz.COUNTS.years} years)`);
  // Offer: one wording, the data-file dates only
  for (const m of text.matchAll(/Up to (\d+)% off/g))
    if (m[1] !== "50") fail(where, `offer wording "${m[0]}"`);
  for (const m of text.matchAll(/(\d{1,2}) (Oct|Nov) 2026/g))
    if (![biz.OFFER.startsLabel, biz.OFFER.endsLabel].includes(m[0]))
      fail(where, `offer date "${m[0]}" not in OFFER`);
  if (/Traditional Indian/.test(text))
    fail(where, `service name "Traditional Indian" (use "Indian Traditional")`);
  for (const [re, label] of PATTERNS) {
    const m = text.match(re);
    if (m) fail(where, `${label}: "${m[0]}"`);
  }
  for (const m of text.matchAll(PHONE_LIKE))
    if (!PHONE_OK.has(m[0])) fail(where, `phone format "${m[0]}"`);
}

// ── Pages: sitemap + crawl ─────────────────────────────────────────────────
async function sitemapUrls(url) {
  const res = await fetch(url.replace(SITE, BASE));
  if (res.status !== 200) return (fail(url, `status ${res.status}`), []);
  const body = await res.text();
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return /<sitemapindex/.test(body) ? (await Promise.all(locs.map(sitemapUrls))).flat() : locs;
}
const pages = new Set(
  (await sitemapUrls(`${SITE}/sitemap.xml`)).map((u) => u.replace(SITE, "") || "/"),
);
const queue = ["/"];
const seen = new Set(queue);
const html = new Map();
while (queue.length) {
  const p = queue.shift();
  const res = await fetch(BASE + p, { redirect: "manual" });
  if (res.status !== 200 || !/html/.test(res.headers.get("content-type") ?? "")) continue;
  const body = await res.text();
  html.set(p, body);
  for (const a of parse(body).querySelectorAll("a[href]")) {
    const href = (a.getAttribute("href") ?? "").split("#")[0];
    if (href.startsWith("/") && !href.startsWith("//") && !/\.\w+$/.test(href) && !seen.has(href)) {
      seen.add(href);
      queue.push(href);
    }
  }
}
for (const p of pages) seen.add(p);

const hoursSpec = JSON.stringify([
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: biz.HOURS.filter((h) => !h.closed).map((h) => h.long),
    opens: biz.OPEN_TIME,
    closes: biz.CLOSE_TIME,
  },
]);

for (const where of seen) {
  let body = html.get(where);
  if (body === undefined) {
    const res = await fetch(BASE + where, { redirect: "manual" });
    if (res.status !== 200) {
      fail(where, `status ${res.status}`);
      continue;
    }
    body = await res.text();
  }
  const doc = parse(body);

  // JSON-LD: exactly one TattooParlor, equal to the data file
  const graph = doc.querySelectorAll('script[type="application/ld+json"]').flatMap((s) => {
    try {
      const d = JSON.parse(s.text);
      return d["@graph"] ?? [d];
    } catch {
      fail(where, "JSON-LD does not parse");
      return [];
    }
  });
  const parlors = graph.filter((n) => n["@type"] === "TattooParlor");
  if (parlors.length !== 1) fail(where, `${parlors.length} TattooParlor nodes`);
  const b = parlors[0];
  if (b) {
    const checks = {
      name: [b.name, biz.BUSINESS_NAME],
      streetAddress: [b.address?.streetAddress, biz.ADDRESS.street],
      postalCode: [b.address?.postalCode, biz.ADDRESS.postalCode],
      addressLocality: [b.address?.addressLocality, biz.ADDRESS.locality],
      telephone: [b.telephone, biz.PHONE_E164],
      geo: [`${b.geo?.latitude},${b.geo?.longitude}`, `${biz.GEO.lat},${biz.GEO.lng}`],
      openingHoursSpecification: [JSON.stringify(b.openingHoursSpecification), hoursSpec],
    };
    for (const [k, [got, want]] of Object.entries(checks))
      if (got !== want) fail(where, `schema ${k} "${got}" ≠ "${want}"`);
    if (b.aggregateRating || b.review || b.priceRange)
      fail(where, "rating/review/priceRange in schema");
  }

  // Footer: full name, full address, phone, 7 hour lines
  const footer = doc.querySelectorAll("footer").find((f) => f.querySelector("dl"));
  if (!footer) fail(where, "no NAP footer");
  else {
    const t = norm(footer.text);
    for (const v of [biz.BUSINESS_NAME, biz.ADDRESS.full, biz.PHONE_DISPLAY])
      if (!t.includes(v)) fail(where, `footer lacks "${v}"`);
    const lines = footer
      .querySelectorAll("dl > div")
      .map((r) => `${norm(r.querySelector("dt")?.text)} ${norm(r.querySelector("dd")?.text)}`);
    const want = biz.HOURS.map((h) => `${h.long} ${h.closed ? "Closed" : biz.OPEN_LABEL}`);
    if (lines.join("|") !== want.join("|")) fail(where, `footer hours "${lines.join(" | ")}"`);
  }

  // Visible text + head (meta, OG, JSON-LD) — scripts other than JSON-LD and styles dropped
  for (const s of doc.querySelectorAll('script:not([type="application/ld+json"]), style'))
    s.remove();
  const bodyEl = doc.querySelector("body");
  const text = norm(doc.querySelector("head")?.toString() + " " + (bodyEl ? spaced(bodyEl) : ""));
  scanText(where, text);
}

// ── Static text files served from the build ────────────────────────────────
for (const f of [
  "/llms.txt",
  "/llms-full.txt",
  "/site.webmanifest",
  "/robots.txt",
  "/blog/rss.xml",
]) {
  const res = await fetch(BASE + f);
  if (res.status !== 200) fail(f, `status ${res.status}`);
  else scanText(f, await res.text());
}
const robots = await (await fetch(`${BASE}/robots.txt`)).text();
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail("/robots.txt", "no Sitemap: line");
const llms = await (await fetch(`${BASE}/llms.txt`)).text();
for (const v of [
  biz.BUSINESS_NAME,
  biz.ADDRESS.full,
  biz.PHONE_DISPLAY,
  biz.MAPS_PLACE_URL,
  biz.HOURS_TEXT,
  biz.RATING_LABEL,
])
  if (!llms.includes(v)) fail("/llms.txt", `lacks "${v}"`);

// ── Source literals outside the data file ──────────────────────────────────
const LITERAL = /SV Plaza|8970007818|10:00 AM/;
function walk(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) walk(rel);
    else if (/\.(ts|tsx|md|mdx|json)$/.test(e.name) && rel !== DATA_FILE)
      fs.readFileSync(path.join(ROOT, rel), "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (LITERAL.test(line))
            fail(`${rel}:${i + 1}`, `literal outside data file: ${norm(line).slice(0, 80)}`);
        });
  }
}
walk("src");
walk("content");

const unique = [...new Set(failures)];
for (const f of unique) console.log(f);
console.log(`\ncheck:nap: ${unique.length} failures, ${seen.size} URLs`);
process.exit(unique.length ? 1 : 0);
