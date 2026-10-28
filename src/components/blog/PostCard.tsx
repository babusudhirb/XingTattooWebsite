import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import { categoryLabel, formatPostDate } from "@/data/blog";
import { cardImage } from "@/lib/blog";

export function PostCard({
  post,
  size = "default",
  headingLevel = "h3",
}: {
  post: BlogPostMeta;
  size?: "default" | "large" | "compact";
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const large = size === "large";
  return (
    <article className="group relative flex h-full flex-col">
      <span className="block overflow-hidden rounded-xl bg-muted">
        <img
          src={cardImage(post.heroImage)}
          srcSet={`${cardImage(post.heroImage)} 800w, ${post.heroImage} 1600w`}
          sizes={
            large
              ? "(min-width: 1024px) 760px, 100vw"
              : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          }
          alt={post.heroAlt}
          width={800}
          height={500}
          loading={large ? "eager" : "lazy"}
          fetchPriority={large ? "high" : "auto"}
          decoding="async"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </span>
      <div className={`flex flex-1 flex-col ${size === "compact" ? "pt-3" : "pt-4"}`}>
        <p className="font-display text-xs font-semibold tracking-[0.16em] text-amber-800 uppercase">
          {categoryLabel(post.category)}
        </p>
        <Heading
          className={`mt-2 line-clamp-3 font-display leading-snug font-semibold tracking-tight text-balance ${
            large ? "text-2xl sm:text-3xl" : size === "compact" ? "text-base" : "text-lg"
          }`}
        >
          {/* Stretched link: the whole card is one tap target */}
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-amber-800 [&:focus-visible]:after:rounded-xl [&:focus-visible]:after:ring-2 [&:focus-visible]:after:ring-amber-700"
          >
            {post.title}
          </Link>
        </Heading>
        {size !== "compact" && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.description}
          </p>
        )}
        <p className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {post.readingTime} min read
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
        </p>
      </div>
    </article>
  );
}
