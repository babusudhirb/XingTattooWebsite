import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

import { HOURS_OPEN_DAYS, MAPS_PLACE_URL, OPEN_LABEL, SHORT_ADDRESS } from "@/data/business";
import { isActiveHref, navLinks, SERVICES_HREF } from "@/data/site";
import { useOfferActive } from "@/lib/offer";
import { SERVICE_SLUGS, services } from "@/data/services";
import { BookCTA, CallCTA } from "@/components/cta";
import { useTodayHours } from "@/lib/hours";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileNav";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const offerActive = useOfferActive();
  const hours = useTodayHours();

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
      else if (y > lastY + 4 && !headerRef.current?.contains(document.activeElement))
        setHidden(true);
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
      {/* Desktop NAP bar: call · today's hours · address (phones get it in the drawer + sticky bar) */}
      <div className="hidden border-b border-border/60 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 pr-[var(--gutter-r)] pl-[var(--gutter-l)] text-xs text-muted-foreground">
          <a
            href={MAPS_PLACE_URL}
            target="_blank"
            rel="noopener"
            className="mr-auto py-1.5 hover:text-foreground"
          >
            {SHORT_ADDRESS}
          </a>
          <CallCTA
            location="header"
            variant="plain"
            className="min-h-8 px-0 text-xs font-semibold tracking-normal text-foreground normal-case md:min-h-8 [@media(hover:hover)]:hover:underline"
          />
          <span aria-hidden="true">·</span>
          <span className="min-w-36">
            {hours?.today ?? `Open ${HOURS_OPEN_DAYS} ${OPEN_LABEL}`}
          </span>
        </div>
      </div>
      <div className="site-header-inner mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 pr-[var(--gutter-r)] pl-[var(--gutter-l)] sm:gap-4">
        <Logo />
        <nav
          aria-label="Main"
          className="hidden items-center gap-4 text-sm whitespace-nowrap lg:flex xl:gap-6"
        >
          {navLinks.map(({ label, href }) =>
            href === SERVICES_HREF ? (
              // Services: a real link to /services; hover / focus also reveals every style page
              <div key={href} className="group relative">
                <Link
                  to="/services"
                  aria-current={isActiveHref(pathname, href) ? "page" : undefined}
                  className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground aria-[current=page]:text-foreground"
                >
                  {label}
                  <ChevronDown
                    className="h-3.5 w-3.5 transition-transform duration-300 group-focus-within:rotate-180 group-hover:rotate-180"
                    aria-hidden="true"
                  />
                </Link>
                <div className="invisible absolute top-full left-1/2 z-50 w-[560px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
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
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={href}
                to={href}
                aria-current={isActiveHref(pathname, href) ? "page" : undefined}
                className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:text-foreground hover:after:w-full aria-[current=page]:text-foreground aria-[current=page]:after:w-full"
              >
                {label}
              </Link>
            ),
          )}

          {offerActive && (
            <Link
              to="/offer"
              data-track="click_offer"
              data-location="header"
              className="font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              Offers
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Below 400px the sticky bottom bar carries the booking button */}
          <BookCTA
            location="header"
            shortBelow="sm"
            icon={false}
            className="hidden px-4 min-[400px]:inline-flex sm:px-5"
          />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
