import { useEffect, useRef, useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

import { isActiveHref, navLinks, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { useOfferActive } from "@/lib/offer";
import { SERVICE_SLUGS, services } from "@/data/services";
import { openBookingModal } from "@/components/booking/BookingContext";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileNav";

/** The Tattoo Designs dropdown sits after this many nav links (Home); Offers comes last. */
const DESIGNS_AFTER = 1;

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const offerActive = useOfferActive();

  // Publish the real header height (it changes with breakpoint, wrapping and the
  // iPhone notch inset) so sticky elements below it can sit flush: --header-h.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Hide while scrolling down, come back on any scroll up (instant under reduced motion)
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 120 || y < lastY - 4) setHidden(false);
      else if (y > lastY + 4 && !headerRef.current?.contains(document.activeElement)) setHidden(true);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b border-border bg-background pt-[var(--sat)] transition-transform duration-300 ease-out motion-reduce:transition-none supports-[backdrop-filter]:bg-background/85 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-150 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="site-header-inner mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 pr-[var(--gutter-r)] pl-[var(--gutter-l)] sm:gap-4">
        <Logo />
        <nav className="hidden items-center gap-5 text-sm whitespace-nowrap lg:flex xl:gap-7">
          {navLinks.slice(0, DESIGNS_AFTER).map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:text-foreground hover:after:w-full"
            >
              {label}
            </a>
          ))}

          {/* Tattoo Designs — hover / focus reveals every style page */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
            >
              Tattoo Designs
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div className="invisible absolute top-full left-1/2 z-50 w-[560px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-sm border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className="grid grid-cols-2 gap-1">
                  {SERVICE_SLUGS.map((slug) => {
                    const s = services[slug];
                    return (
                      <Link
                        key={slug}
                        to="/services/$slug"
                        params={{ slug }}
                        className="group/item flex items-center gap-3 rounded-sm p-2 transition-colors hover:bg-accent"
                      >
                        <img
                          src={s.thumbImage}
                          width={44}
                          height={44}
                          loading="lazy"
                          alt=""
                          aria-hidden="true"
                          className="h-11 w-11 shrink-0 rounded-sm object-cover"
                        />
                        <span>
                          <span className="block font-display text-xs font-semibold tracking-[0.06em] uppercase transition-colors group-hover/item:text-amber-700">
                            {s.shortName}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {s.tagline}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  to="/services"
                  className="mt-2 block rounded-sm border-t border-border px-2 pt-3 text-center font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase transition-colors hover:text-amber-800"
                >
                  View All Tattoo Designs
                </Link>
              </div>
            </div>
          </div>

          {navLinks.slice(DESIGNS_AFTER).map(({ label, href }) => (
            <a
              key={href}
              href={href}
              aria-current={isActiveHref(pathname, href) ? "page" : undefined}
              className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:text-foreground hover:after:w-full aria-[current=page]:text-foreground aria-[current=page]:after:w-full"
            >
              {label}
            </a>
          ))}

          {offerActive && (
            <Link
              to="/offer"
              className="font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              Offers
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={PHONE_TEL}
            className="hidden items-center gap-2 text-sm font-medium whitespace-nowrap sm:flex lg:hidden xl:flex"
          >
            <Phone className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          {/* Below 400px the sticky bottom bar carries the booking button */}
          <button
            onClick={() => openBookingModal()}
            className="hidden min-h-12 items-center rounded-full bg-primary px-4 font-display whitespace-nowrap text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90 min-[400px]:flex sm:px-5"
          >
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book Consultation</span>
          </button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
