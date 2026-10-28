/**
 * Blog content pipeline (build time only — nothing here ships to the browser).
 *
 * - Reads content/blog/*.md (YAML frontmatter + Markdown body).
 * - A post is live when it isn't a draft, or when its `publishAt` date has
 *   arrived (scheduled posts go live on the first build on/after that date).
 * - `virtual:blog` exports live posts' metadata + lazy loaders (drafts and
 *   future posts are never bundled).
 * - Each `.md` import becomes { ...meta, introHtml, sections, headings }.
 * - Every internal link is checked at build time; links to posts that are not
 *   live yet are unwrapped to plain text so the site never links to a 404.
 * - Writes public/sitemap.xml and public/blog/rss.xml with live posts only.
 * - {{token}}s (phone, address, hours, stats…) are filled from src/data/business.ts,
 *   so posts never carry their own copy of the studio's details.
 */
import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { imageSize } from "image-size";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit, SKIP } from "unist-util-visit";
import { toString as hastToString } from "hast-util-to-string";
import type { Plugin, ViteDevServer } from "vite";
import type { Element, ElementContent, Root, RootContent } from "hast";

import { BLOG_TOKENS, BUSINESS_NAME, pageTitle, SITE_URL } from "../src/data/business";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/blog");
const PUBLIC_DIR = path.join(ROOT, "public");
const VIRTUAL_ID = "virtual:blog";
const RESOLVED_VIRTUAL_ID = "\0" + VIRTUAL_ID;

export const BLOG_CATEGORIES = [
  "tattoo-guides",
  "aftercare-safety",
  "styles-ideas",
  "meanings-culture",
  "placement",
  "cover-ups-touch-ups",
  "local-bangalore",
  "studio-stories",
] as const;

const POSTS_PER_PAGE = 12;

interface Frontmatter {
  number: number;
  title: string;
  seoTitle: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroImage: string;
  heroAlt: string;
  author: string;
  datePublished?: string | undefined;
  dateModified?: string | undefined;
  draft?: boolean;
  publishAt?: string | undefined;
  featured?: boolean;
  relatedService: string;
  /** Optional 40–60 word direct answer to the title's question, shown under the H1. */
  answer?: string;
  takeaways: string[];
  faqs: { q: string; a: string }[];
  credits?: string;
}

interface SourcePost {
  file: string;
  fm: Frontmatter;
  body: string;
  live: boolean;
  date: string;
}

/** Build date in India time — the studio's calendar decides what is "today".
 *  BLOG_BUILD_DATE=YYYY-MM-DD overrides it, to preview the schedule locally. */
function buildDate() {
  const override = process.env["BLOG_BUILD_DATE"];
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) return override;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

/** Replace {{token}}s with values from src/data/business.ts; unknown tokens fail the build. */
function fillTokens(text: string, file: string) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = BLOG_TOKENS[key];
    if (value === undefined) throw new Error(`[blog] ${file}: unknown token {{${key}}}`);
    return value;
  });
}

const asDate = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === "string" ? v : undefined;

function readPosts(): SourcePost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const today = buildDate();
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((name) => {
      const file = path.join(CONTENT_DIR, name);
      const { data, content } = matter(fillTokens(fs.readFileSync(file, "utf8"), name));
      const fm = data as Frontmatter;
      fm.datePublished = asDate(data["datePublished"]);
      fm.dateModified = asDate(data["dateModified"]);
      fm.publishAt = asDate(data["publishAt"]);
      if (fm.slug !== name.replace(/\.md$/, "")) {
        throw new Error(`[blog] ${name}: slug "${fm.slug}" must match the file name`);
      }
      if (!BLOG_CATEGORIES.includes(fm.category as (typeof BLOG_CATEGORIES)[number])) {
        throw new Error(`[blog] ${name}: unknown category "${fm.category}"`);
      }
      const date = fm.draft ? (fm.publishAt ?? "9999-12-31") : (fm.datePublished ?? today);
      const live = fm.draft ? !!fm.publishAt && fm.publishAt <= today : true;
      return { file, fm, body: content, live, date };
    })
    .sort((a, b) => (a.date === b.date ? a.fm.number - b.fm.number : a.date < b.date ? 1 : -1));
}

