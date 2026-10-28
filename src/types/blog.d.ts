/** Types for the build-time blog pipeline (scripts/blog-plugin.ts). */
interface BlogPostMeta {
  number: number;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  tags: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroImage: string;
  heroAlt: string;
  heroWidth: number;
  heroHeight: number;
  ogImage: string;
  author: string;
  datePublished: string;
  dateModified: string;
  readingTime: number;
  featured: boolean;
  relatedService: string;
  credits?: string;
}

interface BlogPost extends BlogPostMeta {
  /** Direct answer to the title's question, shown under the H1 (newer posts). */
  answer?: string;
  takeaways: string[];
  faqs: { q: string; a: string }[];
  introHtml: string;
  sections: { id: string; title: string; html: string }[];
}

/** What the post route's loader returns: the post minus its article HTML (kept out of
 *  the hydration payload — see src/lib/blog.ts). */
interface BlogPostData extends Omit<BlogPost, "introHtml" | "sections"> {
  sections: { id: string; title: string }[];
}

declare module "virtual:blog" {
  /** Live posts only, newest first. */
  export const posts: BlogPostMeta[];
  export const POSTS_PER_PAGE: number;
  export const postLoaders: Record<string, () => Promise<{ default: BlogPost }>>;
}
