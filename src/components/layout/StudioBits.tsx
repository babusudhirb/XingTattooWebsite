import { useEffect, useRef, useState } from "react";
import { Accessibility, CreditCard, Hand, MapPin, Rainbow, Toilet, Wifi } from "lucide-react";

import { ADDRESS, BUSINESS_NAME, MAP_EMBED_URL, MAPS_PLACE_URL } from "@/data/business";

/** GBP attributes as chips: accessibility, amenities, crowd and payments. */
const CHIPS = [
  { icon: Accessibility, label: "Wheelchair accessible" },
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Toilet, label: "Gender-neutral restroom" },
  { icon: Rainbow, label: "LGBTQ+ friendly" },
  { icon: CreditCard, label: "Cards & Google Pay" },
];

export function AttributeChips({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Studio amenities">
      {CHIPS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
        >
          <Icon className="h-3.5 w-3.5 shrink-0 text-foreground" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Google Maps embed: loads only when near the viewport (space reserved, no layout
 * shift), stays greyscale until used, and on touch screens sits behind a
 * "Tap to use map" overlay so a finger scrolling the page never gets trapped.
 */
export function LazyMap({ className = "h-[280px] md:h-[360px] lg:h-[420px]" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseLeave={() => setActive(false)}
      className={`relative overflow-hidden rounded-xl border border-border bg-muted transition-[filter] duration-300 ${
        active ? "" : "grayscale contrast-[1.05] hover:grayscale-0"
      } ${className}`}
    >
      {show ? (
        <>
          <iframe
            src={MAP_EMBED_URL}
            title={`Map: ${BUSINESS_NAME}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            tabIndex={active ? 0 : -1}
            className={`absolute inset-0 h-full w-full border-0 ${active ? "" : "pointer-events-none"}`}
          />
          {!active && (
            <button
              type="button"
              onClick={() => setActive(true)}
              className="absolute inset-0 flex items-end justify-center bg-transparent p-4 focus-visible:outline-none"
              aria-label="Use the interactive map"
            >
              <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-background/95 px-5 text-sm font-semibold text-foreground shadow-[var(--shadow-card)] ring-1 ring-border">
                <Hand className="h-4 w-4" aria-hidden="true" /> Tap to use map
              </span>
            </button>
          )}
        </>
      ) : (
        <a
          href={MAPS_PLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground"
        >
          <MapPin className="h-8 w-8 text-foreground" strokeWidth={1.4} aria-hidden="true" />
          <span className="max-w-xs">{ADDRESS.full}</span>
        </a>
      )}
    </div>
  );
}