function heroSize(src: string) {
  const file = path.join(PUBLIC_DIR, src);
  if (!fs.existsSync(file)) throw new Error(`[blog] missing image ${src}`);
  const { width, height } = imageSize(fs.readFileSync(file));
  return { width: width ?? 1600, height: height ?? 900 };
}

function wordCount(md: string) {
  return md
    .replace(/[#>*_`|[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function publicMeta(p: SourcePost) {
  const { fm } = p;
  const hero = heroSize(fm.heroImage);
  return {
    number: fm.number,
    slug: fm.slug,
    title: fm.title,
    seoTitle: pageTitle(fm.seoTitle),
    description: fm.description,
    category: fm.category,
    tags: fm.tags,
    primaryKeyword: fm.primaryKeyword,
    secondaryKeywords: fm.secondaryKeywords,
    heroImage: fm.heroImage,
    heroAlt: fm.heroAlt,
    heroWidth: hero.width,
    heroHeight: hero.height,
    ogImage: `/blog/og/${fm.slug}.jpg`,
    author: fm.author,
    datePublished: p.date,
    dateModified: fm.dateModified && fm.dateModified > p.date ? fm.dateModified : p.date,
    readingTime: Math.max(1, Math.round(wordCount(p.body) / 200)),
    featured: !!fm.featured,
    relatedService: fm.relatedService,
    ...(fm.credits ? { credits: fm.credits } : {}),
  };
}

/** Every planned post slug (the image map in scripts/blog_images.py lists all of them),
 *  so links to posts not written yet are unwrapped instead of failing the build. */
function plannedSlugs() {
  const src = fs.readFileSync(path.join(ROOT, "scripts/blog_images.py"), "utf8");
  return [...src.matchAll(/^\s+"([a-z0-9-]+)": \(/gm)].map((m) => m[1]!);
}

/** Paths that exist on the site, for the internal link check. */
function knownPaths(posts: SourcePost[]) {
  const servicesSrc = fs.readFileSync(path.join(ROOT, "src/data/services.ts"), "utf8");
  const slugs = [
    ...(servicesSrc.match(/SERVICE_SLUGS = \[([^\]]+)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g),
  ].map((m) => m[1]!);
  return new Set([
    "/",
    "/about",
    "/faq",
    "/offer",
    "/tattoo-artist",
    "/services",
    "/privacy-policy",
    "/terms-and-conditions",
    "/blog",
    ...slugs.map((s) => `/services/${s}`),
    ...BLOG_CATEGORIES.map((c) => `/blog/category/${c}`),
    ...posts.map((p) => `/blog/${p.fm.slug}`),
    ...plannedSlugs().map((slug) => `/blog/${slug}`),
  ]);
}

const el = (
  tagName: string,
  properties: Element["properties"],
  children: ElementContent[],
): Element => ({
  type: "element",
  tagName,
  properties,
  children,
});

/** hast transforms: heading anchors, responsive tables, figures, tip callouts, link rules. */
function rehypeBlog(ctx: { file: string; live: Set<string>; known: Set<string> }) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "h2" && node.properties["id"]) {
        node.children.push(
          el(
            "a",
            {
              href: `#${String(node.properties["id"])}`,
              className: ["heading-anchor"],
              ariaLabel: `Link to section: ${hastToString(node)}`,
            },
            [{ type: "text", value: "#" }],
          ),
        );
      }

      if (node.tagName === "table" && parent && index !== undefined) {
        parent.children[index] = el(
          "div",
          {
            className: ["table-wrap"],
            tabIndex: 0,
            role: "region",
            ariaLabel: "Table (scrolls sideways)",
          },
          [node],
        );
        return SKIP;
      }

      // A paragraph holding only an image becomes <figure> with the title as caption.
      if (node.tagName === "p" && parent && index !== undefined) {
        const kids = node.children.filter((c) => !(c.type === "text" && !c.value.trim()));
        const img = kids[0];
        if (kids.length === 1 && img?.type === "element" && img.tagName === "img") {
          const src = String(img.properties["src"]);
          const { width, height } = heroSize(src);
          const caption = img.properties["title"];
          delete img.properties["title"];
          Object.assign(img.properties, {
            width,
            height,
            loading: "lazy",
            decoding: "async",
            sizes: "(min-width: 1024px) 680px, 100vw",
          });
          parent.children[index] = el(
            "figure",
            {},
            caption
              ? [img, el("figcaption", {}, [{ type: "text", value: String(caption) }])]
              : [img],
          );
          return SKIP;
        }
      }

      // Markdown checklists ("- [ ] item"): the disabled checkboxes are decoration only, and
      // unlabelled form controls fail accessibility checks — draw the box with a span instead.
      if (node.tagName === "input" && node.properties["type"] === "checkbox" && parent && index !== undefined) {
        parent.children[index] = el("span", { className: ["task-box"], ariaHidden: "true" }, []);
        return SKIP;
      }

      if (node.tagName === "blockquote") {
        const text = hastToString(node).trim();
        if (/^Peace['’]s tip/i.test(text)) node.properties["className"] = ["callout-tip"];
      }

      if (node.tagName === "a" && parent && index !== undefined) {
        const href = String(node.properties["href"] ?? "");
        if (/^https?:\/\//.test(href)) {
          node.properties["target"] = "_blank";
          node.properties["rel"] = ["noopener", "noreferrer"];
          return undefined;
        }
        if (href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:"))
          return undefined;
        const pathOnly = href.split("#")[0]!.split("?")[0]!;
        if (!ctx.known.has(pathOnly)) {
          throw new Error(`[blog] ${path.basename(ctx.file)}: broken internal link ${href}`);
        }
        const postSlug = pathOnly.startsWith("/blog/") ? pathOnly.slice(6) : null;
        if (postSlug && !postSlug.includes("/") && !ctx.live.has(postSlug)) {
          // Target is scheduled for later: keep the words, drop the link for now.
          parent.children.splice(index, 1, ...node.children);
          return [SKIP, index];
        }
      }
      return undefined;
    });
  };
}

function renderPost(p: SourcePost, live: Set<string>, known: Set<string>) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeBlog, { file: p.file, live, known });
  const tree = processor.runSync(processor.parse(p.body)) as Root;
  const stringify = (children: RootContent[]) =>
    unified()
      .use(rehypeStringify)
      .stringify({ type: "root", children } as Root);

  const intro: RootContent[] = [];
  const sections: { id: string; title: string; nodes: RootContent[] }[] = [];
  for (const node of tree.children) {
    if (node.type === "element" && node.tagName === "h2") {
      sections.push({
        id: String(node.properties["id"]),
        title: hastToString(node).replace(/#$/, "").trim(),
        nodes: [node],
      });
    } else if (sections.length) sections.at(-1)!.nodes.push(node);
    else intro.push(node);
  }
  return {
    ...publicMeta(p),
    ...(p.fm.answer ? { answer: p.fm.answer } : {}),
    takeaways: p.fm.takeaways ?? [],
    faqs: p.fm.faqs ?? [],
    introHtml: stringify(intro),
    sections: sections.map((s) => ({ id: s.id, title: s.title, html: stringify(s.nodes) })),
  };
}

function xmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeIfChanged(file: string, content: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) return;
  fs.writeFileSync(file, content);
}

