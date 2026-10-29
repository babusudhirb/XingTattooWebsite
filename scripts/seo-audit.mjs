/**
 * Zero-mistake SEO gate against a running site, using the raw server HTML (no JavaScript).
 * Usage: node scripts/seo-audit.mjs [baseUrl=http://localhost:3000]
 * Production check: npm run build && npm run preview, then node scripts/seo-audit.mjs http://localhost:4173
 * Checks every sitemap URL plus every internal page reachable by links from /, fetched as
 * Googlebot Smartphone (Google indexes the mobile version).
 * Prints failures only and a summary; exits 1 when anything fails.
 */
import fs from "node:fs";
import { imageSize } from "image-size";
import { parse } from "node-html-parser";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const biz = await import(new URL("../src/data/business.ts", import.meta.url).href);
const SITE = biz.SITE_URL;
const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);
const norm = (s) => (s ?? "").replace(/\s+/g, " ").trim();
/** Text a sighted user reads as the label: skips aria-hidden parts, spaces between elements. */
function visibleText(node) {
  if (node.nodeType === 3) return node.text;
  if (
    node.getAttribute?.("aria-hidden") === "true" ||
    /sr-only/.test(node.getAttribute?.("class") ?? "")
  )
    return " ";
  return " " + node.childNodes.map(visibleText).join("") + " ";
}

const local = (u) => u.replace(SITE, BASE);
const UA =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
async function get(url, { redirect = "manual", method = "GET" } = {}) {
  return fetch(url, { redirect, method, headers: { "User-Agent": UA } });
}
const status = new Map();
async function statusOf(url) {
  if (!status.has(url))
    status.set(
      url,
      get(url).then((r) => r.status),
    );
  return status.get(url);
}
const htmlCache = new Map();
function htmlOf(path) {
  if (!htmlCache.has(path))
    htmlCache.set(
      path,
      get(BASE + path).then(async (r) =>
        r.status === 200 && /html/.test(r.headers.get("content-type") ?? "") ? r.text() : null,
      ),
    );
  return htmlCache.get(path);
}

