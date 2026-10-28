import { categoryLabel } from "@/data/blog";
import { SITE_URL } from "@/data/business";

/** Blog helpers shared by components and routes (kept out of component files for fast refresh). */

/** Card thumbnail (800×500) generated next to every hero. */
export const cardImage = (hero: string) => hero.replace(/-hero\.webp$/, "-card.webp");

export interface Crumb {
  label: string;
  href?: string;
}

export const breadcrumbSchema = (items: Crumb[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: `${SITE_URL}${c.href === "/" ? "/" : c.href}` } : {}),
  })),
});

export const blogItemList = (list: BlogPostMeta[]) => ({
  "@type": "ItemList",
  itemListElement: list.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/blog/${p.slug}`,
    name: p.title,
  })),
});

export const postCrumbs = (post: BlogPostMeta): Crumb[] => [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: categoryLabel(post.category), href: `/blog/category/${post.category}` },
];

/**
 * Article HTML is kept out of the route's loader data, so it isn't sent twice
 * (once as markup, once as hydration JSON). The loader stores it here; on the
 * first page load the browser hasn't run the loader, so the HTML is read back
 * from the prerendered markup instead — identical, so hydration matches.
 */
const bodyCache = new Map<string, { intro?: string; sections: Record<string, string> }>();

export function splitPostBody(post: BlogPost): BlogPostData {
  const { introHtml, sections, ...rest } = post;
  bodyCache.set(post.slug, {
    intro: introHtml,
    sections: Object.fromEntries(sections.map((s) => [s.id, s.html])),
  });
  return { ...rest, sections: sections.map(({ id, title }) => ({ id, title })) };
}

export const bodyElementId = (slug: string, part: string) => `post-${slug}-${part}`;

export function postBodyHtml(slug: string, part: "intro" | string) {
  // Look up this part, not just the post: on a first page load the cache fills one part
  // at a time, and returning "" for a part not read yet would blank it on the next render.
  const cached = bodyCache.get(slug);
  const hit = part === "intro" ? cached?.intro : cached?.sections[part];
  if (hit !== undefined) return hit;
  if (typeof document === "undefined") return "";
  const html = document.getElementById(bodyElementId(slug, part))?.innerHTML ?? "";
  // Remember it, so navigating back to this post later still has its body.
  const entry = bodyCache.get(slug) ?? { sections: {} };
  if (part === "intro") entry.intro = html;
  else entry.sections[part] = html;
  bodyCache.set(slug, entry);
  return html;
}