function writeFeeds(posts: SourcePost[]) {
  const live = posts.filter((p) => p.live);
  const today = buildDate();
  const metas = live.map(publicMeta);
  const pages = Math.max(1, Math.ceil(live.length / POSTS_PER_PAGE));
  const cats = BLOG_CATEGORIES.filter((c) => live.some((p) => p.fm.category === c));
  const known = [...knownPaths(posts)].filter((u) => !u.startsWith("/blog"));

  const urls: { loc: string; lastmod: string }[] = [
    ...known.map((u) => ({ loc: u, lastmod: today })),
    { loc: "/blog", lastmod: metas[0]?.dateModified ?? today },
    ...Array.from({ length: pages - 1 }, (_, i) => ({
      loc: `/blog/page/${i + 2}`,
      lastmod: today,
    })),
    ...cats.map((c) => ({ loc: `/blog/category/${c}`, lastmod: today })),
    ...metas.map((m) => ({ loc: `/blog/${m.slug}`, lastmod: m.dateModified })),
  ];
  writeIfChanged(
    path.join(PUBLIC_DIR, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        (u) =>
          `  <url><loc>${SITE_URL}${u.loc === "/" ? "/" : u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`,
      )
      .join("\n")}\n</urlset>\n`,
  );

  const items = metas
    .map(
      (m) => `    <item>
      <title>${xmlEscape(m.title)}</title>
      <link>${SITE_URL}/blog/${m.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${m.slug}</guid>
      <pubDate>${new Date(`${m.datePublished}T10:00:00+05:30`).toUTCString()}</pubDate>
      <category>${xmlEscape(m.category)}</category>
      <description>${xmlEscape(m.description)}</description>
    </item>`,
    )
    .join("\n");
  writeIfChanged(
    path.join(PUBLIC_DIR, "blog/rss.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(`Tattoo Blog | ${BUSINESS_NAME}`)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Tattoo guides, aftercare and ideas from Peace (Chingri Awungshi) at Xing Premium Tattoo Studio, Brookefield, Bengaluru.</description>
    <language>en-IN</language>
${items}
  </channel>
</rss>
`,
  );
}

