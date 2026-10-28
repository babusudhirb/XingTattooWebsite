import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PostCard } from "@/components/blog/PostCard";
import { SectionHeading } from "@/components/sections/SectionHeading";

/** Three blog cards under a section heading, plus a link to the blog. Renders nothing if empty. */
export function RelatedGuides({
  posts,
  eyebrow,
  title,
}: {
  posts: BlogPostMeta[];
  eyebrow: string;
  title: string;
}) {
  if (!posts.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((p) => (
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
