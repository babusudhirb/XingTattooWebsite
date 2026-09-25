import { useEffect, useRef } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { navLinks, PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { SERVICE_SLUGS, services } from "@/data/services";
import { openBookingModal } from "./BookingContext";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileNav";

/** The Services dropdown sits after this many nav links (Home, About Us, Artist). */
const SERVICES_AFTER = 3;

export function SiteHeader({ onOfferClick }: { onOfferClick?: () => void }) {
  const headerRef = useRef<HTMLElement>(null);

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

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {navLinks.slice(0, SERVICES_AFTER).map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:text-foreground hover:after:w-full"
            >
              {label}
            </a>
          ))}

          {/* Services — hover / focus reveals every style page */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
            >
              Services
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
                          src={s.heroImage}
                          alt=""
                          aria-hidden="true"
                          className="h-11 w-11 shrink-0 rounded-sm object-cover"
                        />
                        <span>
                          <span className="block font-display text-xs font-semibold tracking-[0.06em] uppercase transition-colors group-hover/item:text-amber-700">
                            {s.shortName}
                          </span>
                          <span className="block text-[0.7rem] text-muted-foreground">
                            {s.tagline}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  to="/services"
                  className="mt-2 block rounded-sm border-t border-border px-2 pt-3 text-center font-display text-[0.65rem] font-semibold tracking-[0.14em] text-amber-700 uppercase transition-colors hover:text-amber-800"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>

          {navLinks.slice(SERVICES_AFTER).map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:text-foreground hover:after:w-full"
            >
              {label}
            </a>
          ))}

          {onOfferClick ? (
            <button
              onClick={onOfferClick}
              className="font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              Offer
            </button>
          ) : (
            <a
              href="/#book"
              className="font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              Offer
            </a>
          )}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href={PHONE_TEL} className="hidden items-center gap-2 text-sm font-medium sm:flex">
            <Phone className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          <button
            onClick={() => openBookingModal()}
            className="flex min-h-11 items-center rounded-sm bg-primary px-4 font-display text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90 sm:px-5"
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
