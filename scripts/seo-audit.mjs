/**
 * Indexing audit against a running site, using the raw server HTML (no JavaScript).
 * Usage: node scripts/seo-audit.mjs [baseUrl=http://localhost:3000]
 * Production check: npm run build && npm run preview, then node scripts/seo-audit.mjs http://localhost:4173
 * Prints failures only and a summary; exits 1 when anything fails.
 */
import { imageSize } from "image-size";
import { parse } from "node-html-parser";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const biz = await import(new URL("../src/data/business.ts", import.meta.url).href);
const SITE = biz.SITE_URL;
const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);

const local = (u) => u.replace(SITE, BASE);
const status = new Map();
async function get(url, { redirect = "manual", method = "GET" } = {}) {
  const res = await fetch(url, { redirect, method });
  return res;
}
async function statusOf(url) {
  if (!status.has(url))
    status.set(
      url,
      get(url).then((r) => r.status),
    );
  return status.get(url);
}

// ── robots.txt and sitemaps ────────────────────────────────────────────────
const robots = await (await get(`${BASE}/robots.txt`)).text();
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail("/robots.txt", "no Sitemap: line");
if (/Disallow:\s*\/(assets|blog|gallery)?\s*$/m.test(robots.replace(/Disallow: \/api\/\s*$/m, "")))
  fail("/robots.txt", "blocks pages or assets");

async function sitemapUrls(url) {
  const res = await get(local(url));
  if (res.status !== 200) return (fail(url, `sitemap status ${res.status}`), []);
  if (!/xml/.test(res.headers.get("content-type") ?? ""))
    fail(url, `content-type ${res.headers.get("content-type")}`);
  const body = await res.text();
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (/<sitemapindex/.test(body)) return (await Promise.all(locs.map(sitemapUrls))).flat();
  if (/<changefreq>|<priority>/.test(body)) fail(url, "changefreq/priority present");
  for (const m of body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g))
    if (!/^\d{4}-\d{2}-\d{2}/.test(m[1])) fail(url, `lastmod ${m[1]}`);
  return locs;
}
const urls = await sitemapUrls(`${SITE}/sitemap.xml`);
if (!urls.length) fail("/sitemap.xml", "no URLs");

// ── Per-page checks ────────────────────────────────────────────────────────
const titles = new Map();
const descs = new Map();
const linked = new Set();
const ogChecked = new Map();

async function checkOgImage(src) {
  if (!ogChecked.has(src)) {
    ogChecked.set(
      src,
      (async () => {
        const res = await get(local(src));
        if (res.status !== 200) return `og:image status ${res.status}`;
        const { width = 0, height = 0 } = imageSize(new Uint8Array(await res.arrayBuffer()));
        return width >= 1200 && height >= 630 ? "" : `og:image ${width}×${height} < 1200×630`;
      })(),
    );
  }
  return ogChecked.get(src);
}

function urlShape(u) {
  const { pathname, search } = new URL(u);
  if (search) return "has query string";
  if (pathname !== "/" && pathname.endsWith("/")) return "trailing slash";
  if (/\.html$/.test(pathname)) return ".html in URL";
  if (/[A-Z_ ]/.test(pathname)) return "not lowercase-hyphen";
  return "";
}

