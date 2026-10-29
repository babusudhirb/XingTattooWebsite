import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";

import {
  activeCategories,
  BLOG_SECTIONS,
  categoryLabel,
  featuredPosts,
  pageCount,
  posts,
  sectionPosts,
} from "@/data/blog";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BlogVisitStrip } from "@/components/blog/BlogVisitStrip";
import type { Crumb } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { SignatureServices } from "@/components/blog/SignatureServices";
import { ReadMore } from "@/components/ui/ReadMore";

function Pagination({ page }: { page: number }) {
  if (pageCount < 2) return null;
  const href = (n: number) => (n === 1 ? "/blog" : `/blog/page/${n}`);
  const item =
    "inline-flex h-12 min-w-12 items-center justify-center rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent";
  return (
    <nav aria-label="Blog pages" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <a href={href(page - 1)} className={item} rel="prev">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Newer
        </a>
      )}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span
            key={n}
            aria-current="page"
            className={`${item} border-primary bg-primary text-primary-foreground`}
          >
            {n}
          </span>
        ) : (
          <a key={n} href={href(n)} className={item} aria-label={`Page ${n}`}>
            {n}
          </a>
        ),
      )}
      {page < pageCount && (
        <a href={href(page + 1)} className={item} rel="next">
          Older <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
    </nav>
  );
}

/** Swipeable row of topic links under the H1 (wraps from lg). */
function CategoryChips({ current }: { current?: string | undefined }) {
  const chip =
    "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-xs font-semibold whitespace-nowrap transition-colors";
  const on = "border-primary bg-primary text-primary-foreground";
  const off =
    "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground";
  return (
    <nav aria-label="Blog topics" className="mx-auto max-w-7xl px-5 pb-8">
      <ul className="bleed-to-lg flex gap-2 overflow-x-auto pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
        <li className="shrink-0">
          <Link
            to="/blog"
            aria-current={current ? undefined : "page"}
            className={`${chip} ${current ? off : on}`}
          >
            All articles
          </Link>
        </li>
        {activeCategories.map((c) => (
          <li key={c.slug} className="shrink-0">
            <Link
              to="/blog/category/$category"
              params={{ category: c.slug }}
              aria-current={current === c.slug ? "page" : undefined}
              className={`${chip} ${current === c.slug ? on : off}`}
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** One topic block on /blog: heading, who it's for, up to 6 cards and a "View all" link. */
function TopicSection({ section }: { section: (typeof BLOG_SECTIONS)[number] }) {
  const list = sectionPosts(section.slugs);
  if (!list.length) return null;
  return (
    <section
      aria-labelledby={`${section.id}-title`}
      className="mx-auto max-w-7xl px-5 pt-10 pb-4 sm:pt-14"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h2
            id={`${section.id}-title`}
            className="font-display text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl"
          >
            {section.title}
          </h2>
          <ReadMore className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            <p>{section.intro}</p>
          </ReadMore>
        </div>
        <Link
          to="/blog/category/$category"
          params={{ category: section.category }}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start font-display text-xs font-bold tracking-[0.12em] text-amber-800 uppercase hover:underline sm:self-auto"
        >
          View all
          <span className="sr-only"> {categoryLabel(section.category)} articles</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <li key={p.slug}>
            {/* Compact (no excerpt): the same posts' excerpts already show in the list above */}
            <BlogCard post={p} size="compact" />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Blog listing. `list` is what this URL shows by default (a page of posts or a
 * category); typing in search filters within it (or across every live post on /blog).
 */
export function BlogListing({
  title,
  intro,
  crumbs,
  list,
  page = 1,
  showFeatured = false,
  showSections = false,
  showSignature = false,
  category,
}: {
  title: string;
  intro: string;
  crumbs: Crumb[];
  list: BlogPostMeta[];
  page?: number;
  showFeatured?: boolean;
  showSections?: boolean;
  showSignature?: boolean;
  category?: string;
}) {
  const [query, setQuery] = useState("");

  const filtering = query.trim() !== "";
  const shown = useMemo(() => {
    if (!filtering) return list;
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (!category || p.category === category) &&
        (p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))),
    );
  }, [filtering, list, category, query]);

  const [lead, ...side] = featuredPosts;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pt-6 pb-10 sm:pt-8 sm:pb-14">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-4 max-w-3xl font-display text-h1 font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <ReadMore className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          <p>{intro}</p>
        </ReadMore>
      </section>

      <CategoryChips current={category} />

      {showFeatured && lead && (
        <section aria-labelledby="featured-title" className="mx-auto max-w-7xl px-5 pb-4">
          <h2 id="featured-title" className="eyebrow">
            Featured Guides
          </h2>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <BlogCard post={lead} size="large" />
            <div className="grid gap-8">
              {side.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {showSections && BLOG_SECTIONS.map((s) => <TopicSection key={s.id} section={s} />)}

      {showSignature && <SignatureServices />}

      <section
        aria-labelledby="all-posts-title"
        className="mx-auto max-w-7xl px-5 pt-6 pb-14 sm:pb-20"
      >
        <h2 id="all-posts-title" className="font-display text-2xl font-semibold tracking-tight">
          {category ? `All ${categoryLabel(category)} articles` : "Latest articles"}
        </h2>

        <div className="mt-5 flex">
          <label className="relative block w-full sm:w-80">
            <span className="sr-only">Search articles</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides…"
              className="h-12 w-full rounded-full border border-border bg-card pr-4 pl-11 text-base outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/30 sm:text-sm"
            />
          </label>
        </div>

        <p className="sr-only" aria-live="polite">
          {filtering ? `${shown.length} articles found` : ""}
        </p>

        {shown.length ? (
          <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <li key={p.slug}>
                <BlogCard post={p} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No articles match that yet — try another word, or{" "}
            <button type="button" className="underline" onClick={() => setQuery("")}>
              show all articles
            </button>
            .
          </p>
        )}

        {!filtering && !category && <Pagination page={page} />}
      </section>

      <BlogVisitStrip />
      <SiteFooter />
    </main>
  );
}
