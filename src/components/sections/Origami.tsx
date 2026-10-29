import { useEffect, useState, type ReactNode } from "react";

/**
 * Origami building blocks — folded-paper shapes in the studio's ink + amber
 * palette. Everything here is decorative CSS/SVG; content stays plain HTML.
 */

/** Faint crease lines, like a sheet of paper that has been folded and opened. */
export function CreaseLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full text-amber-800/10 ${className}`}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M0 0 400 400M400 0 0 400M200 0v400M0 200h400" />
        <path d="M0 100 100 0M300 0 400 100M400 300 300 400M100 400 0 300" strokeDasharray="4 6" />
        <path d="M200 0 400 200 200 400 0 200Z" />
      </g>
    </svg>
  );
}

/**
 * Faceted paper "gem" behind a portrait: five triangles in light/shadow tones
 * meeting at a crease point, like a folded crane's body.
 */
export function OrigamiFrame({ children }: { children: ReactNode }) {
  const facet = "absolute inset-0 transition-transform duration-700";
  return (
    <div className="group relative mx-auto aspect-[1200/1350] w-full max-w-[520px]">
      <div
        className="absolute inset-[4%] drop-shadow-[0_24px_30px_rgba(120,53,15,0.18)]"
        aria-hidden="true"
      >
        <div
          className={`${facet} bg-gradient-to-br from-amber-100 to-amber-300 [clip-path:polygon(50%_0,50%_52%,0_38%)] group-hover:-translate-y-1`}
        />
        <div
          className={`${facet} bg-gradient-to-bl from-amber-300 to-amber-500 [clip-path:polygon(50%_0,100%_38%,50%_52%)] group-hover:-translate-y-1`}
        />
        <div
          className={`${facet} bg-gradient-to-tr from-stone-200 to-stone-100 [clip-path:polygon(0_38%,50%_52%,18%_100%)]`}
        />
        <div
          className={`${facet} bg-gradient-to-tl from-stone-400 to-stone-200 [clip-path:polygon(100%_38%,82%_100%,50%_52%)]`}
        />
        <div
          className={`${facet} bg-gradient-to-t from-amber-200 to-stone-100 [clip-path:polygon(18%_100%,50%_52%,82%_100%)]`}
        />
        {/* Crease lines where the facets meet */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <g stroke="rgba(120,53,15,0.25)" strokeWidth="0.3" fill="none">
            <path d="M50 0 50 52M0 38 50 52 100 38M18 100 50 52 82 100" />
          </g>
        </svg>
      </div>
      <div className="relative h-full">{children}</div>
    </div>
  );
}

/**
 * Card with a folded top-right corner. The fold deepens on hover, like a page
 * corner being lifted. The clip-path keeps the same point count in both states
 * so the browser can animate between them.
 */
export function FoldCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag className={`group/fold relative drop-shadow-[0_6px_14px_rgba(0,0,0,0.07)] ${className}`}>
      <div className="relative h-full bg-card p-6 transition-[clip-path] duration-500 [clip-path:polygon(0_0,calc(100%-26px)_0,100%_26px,100%_100%,0_100%)] group-hover/fold:[clip-path:polygon(0_0,calc(100%-44px)_0,100%_44px,100%_100%,0_100%)]">
        {children}
      </div>
      {/* The folded-over flap */}
      <span
        className="absolute top-0 right-0 h-[26px] w-[26px] bg-gradient-to-bl from-amber-100 via-amber-300 to-amber-500 shadow-[-2px_2px_4px_rgba(0,0,0,0.12)] transition-all duration-500 [clip-path:polygon(0_0,100%_100%,0_100%)] group-hover/fold:h-[44px] group-hover/fold:w-[44px]"
        aria-hidden="true"
      />
    </Tag>
  );
}

/**
 * Accordion-folded paper strip: panels alternate light and shadow, tilted
 * towards/away from the viewer on larger screens, like a zig-zag fold.
 */
export function AccordionFold({
  items,
}: {
  /** `wide` panels get extra room (e.g. the combined tattoos-for-clients stat). */
  items: { value: string; label: string; wide?: boolean }[];
}) {
  return (
    <ol className="flex flex-col [perspective:1200px] sm:flex-row">
      {items.map(({ value, label, wide }, i) => {
        const even = i % 2 === 0;
        return (
          <li
            key={label}
            className={`flex ${wide ? "flex-[1.6]" : "flex-1"} flex-col items-center justify-center px-4 py-7 text-center transition-transform duration-500 hover:[transform:rotateY(0deg)] ${
              even
                ? "bg-gradient-to-r from-stone-50 to-amber-100 sm:[transform:rotateY(14deg)]"
                : "bg-gradient-to-r from-amber-200 to-amber-50 sm:[transform:rotateY(-14deg)]"
            }`}
          >
            <span className="font-display text-3xl font-bold tracking-tight text-amber-800 sm:text-4xl">
              {value}
            </span>
            <span className="mt-1 text-xs font-semibold tracking-[0.14em] text-stone-600 uppercase">
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Sticky in-page navigation with scrollspy: highlights the section currently
 * in view and scrolls the active pill into view on small screens.
 */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    // The observer only reports sections whose visibility *changed*, so keep
    // the full picture and pick the first visible section in page order.
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = sections.find(({ id }) => visible.has(id));
        if (first) setActive(first.id);
      },
      // Band starts just below where sections land (scroll-mt-36 = 144px)
      // so the previous section's last pixels don't count as current.
      { rootMargin: "-150px 0px -55% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    document
      .querySelector(`[data-nav-pill="${active}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[var(--header-h,72px)] z-30 border-b border-border bg-background/90 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none]">
        {sections.map(({ id, label }) => {
          const current = id === active;
          return (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                onClick={() => setActive(id)}
                data-nav-pill={id}
                aria-current={current ? "location" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 py-1.5 font-display text-xs font-semibold tracking-[0.12em] uppercase transition-colors ${
                  current
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-amber-700 hover:text-foreground"
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
