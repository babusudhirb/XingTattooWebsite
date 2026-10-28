/**
 * Runs after `vite build` (see package.json). Reads the prerendered pages in .output/public and writes:
 *   sitemap.xml (index) → sitemap-pages.xml + sitemap-blog.xml   indexable canonical pages only, with images
 *   robots.txt, llms.txt
 *   the 301 rules from scripts/redirects.mjs into .output/public/.htaccess
 * Business values come from src/data/business.ts — never copied here.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "node-html-parser";

import { REDIRECTS } from "./redirects.mjs";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(APP, ".output/public");
const biz = await import(new URL("../src/data/business.ts", import.meta.url).href);
const SITE = biz.SITE_URL;

/** Source files whose edits change each page — their newest mtime is the page's <lastmod>. */
const SHARED = [
  "src/data/business.ts",
  "src/components/layout/SiteFooter.tsx",
  "src/components/layout/SiteHeader.tsx",
];
const SOURCES = [
  [
    /^\/$/,
    [
      "src/routes/index.tsx",
      "src/data/services.ts",
      "src/data/faqs.ts",
      "src/data/reviews.ts",
      "src/data/gallery.ts",
    ],
  ],
  [/^\/about$/, ["src/routes/about.tsx", "src/data/about.ts"]],
  [/^\/faq$/, ["src/routes/faq.tsx", "src/data/faqs.ts"]],
  [/^\/offer$/, ["src/routes/offer.tsx", "src/data/offer.ts"]],
  [/^\/tattoo-artist$/, ["src/routes/tattoo-artist.tsx", "src/data/artist.ts"]],
  [/^\/services$/, ["src/routes/services/index.tsx", "src/data/services.ts"]],
  [
    /^\/services\/[^/]+$/,
    [
      "src/routes/services/$slug.tsx",
      "src/data/services.ts",
      "src/components/services/ServiceTemplate.tsx",
    ],
  ],
  [/^\/privacy-policy$/, ["src/routes/privacy-policy.tsx", "src/components/layout/LegalPage.tsx"]],
  [
    /^\/terms-and-conditions$/,
    ["src/routes/terms-and-conditions.tsx", "src/components/layout/LegalPage.tsx"],
  ],
];

/** YYYY-MM-DD in the studio's time zone. */
const day = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);
const mtime = (files) =>
  day(
    new Date(Math.max(...[...files, ...SHARED].map((f) => fs.statSync(path.join(APP, f)).mtimeMs))),
  );
const xml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? htmlFiles(p) : e.name.endsWith(".html") ? [p] : [];
  });
}

// ── Read every prerendered page ────────────────────────────────────────────
// A page cut off mid-stream must never ship: fail the build instead.
const truncated = htmlFiles(OUT).filter(
  (f) => !fs.readFileSync(f, "utf8").trimEnd().endsWith("</html>"),
);
if (truncated.length) throw new Error(`[postbuild] truncated pages: ${truncated.join(", ")}`);

const pages = htmlFiles(OUT).map((file) => {
  const rel = path
    .relative(OUT, file)
    .replace(/\\/g, "/")
    .replace(/\.html$/, "");
  const urlPath = rel === "index" ? "/" : `/${rel}`;
  const doc = parse(fs.readFileSync(file, "utf8"));
  const meta = (sel) => doc.querySelector(sel)?.getAttribute("content") ?? "";
  const images = [
    ...new Set(
      doc
        .querySelectorAll("main img[src]")
        .map((img) => img.getAttribute("src"))
        .filter(
          (src) => /^\/(assets|blog|gallery)\//.test(src) && !/avatar|logo|favicon/.test(src),
        ),
    ),
  ].slice(0, 50);
  return {
    urlPath,
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
    noindex: /noindex/i.test(meta('meta[name="robots"]')),
    modified: meta('meta[property="article:modified_time"]'),
    links: doc.querySelectorAll("a[href]").map((a) => a.getAttribute("href")),
    images,
  };
});

const byPath = new Map(pages.map((p) => [p.urlPath, p]));
const postDate = (href) => byPath.get(href)?.modified || "";

