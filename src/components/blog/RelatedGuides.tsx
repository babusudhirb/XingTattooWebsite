import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PostCard } from "@/components/blog/PostCard";
import { SectionHeading } from "@/components/sections/SectionHeading";

/** Blog cards under a section heading, plus a link to the blog. Renders nothing if empty. */
export function RelatedGuides({
  posts,
  eyebrow,
  title,
  intro,
  limit = 3,
}: {
  posts: BlogPostMeta[];
  eyebrow: string;
  title: string;
  intro?: string;
  limit?: number;
}) {
  if (!posts.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16">
      <SectionHeading eyebrow={eyebrow} title={title} />
      {intro && (
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          {intro}
        </p>
      )}
      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, limit).map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center">
        <Link
          to="/blog"
          className="inline-flex min-h-12 items-center gap-1.5 font-display text-xs font-bold tracking-[0.12em] text-amber-800 uppercase hover:underline"
        >
          More tattoo guides from Brookefield <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}
