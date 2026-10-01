import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Home "About" proof block: headline numbers (each linking to the thing that
 * proves it) and the four reasons clients choose the studio. Deliberately
 * box-free — hairline rules and type do the structure.
 */

const RATING = { value: 4.9, decimals: 1, suffix: "★", label: "Google rating", href: "#reviews" };
const EXPERIENCE = {
  value: 15,
  decimals: 0,
  suffix: "+ yrs",
  label: "Artist experience",
  href: "/tattoo-artist",
};
/** Tattoos and clients read as one proof point: "1800+ tattoos for 1200+ happy clients". */
const TATTOOS = 1800;
const CLIENTS = "1200+";

const REASONS = [
  { title: "Precision", text: "Stencils mapped to your body's shape, so lines sit right." },
  { title: "Hygiene", text: "Single-use needles, opened in front of you. Every time." },
  { title: "Custom Art", text: "Every design drawn from scratch — never copy-paste." },
  { title: "Honest Advice", text: "Straight talk on size, placement and how it will age." },
];

/**
 * Counts up once when scrolled into view. The final number is what the
 * server renders (and what search engines read); the count-up is a
 * client-side flourish, skipped for reduced-motion visitors.
 */
function CountUp({ value, decimals }: { value: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only animate if it starts off-screen — never visibly reset a number.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setShown(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          setShown(value * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown.toFixed(decimals)}
    </span>
  );
}

function Stat({
  value,
  decimals,
  suffix,
  label,
  href,
  className,
}: {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  href: string;
  className: string;
}) {
  return (
    <li className={className}>
      <a
        href={href}
        className="group flex h-full flex-col items-center justify-center px-3 py-6 text-center transition-colors hover:bg-card sm:py-8"
      >
        <span className="block font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <CountUp value={value} decimals={decimals} />
          <span className="ml-0.5 text-lg font-medium text-amber-700 sm:text-xl">{suffix}</span>
        </span>
        <span className="mt-2 flex items-center gap-1 text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase transition-colors group-hover:text-foreground sm:text-[0.7rem]">
          {label}
          <ArrowUpRight
            className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
      </a>
    </li>
  );
}

export function StudioHighlights() {
  return (
    <div className="mt-10 sm:mt-12">
      {/* Numbers — each one links to its proof. Phones: the combined tattoos /
          clients line gets its own row, rating + experience share the next. */}
      <ul className="grid grid-cols-2 border-y border-border lg:grid-cols-4">
        <Stat {...RATING} className="border-t border-border lg:order-1 lg:border-t-0" />
        <li className="col-span-2 order-first lg:order-2 lg:border-x lg:border-border">
          <a
            href="#gallery"
            className="group relative flex h-full flex-col items-center justify-center px-4 py-6 text-center transition-colors hover:bg-card sm:py-8"
          >
            <span
              className="absolute top-0 left-1/2 h-px w-12 -translate-x-1/2 bg-amber-700 transition-all duration-500 group-hover:w-2/3"
              aria-hidden="true"
            />
            <span className="block font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              <CountUp value={TATTOOS} decimals={0} />
              <span className="text-lg font-medium text-amber-700 sm:text-xl">+</span>
              <span className="ml-2 text-xl font-medium sm:text-2xl">tattoos</span>
            </span>
            <span className="mt-2 flex items-center gap-1 text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase transition-colors group-hover:text-foreground sm:text-[0.7rem]">
              for <strong className="font-semibold text-amber-700">{CLIENTS}</strong> happy clients
              <ArrowUpRight
                className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
            </span>
          </a>
        </li>
        <Stat
          {...EXPERIENCE}
          className="border-t border-l border-border lg:order-3 lg:border-t-0 lg:border-l-0"
        />
      </ul>

      {/* Why clients choose us */}
      <ol className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:mt-10 lg:grid-cols-4 lg:gap-x-8">
        {REASONS.map(({ title, text }, i) => (
          <li key={title} className="group relative pt-4">
            {/* Hairline that fills amber on hover */}
            <span className="absolute top-0 left-0 h-px w-full bg-border" aria-hidden="true" />
            <span
              className="absolute top-0 left-0 h-px w-8 bg-amber-700 transition-all duration-500 group-hover:w-full"
              aria-hidden="true"
            />
            <span className="font-display text-[0.7rem] font-semibold tracking-[0.14em] text-amber-700">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-display text-sm font-semibold tracking-[0.06em] uppercase">
              {title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
