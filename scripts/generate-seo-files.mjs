/**
 * Writes the crawl files into public/, so Vite serves them at the site root in dev and copies
 * them into the build (no router involved — a route can never answer /sitemap.xml with HTML):
 *
 *   robots.txt · sitemap.xml (index) → sitemap-pages.xml, sitemap-blog.xml, sitemap-images.xml
 *   llms.txt · llms-full.txt · site.webmanifest · blog/rss.xml · <INDEXNOW_KEY>.txt (when set)
 *   favicon.ico (+ the PNG icons) from the logo, via scripts/logo-assets.mjs, when missing
 *
 * Inputs: SITE_ROUTES (src/lib/routes.ts), live posts in content/blog, business data
 * (src/data/business.ts) and the FAQs. Run by predev/prebuild, by the blog plugin when a post
 * changes, and by hand: npm run seo:files. scripts/postbuild.mjs then refreshes
 * sitemap-images.xml with the hashed image URLs of the built pages and checks every sitemap URL.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import matter from "gray-matter";

import "./lib/ts-paths.mjs";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(APP, "public");
const CONTENT = path.join(APP, "content/blog");

const biz = await import("../src/data/business.ts");
const { SITE_ROUTES } = await import("../src/lib/routes.ts");
const { faqs, faqCategories } = await import("../src/data/faqs.ts");
const { studioPhotos } = await import("../src/data/studio-photos.ts");
const SITE = biz.SITE_URL;

/** Same labels as src/data/blog.ts (which can't be imported here: it reads virtual:blog). */
export const CATEGORY_LABELS = {
  "tattoo-guides": "Tattoo Guides",
  "aftercare-safety": "Aftercare & Safety",
  "styles-ideas": "Styles & Ideas",
  "meanings-culture": "Meanings & Culture",
  placement: "Placement",
  "cover-ups-touch-ups": "Cover-Ups & Touch-Ups",
  "local-bangalore": "Local: Bangalore",
  "studio-stories": "Studio Stories",
};

