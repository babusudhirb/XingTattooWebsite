import { useEffect, useState } from "react";

import { socials } from "@/data/site";
import { MobileActionBar } from "./MobileNav";

export function SocialDock() {
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <MobileActionBar />
      <div
        className={`fixed z-50 flex max-md:hidden transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          docked
            ? "bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 translate-y-0 flex-row gap-3 rounded-full border border-border bg-card/90 px-4 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur sm:gap-4 sm:px-5 sm:py-3"
            : "top-1/2 right-3 -translate-y-1/2 flex-col gap-3 rounded-full border border-transparent px-2 py-2 sm:right-5 sm:gap-5"
        }`}
      >
        {socials.map(({ icon: Icon, label, href, style }, i) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={label}
            className="group auto-pop relative flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-card)] transition-transform duration-300 hover:scale-125 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none sm:h-11 sm:w-11"
            style={{ ...style, animationDelay: `${i * 0.35}s` }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
            <span
              className={`pointer-events-none absolute hidden font-display text-[0.6rem] tracking-[0.14em] uppercase whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block ${
                docked ? "-top-7" : "right-14"
              }`}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