// ── Expected Google tag: from the env the build used (.env.production / .env / process) ──
function envValue(name) {
  if (process.env[name]) return process.env[name];
  for (const f of [".env.production.local", ".env.production", ".env.local", ".env"]) {
    try {
      const m = fs
        .readFileSync(new URL(`../${f}`, import.meta.url), "utf8")
        .match(new RegExp(`^${name}=(.*)$`, "m"));
      if (m && m[1].trim()) return m[1].trim().replace(/^["']|["']$/g, "");
    } catch {}
  }
  return "";
}
const TAG_ID = envValue("VITE_GTM_ID") || envValue("VITE_GA_ID");

// ── Page rules ─────────────────────────────────────────────────────────────
const LEGAL = new Set(["/privacy-policy", "/terms-and-conditions", "/404"]);
/** Pages that may be noindex,follow: blog pagination, and /offer once the offer has ended. */
const mayNoindex = (p) => /^\/blog\/page\//.test(p) || (p === "/offer" && !biz.isOfferActive());
/** Blog posts and categories carry topic H1s; every other page H1 names the locality. */
const needsLocalH1 = (p) => !LEGAL.has(p) && !/^\/blog\/./.test(p);

const ALLOWED_HREF = {
  click_call: (h) => h === biz.PHONE_TEL,
  click_whatsapp: (h) => h === biz.WHATSAPP_URL || h.startsWith(`${biz.WHATSAPP_URL}?text=`),
  click_directions: (h) => h === biz.DIRECTIONS_URL,
};
const FORBIDDEN = [
  /XING Tattoo Studio/,
  /\bXing Tattoo Studio\b/,
  /D-Mart/,
  /\bA Block\b/,
  /Studio Cleanse/,
  /(?<![\d.])4\.8(?![\d])/,
  /\b600\+/,
  /\b1,600\b/,
  /\b5000\+/,
  /\b12 PM\b/,
  /(?<!\d)8 PM\b/,
  /Wednesday closed/i,
];
/** schema.org type of each page's WebPage node. */
const PAGE_TYPE = (p) =>
  p === "/about"
    ? "AboutPage"
    : p === "/contact"
      ? "ContactPage"
      : p === "/gallery"
        ? "ImageGallery"
        : p === "/tattoo-artist"
          ? "ProfilePage"
          : p === "/services" || /^\/blog(\/category\/|\/page\/|$)/.test(p)
            ? "CollectionPage"
            : "WebPage";
const INDEX_ROBOTS = "index,follow,max-image-preview:large";
const MAX_HTML = 150 * 1024;
const MAX_TTFB = 600;
const assetStatus = new Map();

const PHONE_LIKE = /(?:\+?91[\s-]?)?(?<!\d)[6-9]\d{4}[\s-]?\d{5}(?!\d)/g;
const PHONE_OK = new Set(["+91 89700 07818", "+918970007818", "918970007818"]);

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
const inSitemap = new Set(urls.map((u) => u.replace(SITE, "") || "/"));
if (!biz.isOfferActive() && inSitemap.has("/offer"))
  fail("/offer", "expired offer still in sitemap");

// ── Crawl: every internal page reachable from / ────────────────────────────
const seen = new Set(["/"]);
const queue = ["/"];
while (queue.length) {
  const p = queue.shift();
  const html = await htmlOf(p);
  if (!html) continue;
  for (const a of parse(html).querySelectorAll("a[href]")) {
    const href = (a.getAttribute("href") ?? "").split("#")[0];
    if (!href.startsWith("/") || href.startsWith("//") || /\.\w+$/.test(href) || seen.has(href))
      continue;
    seen.add(href);
    queue.push(href);
  }
}
for (const p of inSitemap) if (!seen.has(p)) fail(p, "orphan — not linked from any crawled page");
const pages = [...new Set([...inSitemap, ...seen])];

// ── Per-page checks ────────────────────────────────────────────────────────
const titles = new Map();
const descs = new Map();
const linked = new Set();
const anchors = []; // [fromPage, targetPath, id]
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

function urlShape(p) {
  if (p.includes("?")) return "has query string";
  if (p !== "/" && p.endsWith("/")) return "trailing slash";
  if (/\.html$/.test(p)) return ".html in URL";
  if (/[A-Z_ ]/.test(p)) return "not lowercase-hyphen";
  return "";
}

function checkBusiness(where, node) {
  const a = node.address ?? {};
  const want = {
    name: biz.BUSINESS_NAME,
    telephone: biz.PHONE_E164,
    email: biz.EMAIL,
    "address.streetAddress": biz.ADDRESS.street,
    "address.addressLocality": biz.ADDRESS.locality,
    "address.addressRegion": biz.ADDRESS.region,
    "address.postalCode": biz.ADDRESS.postalCode,
    "geo.latitude": biz.GEO.lat,
    "geo.longitude": biz.GEO.lng,
  };
  const got = {
    name: node.name,
    telephone: node.telephone,
    email: node.email,
    "address.streetAddress": a.streetAddress,
    "address.addressLocality": a.addressLocality,
    "address.addressRegion": a.addressRegion,
    "address.postalCode": a.postalCode,
    "geo.latitude": node.geo?.latitude,
    "geo.longitude": node.geo?.longitude,
  };
  for (const k of Object.keys(want))
    if (got[k] !== want[k]) fail(where, `schema ${k} "${got[k]}" ≠ "${want[k]}"`);
  if (node.aggregateRating || node.review) fail(where, "aggregateRating/review markup present");
}

for (const where of pages) {
  const url = SITE + (where === "/" ? "/" : where);
  const shape = urlShape(where);
  if (shape) fail(where, shape);
  const res = await get(BASE + where);
  if (res.status !== 200) {
    fail(where, `status ${res.status}`);
    continue;
  }
  if (!/html/.test(res.headers.get("content-type") ?? "")) continue;
  if (/noindex/i.test(res.headers.get("x-robots-tag") ?? "")) fail(where, "X-Robots-Tag noindex");
  const html = await res.text();
  // Crawl speed: time to first byte (fresh request) and raw HTML size
  {
    const t0 = performance.now();
    const r2 = await get(BASE + where);
    const ttfb = performance.now() - t0;
    await r2.arrayBuffer();
    if (ttfb > MAX_TTFB) fail(where, `TTFB ${Math.round(ttfb)} ms > ${MAX_TTFB} ms`);
  }
  const bytes = Buffer.byteLength(html);
  if (bytes > MAX_HTML) fail(where, `HTML ${Math.round(bytes / 1024)} KB > 150 KB`);
  const doc = parse(html);
  const attr = (sel, a = "content") => doc.querySelector(sel)?.getAttribute(a) ?? "";
  const isDev = html.includes("/@vite/client");

  const title = doc.querySelector("title")?.text.trim() ?? "";
  if (title.length < 30 || title.length > 60) fail(where, `title ${title.length} chars`);
  const desc = attr('meta[name="description"]');
  if (desc.length < 120 || desc.length > 158) fail(where, `description ${desc.length} chars`);
  const robotsMeta = doc.querySelectorAll('meta[name="robots"]');
  if (robotsMeta.length !== 1) fail(where, `${robotsMeta.length} robots meta tags`);
  const noindex = /noindex/i.test(attr('meta[name="robots"]'));
  if (noindex && !mayNoindex(where)) fail(where, "meta robots noindex");
  if (!noindex && attr('meta[name="robots"]') !== INDEX_ROBOTS)
    fail(where, `robots "${attr('meta[name="robots"]')}" ≠ "${INDEX_ROBOTS}"`);
  if (noindex && inSitemap.has(where)) fail(where, "noindex page in the sitemap");
  if (inSitemap.has(where)) {
    titles.set(title, [...(titles.get(title) ?? []), where]);
    descs.set(desc, [...(descs.get(desc) ?? []), where]);
  }

  // Headings: one H1, no run-ons, locality, no skipped levels
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length !== 1) fail(where, `${h1s.length} <h1>`);
  const h1 = norm(h1s[0]?.text);
  if (/[a-z][A-Z]/.test(h1.replace(/\b(?:McX|iPhone)\b/g, "")))
    fail(where, `H1 run-on text "${h1}"`);
  if (needsLocalH1(where) && !/Brookefield|Bangalore/.test(h1))
    fail(where, `H1 lacks Brookefield/Bangalore: "${h1}"`);
  let prev = 0;
  for (const h of doc.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
    const level = Number(h.tagName[1]);
    if (!h.text.trim()) fail(where, `empty <${h.tagName.toLowerCase()}>`);
    if (prev && level > prev + 1)
      fail(where, `heading skips h${prev}→h${level} ("${h.text.trim().slice(0, 40)}")`);
    prev = level;
  }

  // Canonical + Open Graph
  const canon = doc.querySelectorAll('link[rel="canonical"]');
  if (canon.length !== 1) fail(where, `${canon.length} canonical`);
  const canonical = canon[0]?.getAttribute("href") ?? "";
  if (canonical !== url) fail(where, `canonical ${canonical || "missing"} ≠ ${url}`);
  for (const p of ["og:title", "og:description", "og:image", "og:url"])
    if (!attr(`meta[property="${p}"]`)) fail(where, `missing ${p}`);
  if (attr('meta[property="og:url"]') !== canonical) fail(where, "og:url ≠ canonical");
  const og = attr('meta[property="og:image"]');
  if (og && !/^https:\/\//.test(og)) fail(where, "og:image not absolute");
  else if (og) {
    const err = await checkOgImage(og);
    if (err) fail(where, err);
  }

  // JSON-LD: exactly one script, parses, has #business with the data-file NAP
  const lds = doc.querySelectorAll('script[type="application/ld+json"]');
  if (lds.length !== 1) fail(where, `${lds.length} ld+json scripts (want 1)`);
  let graph = [];
  try {
    const data = JSON.parse(lds[0]?.text ?? "null");
    graph = data?.["@graph"] ?? (data ? [data] : []);
  } catch {
    fail(where, "JSON-LD does not parse");
  }
  const page = graph.find((n) => n["@id"] === `${url}#webpage`);
  const wantType = /^\/blog\/(?!category\/|page\/)[^/]+$/.test(where) ? null : PAGE_TYPE(where);
  if (!page) fail(where, "no #webpage node");
  else if (wantType && page["@type"] !== wantType)
    fail(where, `page node ${page["@type"]} ≠ ${wantType}`);
  if (
    /^\/blog\/(?!category\/|page\/)[^/]+$/.test(where) &&
    !graph.some((n) => n["@type"] === "BlogPosting")
  )
    fail(where, "no BlogPosting node");
  if (/^\/services\/[^/]+$/.test(where) && !graph.some((n) => n["@type"] === "Service"))
    fail(where, "no Service node");
  if (!graph.some((n) => n["@type"] === "WebSite")) fail(where, "no WebSite node");
  if (where !== "/" && !graph.some((n) => n["@type"] === "BreadcrumbList"))
    fail(where, "no BreadcrumbList");
  if (where !== "/" && !doc.querySelector('nav[aria-label="Breadcrumb"]'))
    fail(where, "no visible breadcrumbs");
  const business = graph.find((n) => n["@id"] === biz.BUSINESS_ID);
  if (!business) fail(where, "no #business node");
  else checkBusiness(where, business);
  const offerNode = JSON.stringify(graph).includes('"@type":"Offer","name"');
  if (where === "/offer" && !biz.isOfferActive() && offerNode)
    fail(where, "Offer schema after expiry");

  // FAQ: JSON-LD text identical to the visible accordion
  const qs = doc.querySelectorAll("[data-faq-q]").map((e) => norm(e.text));
  const as = doc.querySelectorAll("[data-faq-a]").map((e) => norm(e.text));
  const faqPage = graph.find((n) => n["@type"] === "FAQPage");
  if (qs.length !== as.length) fail(where, `FAQ ${qs.length} questions vs ${as.length} answers`);
  if (faqPage && !qs.length) fail(where, "FAQPage schema but no visible FAQ");
  if (qs.length && !faqPage) fail(where, "visible FAQ but no FAQPage schema");
  if (faqPage) {
    const items = faqPage.mainEntity ?? [];
    if (items.length !== qs.length) fail(where, `FAQPage ${items.length} vs ${qs.length} visible`);
    items.forEach((q, i) => {
      if (norm(q.name) !== qs[i]) fail(where, `FAQ question ${i + 1} differs: "${q.name}"`);
      if (norm(q.acceptedAnswer?.text) !== as[i])
        fail(where, `FAQ answer ${i + 1} differs ("${String(q.name).slice(0, 40)}")`);
    });
  }

  // NAP: header tel link; footer name, address, phone and the 7 hour lines
  {
    const headerTel = doc
      .querySelectorAll("header")
      .some((h) => h.querySelector(`a[href="${biz.PHONE_TEL}"]`));
    if (!headerTel) fail(where, "header has no tel: link");
    const footers = doc.querySelectorAll("footer");
    const footer = footers.find((f) => f.text.includes(biz.BUSINESS_NAME) && f.querySelector("dl"));
    if (!footer) fail(where, "no site footer with NAP");
    else {
      const ftext = norm(footer.text);
      for (const v of [biz.BUSINESS_NAME, biz.ADDRESS.full, biz.PHONE_DISPLAY])
        if (!ftext.includes(v)) fail(where, `footer lacks "${v}"`);
      const rows = footer.querySelectorAll("dl > div");
      const lines = rows.map(
        (r) => `${norm(r.querySelector("dt")?.text)} ${norm(r.querySelector("dd")?.text)}`,
      );
      const want = biz.HOURS.map((h) => `${h.long} ${h.closed ? "Closed" : biz.OPEN_LABEL}`);
      if (lines.join(" | ") !== want.join(" | "))
        fail(where, `footer hours "${lines.join(" | ")}" ≠ GBP 7 lines`);
      if (!footer.querySelector(`address a[href="${biz.MAPS_PLACE_URL}"]`))
        fail(where, "footer <address> not linked to Maps");
      const year = new Date().getFullYear();
      if (!ftext.includes(`© 2021–${year} ${biz.BUSINESS_NAME}`)) fail(where, "footer © line");
    }
  }

  // CTAs: allowed hrefs; accessible name contains the visible label (WCAG 2.5.3)
  for (const el of doc.querySelectorAll("[data-track]")) {
    const ev = el.getAttribute("data-track");
    const href = el.getAttribute("href") ?? "";
    if (ALLOWED_HREF[ev] && !ALLOWED_HREF[ev](href)) fail(where, `${ev} href not allowed: ${href}`);
    if (ev === "click_book_consultation" && el.tagName !== "BUTTON")
      fail(where, "booking CTA is not a button");
  }
  for (const a of doc.querySelectorAll('a[href^="tel:"]'))
    if (a.getAttribute("href") !== biz.PHONE_TEL)
      fail(where, `tel: link ${a.getAttribute("href")}`);
  for (const a of doc.querySelectorAll('a[href*="wa.me/"]')) {
    const h = a.getAttribute("href");
    if (!h.startsWith("https://wa.me/?text=") && !ALLOWED_HREF.click_whatsapp(h))
      fail(where, `WhatsApp link ${h}`);
  }
  for (const el of doc.querySelectorAll("a[aria-label], button[aria-label]")) {
    const visible = norm(visibleText(el)).toLowerCase();
    const label = norm(el.getAttribute("aria-label")).toLowerCase();
    if (visible && !label.includes(visible))
      fail(where, `aria-label "${label}" ≠ visible "${visible}"`);
  }

  // Forbidden strings (visible text + attributes) and stray phone numbers
  const body = doc.querySelector("body");
  for (const s of body?.querySelectorAll("script, style") ?? []) s.remove();
  const text = norm(body?.text) + " " + norm(html.match(/<head[\s\S]*<\/head>/)?.[0]);
  for (const re of FORBIDDEN) if (re.test(text)) fail(where, `forbidden string ${re}`);
  for (const m of text.matchAll(PHONE_LIKE))
    if (!PHONE_OK.has(m[0])) fail(where, `phone format "${m[0]}"`);

  // Content in the server HTML (no JavaScript): enough main text, gallery first batch
  const main = doc.querySelector("main");
  const words = norm(main?.text).split(" ").filter(Boolean).length;
  if (inSitemap.has(where) && words < 250)
    fail(where, `only ${words} words of main content in the HTML`);
  if (where === "/gallery" && (main?.querySelectorAll("img").length ?? 0) < 24)
    fail(where, "gallery first batch (24 photos) not in the HTML");
  for (const img of doc.querySelectorAll("main img")) {
    if (!img.hasAttribute("alt")) fail(where, `img without alt: ${img.getAttribute("src")}`);
    if (!img.getAttribute("width") || !img.getAttribute("height"))
      fail(where, `img without width/height: ${img.getAttribute("src")}`);
  }
  // Duplicate paragraphs (e.g. carousel clones rendered on the server)
  const paras = new Map();
  for (const el of doc.querySelectorAll("main p, main blockquote")) {
    if (el.tagName === "BLOCKQUOTE" && el.querySelector("p")) continue; // its <p> is counted
    const t = norm(el.text);
    if (t.length > 120) paras.set(t, (paras.get(t) ?? 0) + 1);
  }
  for (const [t, n] of paras)
    if (n > 1) fail(where, `paragraph repeated ${n}× in the HTML: "${t.slice(0, 50)}…"`);
  // Mixed content and assets: every same-origin script, style, image and icon answers 200
  for (const m of html.matchAll(/(?:src|href|srcset)="(http:\/\/[^"]+)"/g))
    fail(where, `mixed content ${m[1]}`);
  const assets = new Set();
  for (const el of doc.querySelectorAll(
    "script[src], link[href], img[src], source[srcset], img[srcset]",
  )) {
    const rel = el.getAttribute("rel") ?? "";
    if (el.tagName === "LINK" && !/stylesheet|icon|preload|modulepreload|manifest/.test(rel))
      continue;
    for (const part of [
      el.getAttribute("src"),
      el.getAttribute("href"),
      ...(el.getAttribute("srcset") ?? "").split(",").map((x) => x.trim().split(" ")[0]),
    ])
      if (part && part.startsWith("/") && !part.startsWith("//")) assets.add(part);
  }
  for (const a of assets) {
    if (!assetStatus.has(a))
      assetStatus.set(
        a,
        get(BASE + a, { method: "HEAD" }).then((r) => r.status),
      );
    const st = await assetStatus.get(a);
    if (st !== 200) fail(where, `asset ${a} answers ${st}`);
  }

  // Google tag: present only in a production build that set an ID
  const hasTag = /googletagmanager\.com/.test(html);
  const wantTag = Boolean(TAG_ID) && !isDev;
  if (hasTag !== wantTag)
    fail(
      where,
      `Google tag ${hasTag ? "present" : "missing"} (expected ${wantTag ? "present" : "absent"})`,
    );

  // Links and #anchors
  for (const a of doc.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (href.startsWith("#") && href.length > 1) anchors.push([where, where, href.slice(1)]);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const [path, hash] = href.split("#");
    const target = path || "/";
    linked.add(target);
    if (hash) anchors.push([where, target, hash]);
  }
}

// ── Internal links: every target answers 200 without a redirect ────────────
for (const target of linked) {
  const s = await statusOf(BASE + target);
  if (s !== 200) fail(target, `internal link returns ${s}`);
}
// ── #anchors exist on their target page ────────────────────────────────────
const idCache = new Map();
for (const [from, target, id] of anchors) {
  if (!idCache.has(target)) {
    const html = await htmlOf(target);
    idCache.set(
      target,
      new Set(
        html
          ? parse(html)
              .querySelectorAll("[id]")
              .map((e) => e.id)
          : [],
      ),
    );
  }
  if (!idCache.get(target).has(decodeURIComponent(id)))
    fail(from, `anchor ${target === from ? "" : target}#${id} has no target`);
}

for (const [t, where] of titles)
  if (where.length > 1) fail(where.join(", "), `duplicate title "${t}"`);
for (const [d, where] of descs)
  if (where.length > 1) fail(where.join(", "), `duplicate description`);

const unique = [...new Set(failures)];
for (const f of unique) console.log(f);
console.log(
  `\nseo-audit: ${unique.length} failures, ${pages.length} URLs (${urls.length} in sitemap), ${linked.size} link targets, ${anchors.length} anchors`,
);
process.exit(unique.length ? 1 : 0);