/** Today in India time; BLOG_BUILD_DATE=YYYY-MM-DD overrides it (as in scripts/blog-plugin.ts). */
export function today() {
  const o = process.env["BLOG_BUILD_DATE"];
  if (o && /^\d{4}-\d{2}-\d{2}$/.test(o)) return o;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

const xml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const asDate = (v) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === "string" ? v : undefined;
const fillTokens = (text) => text.replace(/\{\{(\w+)\}\}/g, (m, key) => biz.BLOG_TOKENS[key] ?? m);
const loc = (p) => `${SITE}${p === "/" ? "/" : p}`;

// ── <lastmod>: git last-commit date of a page's source files (today if they have local edits) ─────
const git = (args) => {
  try {
    return execFileSync("git", args, {
      cwd: APP,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
};
const dirty = new Set(
  git(["status", "--porcelain", "--untracked-files=all"])
    .split("\n")
    .filter(Boolean)
    .map((l) => l.slice(3).replace(/^"|"$/g, "")),
);
function gitDate(files) {
  if (files.some((f) => [...dirty].some((d) => d === f || d.startsWith(`${f}/`)))) return today();
  return git(["log", "-1", "--format=%cs", "--", ...files]) || today();
}

// ── Live blog posts (same rule as scripts/blog-plugin.ts) ──────────────────────────────────────
export function livePosts(now = today()) {
  if (!fs.existsSync(CONTENT)) return [];
  return fs
    .readdirSync(CONTENT)
    .filter((f) => f.endsWith(".md"))
    .map((name) => {
      const { data } = matter(fillTokens(fs.readFileSync(path.join(CONTENT, name), "utf8")));
      const publishAt = asDate(data.publishAt);
      const live = data.draft ? !!publishAt && publishAt <= now : true;
      const published = asDate(data.datePublished) ?? publishAt ?? now;
      return {
        slug: data.slug,
        title: data.title,
        description: data.description,
        category: data.category,
        heroImage: data.heroImage,
        heroAlt: data.heroAlt,
        relatedService: data.relatedService,
        live,
        published,
        modified: asDate(data.dateModified) ?? published,
      };
    })
    .filter((p) => p.live)
    .sort((a, b) =>
      a.published === b.published
        ? a.slug.localeCompare(b.slug)
        : a.published < b.published
          ? 1
          : -1,
    );
}

/** Indexable static routes for this build (the offer only while it runs). */
export const indexableRoutes = () =>
  SITE_ROUTES.filter((r) => (r.indexable === "offer" ? biz.isOfferActive() : r.indexable));

function urlset(entries, images = false) {
  const ns = images ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : "";
  const body = entries
    .map((e) => {
      const imgs = (e.images ?? [])
        .map(
          (src) =>
            `\n    <image:image>\n      <image:loc>${xml(src.startsWith("http") ? src : SITE + src)}</image:loc>\n    </image:image>`,
        )
        .join("");
      const mod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${xml(e.loc)}</loc>${mod}${imgs}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${ns}>\n${body}\n</urlset>\n`;
}

export function sitemapIndex(children) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children.map(([name, lastmod]) => `  <sitemap>\n    <loc>${SITE}/${name}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`).join("\n")}
</sitemapindex>
`;
}
export { urlset };

function write(rel, content) {
  const file = path.join(PUBLIC, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) return false;
  fs.writeFileSync(file, content);
  return true;
}

export function generateSeoFiles() {
  const now = today();
  const posts = livePosts(now);
  const newest = (list) =>
    list
      .map((p) => p.modified)
      .sort()
      .at(-1) ?? now;

  // Pages
  const routes = indexableRoutes();
  const pageEntries = routes
    .filter((r) => r.group === "pages")
    .map((r) => ({ loc: loc(r.path), lastmod: gitDate(r.sources), path: r.path }));

  // Blog: hub, categories with live posts, posts
  const blogRoute = routes.find((r) => r.path === "/blog");
  const categories = Object.keys(CATEGORY_LABELS).filter((c) =>
    posts.some((p) => p.category === c),
  );
  const blogEntries = [
    ...(blogRoute
      ? [
          {
            loc: loc("/blog"),
            lastmod: [newest(posts), gitDate(["src/routes/blog/index.tsx"])].sort().at(-1),
          },
        ]
      : []),
    ...categories.map((c) => ({
      loc: loc(`/blog/category/${c}`),
      lastmod: newest(posts.filter((p) => p.category === c)),
    })),
    ...posts.map((p) => ({ loc: loc(`/blog/${p.slug}`), lastmod: p.modified })),
  ];

  // Images known before the build (public/ files). postbuild.mjs replaces this file with every
  // <main> image of the built pages, including the hashed /assets/ URLs.
  const imageEntries = [
    {
      loc: loc("/gallery"),
      lastmod: gitDate(["src/data/studio-photos.ts"]),
      images: studioPhotos.slice(0, 1000).map((p) => p.src),
    },
    ...posts
      .filter((p) => p.heroImage)
      .map((p) => ({ loc: loc(`/blog/${p.slug}`), lastmod: p.modified, images: [p.heroImage] })),
  ];

  const files = {
    "sitemap-pages.xml": urlset(pageEntries),
    "sitemap-blog.xml": urlset(blogEntries),
  };
  // A build's postbuild.mjs writes the complete images sitemap (with the hashed /assets/ URLs);
  // this pre-build version only fills in when there is none yet.
  if (!fs.existsSync(path.join(PUBLIC, "sitemap-images.xml")))
    files["sitemap-images.xml"] = urlset(imageEntries, true);
  files["sitemap.xml"] = sitemapIndex([
    [
      "sitemap-pages.xml",
      pageEntries
        .map((e) => e.lastmod)
        .sort()
        .at(-1),
    ],
    [
      "sitemap-blog.xml",
      blogEntries
        .map((e) => e.lastmod)
        .sort()
        .at(-1) ?? now,
    ],
    [
      "sitemap-images.xml",
      imageEntries
        .map((e) => e.lastmod)
        .sort()
        .at(-1),
    ],
  ]);

  files["robots.txt"] =
    `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`;

  // llms.txt — facts and key pages; llms-full.txt adds the FAQs and the blog index. No prices.
  const facts = `# ${biz.BUSINESS_NAME}

> ${biz.businessSchema.description}

- Address: ${biz.ADDRESS.full}
- Phone / WhatsApp: ${biz.PHONE_DISPLAY}
- Email: ${biz.EMAIL}
- Hours: ${biz.HOURS_TEXT}
- Google rating: ${biz.RATING_LABEL}
- Google Maps: ${biz.MAPS_PLACE_URL}
- Directions: ${biz.DIRECTIONS_URL}
- Instagram: ${biz.INSTAGRAM_URL}
- Lead Artist: ${biz.LEAD_ARTIST.fullName}, ${biz.COUNTS.years} years
- Areas served: ${biz.SERVICE_AREAS.join(", ")}
- Amenities: ${biz.ATTRIBUTES_LABEL}

## Services
${biz.SERVICE_PAGES.map((s) => `- [${s.name}](${loc(`/services/${s.slug}`)})`).join("\n")}
- Also: ${biz.GBP_SERVICES.join(", ")}

## Key pages
${routes.map((r) => `- [${r.label}](${loc(r.path)})`).join("\n")}
`;
  files["llms.txt"] = facts;
  files["llms-full.txt"] = `${facts}
## FAQs
${faqCategories
  .map(
    (c) =>
      `### ${c.label}\n\n${faqs
        .filter((f) => f.category === c.id)
        .map((f) => `**${f.question}**\n${f.answer}`)
        .join("\n\n")}`,
  )
  .join("\n\n")}

## Blog
${posts.map((p) => `- [${p.title}](${loc(`/blog/${p.slug}`)}): ${p.description}`).join("\n")}
`;

  files["site.webmanifest"] = `${JSON.stringify(
    {
      name: biz.BUSINESS_NAME,
      short_name: biz.APP_NAME,
      description: `Custom tattoos by ${biz.LEAD_ARTIST.fullName} in Brookefield, Bangalore.`,
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#faf9f7",
      theme_color: "#faf9f7",
      lang: "en-IN",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    null,
    2,
  )}\n`;

  files["blog/rss.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`Tattoo Blog | ${biz.BUSINESS_NAME}`)}</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Tattoo guides, aftercare and ideas from ${xml(biz.LEAD_ARTIST.fullName)} at ${xml(biz.BRAND_NAME)}, Brookefield, Bengaluru.</description>
    <language>en-IN</language>
${posts
  .map(
    (p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.published}T10:00:00+05:30`).toUTCString()}</pubDate>
      <category>${xml(CATEGORY_LABELS[p.category] ?? p.category)}</category>
      <description>${xml(p.description)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  const key = process.env["INDEXNOW_KEY"];
  if (key && /^[a-zA-Z0-9-]{8,128}$/.test(key)) files[`${key}.txt`] = key;

  const changed = Object.entries(files)
    .filter(([rel, content]) => write(rel, content))
    .map(([rel]) => rel);
  return { changed, pages: pageEntries.length, blog: blogEntries.length, posts: posts.length };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  if (!fs.existsSync(path.join(PUBLIC, "favicon.ico"))) await import("./logo-assets.mjs");
  const r = generateSeoFiles();
  console.log(
    `[seo:files] ${r.pages} pages, ${r.blog} blog URLs (${r.posts} live posts)` +
      (r.changed.length ? `; updated ${r.changed.join(", ")}` : "; no changes"),
  );
}
