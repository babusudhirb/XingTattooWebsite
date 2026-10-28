import { ArrowRight, BookOpen } from "lucide-react";

import { postByNumber, SIGNATURE_SERVICES } from "@/data/blog";

const guideFor = (numbers: number[]) =>
  numbers.map(postByNumber).find((p): p is BlogPostMeta => !!p);

/**
 * Local-SEO service blocks. `full` on /blog (8 cards); `compact` on posts
 * (4 cards, the post's own service first).
 */
export function SignatureServices({
  variant = "full",
  leadHref,
}: {
  variant?: "full" | "compact";
  leadHref?: string;
}) {
  const compact = variant === "compact";
  const items = compact
    ? [...SIGNATURE_SERVICES]
        .sort((a, b) => Number(b.serviceHref === leadHref) - Number(a.serviceHref === leadHref))
        .slice(0, 4)
    : SIGNATURE_SERVICES;
  const HeadingTag = compact ? "h3" : "h2";

  return (
    <section
      aria-labelledby={`signature-${variant}`}
      className={
        compact ? "mt-14 border-t border-border pt-10" : "mx-auto max-w-7xl px-5 py-12 sm:py-16"
      }
    >
      <HeadingTag
        id={`signature-${variant}`}
        className={`font-display font-semibold tracking-tight text-balance ${
          compact ? "text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
        Signature Tattoo Services in Brookefield, Bangalore
      </HeadingTag>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Custom work by Peace at our AECS Layout studio — serving Brookefield, Marathahalli,
        Whitefield and East Bengaluru.
      </p>

      {/* Phones: swipeable row with the next card peeking; grid from sm */}
      <ul
        className={`bleed-to-sm mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 ${
          compact ? "" : "xl:grid-cols-4"
        }`}
      >
        {items.map((s) => {
          const guide = guideFor(s.guides);
          const ItemHeading = compact ? "h4" : "h3";
          return (
            <li
              key={s.title}
              className="group relative flex w-[80%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 sm:w-auto sm:hover:-translate-y-1 sm:hover:shadow-[var(--shadow-soft)]"
            >
              <span className="relative block overflow-hidden">
                <img
                  src={s.image}
                  alt={s.imageAlt}
                  width={640}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"
                  aria-hidden="true"
                />
              </span>
              <div className="flex flex-1 flex-col p-4">
                <ItemHeading className="font-display text-base leading-snug font-semibold text-balance">
                  <a
                    href={s.serviceHref}
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none [&:focus-visible]:after:ring-2 [&:focus-visible]:after:ring-amber-700"
                  >
                    {s.title}
                  </a>
                </ItemHeading>
                {!compact && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-x-4 pt-3">
                  <span className="inline-flex min-h-11 items-center gap-1.5 font-display text-xs font-bold tracking-[0.12em] uppercase group-hover:text-amber-800">
                    Explore service <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {guide && (
                    <a
                      href={`/blog/${guide.slug}`}
                      className="relative z-10 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-amber-800 underline decoration-amber-800/30 underline-offset-4 hover:decoration-amber-800"
                      aria-label={`Read the guide: ${guide.title}`}
                    >
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Read the guide
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
