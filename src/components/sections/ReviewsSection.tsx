import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import { GOOGLE_RATING, REVIEW_COUNT, reviews, type Review } from "@/data/reviews";
import { GOOGLE_REVIEWS_URL } from "@/data/site";
import { SectionHeading } from "@/components/sections/SectionHeading";

/** Google's four-colour "G", used to attribute the reviews to Google (one cached file). */
function GoogleG({ className }: { className?: string }) {
  return (
    <img
      src="/google-g.svg"
      width={48}
      height={48}
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}

/** Lucide's star outline (24×24). Defined once per section; every rating row <use>s it. */
const STAR_PATH =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";
const STAR_STEP = 27; // 24px star + 3px gap
const STAR_ID = "review-star";

/** Five stars with the last one filled fractionally (e.g. 4.9 → 90%). */
function Stars({ value, clipId }: { value: number; clipId?: string }) {
  const filled = Math.max(0, Math.min(5, value));
  const partial = filled < 5 && clipId;
  const stars = [0, 1, 2, 3, 4].map((i) => <use key={i} href={`#${STAR_ID}`} x={i * STAR_STEP} />);
  return (
    <svg
      viewBox={`0 0 ${4 * STAR_STEP + 24} 24`}
      className="h-4 w-auto"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      {partial && (
        <>
          <clipPath id={clipId}>
            <rect width={Math.floor(filled) * STAR_STEP + (filled % 1) * 24} height={24} />
          </clipPath>
          <g className="fill-none stroke-amber-300/50">{stars}</g>
        </>
      )}
      <g
        className="fill-amber-400 stroke-amber-400"
        clipPath={partial ? `url(#${clipId})` : undefined}
      >
        {stars}
      </g>
    </svg>
  );
}

/** Quotes longer than this get a 4-line clamp and a Read more toggle (full text stays in the HTML). */
const CLAMP_AT = 150;

function ReviewCard({ review }: { review: Review }) {
  const [open, setOpen] = useState(false);
  const long = review.quote.length > CLAMP_AT;
  return (
    <li className="review-card">
      <figure className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-2">
          <Stars value={review.rating} />
          <span className="sr-only">Rated {review.rating} out of 5</span>
          <span className="review-chip">{review.highlight}</span>
        </div>
        <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          <p className={long && !open ? "line-clamp-4" : undefined}>“{review.quote}”</p>
        </blockquote>
        {long && (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="mt-1 inline-flex min-h-11 w-fit items-center text-xs font-semibold text-amber-800 underline underline-offset-4"
          >
            {open ? "Show less" : "Read more"}
          </button>
        )}
        <figcaption className="mt-3 flex items-center gap-3 border-t border-border pt-3">
          <span className="review-avatar" aria-hidden="true">
            {review.name
              .split(/\s+/)
              .slice(0, 2)
              .map((p) => p[0]!.toUpperCase())
              .join("")}
          </span>
          <span>
            <cite className="block font-display text-sm font-semibold not-italic">
              {review.name}
            </cite>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <GoogleG className="h-3 w-3" /> Google review
            </span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

export function ReviewsSection() {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 16), behavior: "smooth" });
  };

  return (
    <section id="reviews" className="cv-auto mx-auto max-w-7xl px-5 pb-12 sm:pb-16">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <path id={STAR_ID} d={STAR_PATH} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <SectionHeading eyebrow="Google Reviews" title="What Our Clients Say" />
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
        Real Google reviews from clients of Xing in Brookefield, Bengaluru — first tattoos, custom
        designs and fine-line work by Peace. Rated {GOOGLE_RATING}★ from {REVIEW_COUNT} reviews.
      </p>

      {/* Rating summary */}
      <a
        href={GOOGLE_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto mt-6 flex w-fit items-center gap-4 rounded-full border border-border bg-card px-5 py-3 shadow-[var(--shadow-card)] transition-colors hover:border-amber-400/60"
      >
        <GoogleG className="h-7 w-7 shrink-0" />
        <span className="font-display text-2xl font-bold tabular-nums">
          {GOOGLE_RATING.toFixed(1)}
        </span>
        <span className="flex flex-col gap-0.5">
          <Stars value={GOOGLE_RATING} clipId="review-summary-fill" />
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {REVIEW_COUNT} Google reviews
          </span>
          <span className="sr-only"> — view our Google profile</span>
        </span>
      </a>

      {/* One card per view on phones (the next one peeks in), snap scrolling; arrows from sm */}
      <div className="relative mt-6">
        <ul ref={track} className="review-row bleed-to-sm" aria-label="Client reviews">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </ul>
        <div className="mt-4 hidden justify-center gap-3 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous reviews"
            className="review-arrow"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next reviews"
            className="review-arrow"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-primary px-6 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-accent sm:w-auto"
        >
          <GoogleG className="h-4 w-4" />
          See all reviews on Google
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
