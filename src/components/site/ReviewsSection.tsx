import { ArrowUpRight, Quote, Star } from "lucide-react";

import { GOOGLE_RATING, reviews, type Review } from "@/data/reviews";
import { GOOGLE_REVIEWS_URL } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

/** Google's four-colour "G", used to attribute the reviews to Google. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

/** Five stars with the last one filled fractionally (e.g. 4.9 → 90%). */
function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className={`relative ${size}`}>
            <Star className={`absolute inset-0 ${size} text-amber-300/50`} strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={`${size} fill-amber-400 text-amber-400`} strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Ink, bronze and gold gradients from the studio palette. */
const AVATAR_TONES = [
  "from-black via-stone-900 to-stone-700 text-amber-200", // ink
  "from-amber-950 via-amber-800 to-amber-600 text-amber-50", // bronze
  "from-amber-700 via-amber-500 to-yellow-300 text-stone-950", // gold
  "from-red-950 via-rose-900 to-rose-700 text-rose-50", // oxblood
  "from-stone-950 via-orange-900 to-orange-700 text-orange-100", // ember
  "from-yellow-900 via-amber-700 to-yellow-500 text-yellow-50", // brass
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/** `index` is the review's position in the list, so every reviewer gets a different tone. */
function Avatar({ name, index }: { name: string; index: number }) {
  return (
    // Gradient ring → card-coloured gap → monogram disc
    <span
      className="relative flex h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-amber-300 via-amber-600 to-stone-900 p-[2px] shadow-[var(--shadow-card)]"
      aria-hidden="true"
    >
      <span className="flex h-full w-full rounded-full bg-card p-[2px]">
        <span
          className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-display text-sm font-bold tracking-wider ${AVATAR_TONES[index % AVATAR_TONES.length]}`}
        >
          {/* Fine engraved hatching + soft top-left highlight */}
          <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.07)_0_1px,transparent_1px_4px)]" />
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.18),transparent_55%)]" />
          <span className="relative drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
            {initials(name)}
          </span>
        </span>
      </span>
    </span>
  );
}

/** Speech-bubble card: a leaf-shaped bubble (big top-left / bottom-right corners)
 *  whose tail points down at the reviewer's avatar. */
function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <figure className="group flex w-[300px] shrink-0 flex-col sm:w-[360px]">
      <div className="relative flex flex-1 flex-col rounded-[28px_6px_28px_6px] border border-border bg-card p-6 pt-7 shadow-[var(--shadow-card)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-amber-400/70 group-hover:shadow-[var(--shadow-soft)]">
        {/* Warm glow tucked into the big corner */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_0%_0%,rgba(245,158,11,0.14),transparent_45%)]"
          aria-hidden="true"
        />
        <Quote
          className="absolute top-4 right-5 h-12 w-12 rotate-180 fill-amber-600/10 text-amber-600/25 transition-colors duration-500 group-hover:fill-amber-600/20"
          strokeWidth={1}
          aria-hidden="true"
        />

        <div className="relative flex flex-wrap items-center gap-2">
          <Stars value={review.rating} />
          <span className="sr-only">Rated {review.rating} out of 5</span>
        </div>
        <span className="relative mt-3 w-fit rounded-full border border-amber-700/20 bg-amber-50 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-amber-800 uppercase">
          {review.highlight}
        </span>

        <blockquote className="relative mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          <p>“{review.quote}”</p>
        </blockquote>

        {/* Tail — a rotated square sharing the bubble's border */}
        <span
          className="absolute -bottom-[9px] left-9 h-4 w-4 rotate-45 border-r border-b border-border bg-card transition-colors duration-500 group-hover:border-amber-400/70"
          aria-hidden="true"
        />
      </div>

      <figcaption className="mt-5 flex items-center gap-3 pl-4 transition-transform duration-500 group-hover:-translate-y-1">
        <Avatar name={review.name} index={index} />
        <span>
          <cite className="block font-display text-sm font-semibold not-italic">{review.name}</cite>
          <span className="mt-0.5 flex items-center gap-1 text-[0.7rem] text-muted-foreground">
            <GoogleG className="h-3 w-3" /> Google review
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-5 pb-12 sm:pb-16">
      <SectionHeading eyebrow="Google Reviews" title="What Our Clients Say" />
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
        Real reviews from clients of XING Tattoo Studio in Brookefield, Bengaluru — first tattoos,
        custom designs and fine-line work by Artist Peace.
      </p>

      {/* Rating summary */}
      <a
        href={GOOGLE_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Rated ${GOOGLE_RATING} out of 5 on Google — view our Google profile`}
        className="group mx-auto mt-6 flex w-fit items-center gap-4 rounded-full border border-border bg-card px-5 py-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/60 hover:shadow-[var(--shadow-soft)]"
      >
        <GoogleG className="h-7 w-7 shrink-0" />
        <span className="font-display text-2xl font-bold tabular-nums">
          {GOOGLE_RATING.toFixed(1)}
        </span>
        <span className="flex flex-col gap-0.5">
          <Stars value={GOOGLE_RATING} />
          <span className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
            Google Rating
          </span>
        </span>
      </a>

      {/* Auto-scrolling on most devices; a plain swipeable row when the visitor
          prefers reduced motion (the duplicated loop copy is hidden then). */}
      <div className="relative mt-6 overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
        {/* Duration scales with the number of cards so the reading speed stays constant */}
        <div
          className="marquee-track gap-5"
          style={{ animationDuration: `${reviews.length * 5.7}s` }}
        >
          {reviews.map((review, i) => (
            <ReviewCard key={review.name} review={review} index={i} />
          ))}
          {/* Second copy completes the seamless loop — hidden from screen readers. */}
          <div className="flex gap-5 pr-5 motion-reduce:hidden" aria-hidden="true" inert>
            {reviews.map((review, i) => (
              <ReviewCard key={`${review.name}-loop`} review={review} index={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-sm border border-primary px-6 py-3.5 sm:w-auto font-display text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
        >
          <GoogleG className="h-4 w-4" />
          <span className="sm:hidden">More Reviews On Google</span>
          <span className="hidden sm:inline">Read more reviews on our Google profile</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