/** Indexable = canonical points at itself, no noindex, not pagination, not an expired offer. */
const indexable = pages.filter(
  (p) =>
    p.canonical === SITE + (p.urlPath === "/" ? "/" : p.urlPath) &&
    !p.noindex &&
    !/^\/blog\/page\//.test(p.urlPath) &&
    !(p.urlPath === "/offer" && !biz.isOfferActive()),
);

function lastmod(p) {
  if (p.modified) return p.modified;
  if (p.urlPath.startsWith("/blog")) {
    // Listing pages change when a post they list changes
    const dates = p.links
      .filter((h) => /^\/blog\/[^/]+$/.test(h))
      .map(postDate)
      .filter(Boolean);
    return dates.sort().at(-1) ?? day(new Date());
  }
  const src = SOURCES.find(([re]) => re.test(p.urlPath));
  return src ? mtime(src[1]) : day(new Date());
}

function urlset(list) {
  const body = list
    .sort((a, b) => a.urlPath.localeCompare(b.urlPath))
    .map((p) => {
      const imgs = p.images
        .map((src) => `\n    <image:image><image:loc>${xml(SITE + src)}</image:loc></image:image>`)
        .join("");
      return `  <url>\n    <loc>${xml(p.canonical)}</loc>\n    <lastmod>${lastmod(p)}</lastmod>${imgs}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
}

const blogPages = indexable.filter((p) => p.urlPath === "/blog" || p.urlPath.startsWith("/blog/"));
const otherPages = indexable.filter((p) => !blogPages.includes(p));
const children = [
  ["sitemap-pages.xml", otherPages],
  ["sitemap-blog.xml", blogPages],
];
for (const [name, list] of children) fs.writeFileSync(path.join(OUT, name), urlset(list));
fs.writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children
  .map(
    ([name, list]) =>
      `  <sitemap>\n    <loc>${SITE}/${name}</loc>\n    <lastmod>${list.map(lastmod).sort().at(-1)}</lastmod>\n  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>
`,
);

// ── robots.txt ─────────────────────────────────────────────────────────────
fs.writeFileSync(
  path.join(OUT, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`,
);

// ── llms.txt: a plain-text summary for AI crawlers ─────────────────────────
const pageTitle = (p) => {
  const html = fs.readFileSync(
    path.join(OUT, p === "/" ? "index.html" : `${p.slice(1)}.html`),
    "utf8",
  );
  return (
    parse(html)
      .querySelector("title")
      ?.text.replace(/\s*\|.*$/, "") ?? p
  );
};
fs.writeFileSync(
  path.join(OUT, "llms.txt"),
  `# ${biz.BUSINESS_NAME}

> ${biz.businessSchema.description}

- Address: ${biz.ADDRESS.full}
- Phone / WhatsApp: ${biz.PHONE_DISPLAY}
- Hours: ${biz.HOURS_TEXT}
- Google rating: ${biz.RATING_LABEL}
- Lead Artist: ${biz.LEAD_ARTIST.fullName}

## Pages
${otherPages.map((p) => `- [${pageTitle(p.urlPath)}](${p.canonical})`).join("\n")}

## Guides
${blogPages
  .filter((p) => /^\/blog\/[^/]+$/.test(p.urlPath))
  .map((p) => `- [${pageTitle(p.urlPath)}](${p.canonical})`)
  .join("\n")}
`,
);

// ── .htaccess: generated 301s between the markers ──────────────────────────
const htPath = path.join(OUT, ".htaccess");
const ht = fs.readFileSync(htPath, "utf8");
const rules = REDIRECTS.map(({ from, to }) => {
  const pattern = from.slice(1).replace(/[.]/g, "\\.");
  return `  RewriteRule ^${pattern}(\\.html|/)?$ ${to} [R=301,L,NE]`;
}).join("\n");
const MARKERS = /# BEGIN generated redirects\r?\n[\s\S]*?# END generated redirects/;
if (!MARKERS.test(ht)) throw new Error("[postbuild] redirect markers missing in public/.htaccess");
const marked = ht.replace(
  MARKERS,
  () => `# BEGIN generated redirects\n${rules}\n  # END generated redirects`,
);
fs.writeFileSync(htPath, marked);

console.log(
  `[postbuild] sitemap: ${otherPages.length} pages + ${blogPages.length} blog URLs; robots.txt, llms.txt, ${REDIRECTS.length} redirects`,
);