for (const url of urls) {
  const where = url.replace(SITE, "") || "/";
  const shape = urlShape(url);
  if (shape) fail(where, shape);
  const res = await get(local(url));
  if (res.status !== 200) {
    fail(where, `status ${res.status}`);
    continue;
  }
  if (/noindex/i.test(res.headers.get("x-robots-tag") ?? "")) fail(where, "X-Robots-Tag noindex");
  const doc = parse(await res.text());
  const attr = (sel, a = "content") => doc.querySelector(sel)?.getAttribute(a) ?? "";

  const title = doc.querySelector("title")?.text.trim() ?? "";
  if (title.length < 30 || title.length > 60) fail(where, `title ${title.length} chars`);
  titles.set(title, [...(titles.get(title) ?? []), where]);
  const desc = attr('meta[name="description"]');
  if (desc.length < 120 || desc.length > 158) fail(where, `description ${desc.length} chars`);
  descs.set(desc, [...(descs.get(desc) ?? []), where]);
  if (/noindex/i.test(attr('meta[name="robots"]'))) fail(where, "meta robots noindex");

  const h1s = doc.querySelectorAll("h1");
  if (h1s.length !== 1) fail(where, `${h1s.length} <h1>`);
  let prev = 0;
  for (const h of doc.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
    const level = Number(h.tagName[1]);
    if (!h.text.trim()) fail(where, `empty <${h.tagName.toLowerCase()}>`);
    if (prev && level > prev + 1)
      fail(where, `heading skips h${prev}→h${level} ("${h.text.trim().slice(0, 40)}")`);
    prev = level;
  }

  const canon = doc.querySelectorAll('link[rel="canonical"]');
  if (canon.length !== 1) fail(where, `${canon.length} canonical`);
  const canonical = canon[0]?.getAttribute("href") ?? "";
  if (canonical !== url) fail(where, `canonical ${canonical || "missing"} ≠ ${url}`);

  for (const p of ["og:title", "og:description", "og:image", "og:url"])
    if (!attr(`meta[property="${p}"]`)) fail(where, `missing ${p}`);
  if (attr('meta[property="og:url"]') && attr('meta[property="og:url"]') !== canonical)
    fail(where, "og:url ≠ canonical");
  const og = attr('meta[property="og:image"]');
  if (og && !/^https:\/\//.test(og)) fail(where, "og:image not absolute");
  else if (og) {
    const err = await checkOgImage(og);
    if (err) fail(where, err);
  }

  const lds = doc.querySelectorAll('script[type="application/ld+json"]');
  let hasBusiness = false;
  for (const s of lds) {
    try {
      if (JSON.stringify(JSON.parse(s.text)).includes("#business")) hasBusiness = true;
    } catch {
      fail(where, "JSON-LD does not parse");
    }
  }
  if (!lds.length || !hasBusiness) fail(where, "no JSON-LD with #business");

  for (const img of doc.querySelectorAll("img")) {
    const src = img.getAttribute("src") ?? "?";
    const decorative =
      img.closest('[aria-hidden="true"]') ||
      /presentation|none/.test(img.getAttribute("role") ?? "");
    const alt = img.getAttribute("alt");
    if (alt === undefined || alt === null) fail(where, `img without alt ${src}`);
    else if (!alt.trim() && !decorative) fail(where, `empty alt on non-decorative img ${src}`);
    if (!img.getAttribute("width") || !img.getAttribute("height"))
      fail(where, `img without width/height ${src}`);
  }

  for (const a of doc.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const target = href.split("#")[0] || "/";
    linked.add(target);
  }
}

// ── Internal links: every target answers 200 without a redirect ────────────
for (const target of linked) {
  const s = await statusOf(BASE + target);
  if (s !== 200) fail(target, `internal link returns ${s}`);
}

// ── Orphans: every sitemap URL is reachable by following links from / ─────
const seen = new Set(["/"]);
const queue = ["/"];
while (queue.length) {
  const p = queue.shift();
  const res = await get(BASE + p);
  if (res.status !== 200 || !/html/.test(res.headers.get("content-type") ?? "")) continue;
  for (const a of parse(await res.text()).querySelectorAll("a[href]")) {
    const href = (a.getAttribute("href") ?? "").split("#")[0];
    if (!href.startsWith("/") || href.startsWith("//") || /\.\w+$/.test(href) || seen.has(href))
      continue;
    seen.add(href);
    queue.push(href);
  }
}
for (const url of urls) {
  const p = url.replace(SITE, "") || "/";
  if (!seen.has(p)) fail(p, "orphan — not linked from any crawled page");
}

for (const [t, where] of titles)
  if (where.length > 1) fail(where.join(", "), `duplicate title "${t}"`);
for (const [d, where] of descs)
  if (where.length > 1) fail(where.join(", "), `duplicate description`);

for (const f of failures) console.log(f);
console.log(
  `\nseo-audit: ${urls.length} sitemap URLs, ${linked.size} link targets, ${failures.length} failures`,
);
process.exit(failures.length ? 1 : 0);
