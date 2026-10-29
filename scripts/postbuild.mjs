/**
 * Runs after `vite build` (see package.json). The crawl files themselves (sitemaps, robots.txt,
 * llms.txt, rss.xml…) are written into public/ by scripts/generate-seo-files.mjs before the build
 * and copied over by Vite. This script, reading the prerendered pages in .output/public:
 *   - fails the build on a truncated page, or on a sitemap URL that isn't a built, indexable,
 *     self-canonical page (and on an indexable page missing from the sitemaps)
 *   - rewrites sitemap-images.xml with every <main> image of each sitemap page (the hashed
 *     /assets/ URLs only exist now), into .output/public and public/ (committed)
 *   - writes the 301 rules from scripts/redirects.mjs into .output/public/.htaccess
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "node-html-parser";

import { urlset } from "./generate-seo-files.mjs";
import { REDIRECTS } from "./redirects.mjs";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(APP, ".output/public");
const biz = await import(new URL("../src/data/business.ts", import.meta.url).href);
const SITE = biz.SITE_URL;

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

const pages = new Map(
  htmlFiles(OUT).map((file) => {
    const rel = path
      .relative(OUT, file)
      .replace(/\\/g, "/")
      .replace(/\.html$/, "");
    const urlPath = rel === "index" ? "/" : `/${rel}`;
    const doc = parse(fs.readFileSync(file, "utf8"));
    const images = [
      ...new Set(
        doc
          .querySelectorAll("main img[src]")
          .map((img) => img.getAttribute("src"))
          .filter((src) => /^\/(assets|images|og)\//.test(src) && !/avatar|logo|favicon/.test(src)),
      ),
    ].slice(0, 1000);
    return [
      SITE + urlPath,
      {
        urlPath,
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
        noindex: /noindex/i.test(
          doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
        ),
        images,
      },
    ];
  }),
);

// ── Sitemaps must list exactly the indexable, self-canonical pages ─────────
const sitemapUrls = (name) =>
  [
    ...fs
      .readFileSync(path.join(OUT, name), "utf8")
      .matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g),
  ].map((m) => ({ loc: m[1].replace(/&amp;/g, "&"), lastmod: m[2] }));
const listed = [...sitemapUrls("sitemap-pages.xml"), ...sitemapUrls("sitemap-blog.xml")];
const problems = [];
for (const { loc } of listed) {
  const page = pages.get(loc);
  if (!page) problems.push(`${loc}: no built page`);
  else if (page.noindex) problems.push(`${loc}: noindex`);
  else if (page.canonical !== loc)
    problems.push(`${loc}: canonical is ${page.canonical || "missing"}`);
}
const listedSet = new Set(listed.map((u) => u.loc));
for (const [url, page] of pages) {
  const indexable = page.canonical === url && !page.noindex && page.urlPath !== "/404";
  if (indexable && !listedSet.has(url)) problems.push(`${url}: indexable but not in a sitemap`);
}
if (problems.length) throw new Error(`[postbuild] sitemap mismatch:\n  ${problems.join("\n  ")}`);

// ── sitemap-images.xml from the built pages ────────────────────────────────
const imagesXml = urlset(
  listed
    .map(({ loc, lastmod }) => ({ loc, lastmod, images: pages.get(loc).images }))
    .filter((e) => e.images.length),
  true,
);
fs.writeFileSync(path.join(OUT, "sitemap-images.xml"), imagesXml);
fs.writeFileSync(path.join(APP, "public/sitemap-images.xml"), imagesXml);

// ── .htaccess: generated 301s between the markers ──────────────────────────
const htPath = path.join(OUT, ".htaccess");
const ht = fs.readFileSync(htPath, "utf8");
// Absolute targets, so http://, the bare domain and an old URL all resolve in one 301
const target = (to) => (to.startsWith("/") ? SITE + to : to);
const esc = (p) => p.replace(/[.]/g, "\\.");
const rules = [
  ...REDIRECTS.map((r) =>
    r.prefix
      ? `  RewriteRule ^${esc(r.prefix.slice(1))}(.+?)(\\.html|/)?$ ${target(r.to)}$1 [R=301,L,NE]`
      : `  RewriteRule ^${esc(r.from.slice(1))}(\\.html|/)?$ ${target(r.to)} [R=301,L,NE]`,
  ),
  // The 404 page itself answers with a 404 status (only when asked for directly)
  "  RewriteCond %{ENV:REDIRECT_STATUS} ^$",
  "  RewriteRule ^404(\\.html)?$ - [R=404,L]",
  // Any capitals in a page URL → the lowercase page, in one hop (assets are left alone)
  ...[...pages.values()]
    .filter((p) => p.urlPath !== "/" && p.urlPath !== "/404")
    .flatMap((p) => [
      "  RewriteCond %{REQUEST_URI} [A-Z]",
      `  RewriteRule ^${esc(p.urlPath.slice(1))}(\\.html|/)?$ ${SITE}${p.urlPath} [NC,R=301,L,NE]`,
    ]),
].join("\n");
const MARKERS = /# BEGIN generated redirects\r?\n[\s\S]*?# END generated redirects/;
if (!MARKERS.test(ht)) throw new Error("[postbuild] redirect markers missing in public/.htaccess");
const marked = ht.replace(
  MARKERS,
  () => `# BEGIN generated redirects\n${rules}\n  # END generated redirects`,
);
fs.writeFileSync(htPath, marked);

console.log(
  `[postbuild] ${listed.length} sitemap URLs verified, images sitemap rewritten, ${REDIRECTS.length} redirects`,
);