export function blogPlugin(): Plugin {
  let cache: SourcePost[] | null = null;
  const posts = () => (cache ??= readPosts());

  return {
    name: "xing-blog",
    enforce: "pre",
    buildStart() {
      cache = null;
      writeFeeds(posts());
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
      return undefined;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_ID) {
        const live = posts().filter((p) => p.live);
        const loaders = live
          .map(
            (p) =>
              `  ${JSON.stringify(p.fm.slug)}: () => import(${JSON.stringify(p.file.replace(/\\/g, "/"))}),`,
          )
          .join("\n");
        return `export const posts = ${JSON.stringify(live.map(publicMeta))};
export const POSTS_PER_PAGE = ${POSTS_PER_PAGE};
export const postLoaders = {\n${loaders}\n};\n`;
      }
      const file = id.split("?")[0]!;
      if (file.endsWith(".md") && path.resolve(file).startsWith(CONTENT_DIR)) {
        const all = posts();
        const post = all.find((p) => path.resolve(p.file) === path.resolve(file));
        if (!post) return undefined;
        const live = new Set(all.filter((p) => p.live).map((p) => p.fm.slug));
        return `export default ${JSON.stringify(renderPost(post, live, knownPaths(all)))};`;
      }
      return undefined;
    },
    configureServer(server: ViteDevServer) {
      server.watcher.add(CONTENT_DIR);
      const reload = (file: string) => {
        if (!file.replace(/\\/g, "/").includes("/content/blog/")) return;
        cache = null;
        try {
          writeFeeds(posts());
        } catch (err) {
          // Dev only: report (e.g. a post saved before its images exist) and keep serving.
          server.config.logger.error(String(err));
          return;
        }
        for (const env of Object.values(server.environments)) {
          const graph = env.moduleGraph;
          const virtual = graph.getModuleById(RESOLVED_VIRTUAL_ID);
          if (virtual) graph.invalidateModule(virtual);
          for (const mod of graph.getModulesByFile(path.resolve(file)) ?? [])
            graph.invalidateModule(mod);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("change", reload);
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
    },
  };
}
