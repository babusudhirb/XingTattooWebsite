import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarCheck, Home, Images } from "lucide-react";

import { BookCTA } from "@/components/cta";
import { openBookingModal } from "@/components/booking/BookingContext";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SocialDock } from "@/components/layout/SocialDock";

const LINK =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary px-6 font-display text-xs font-bold tracking-[0.12em] uppercase transition-colors hover:bg-accent";

/** "Page not found" inside the normal site shell. Used by the router and prerendered as 404.html. */
export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:py-28">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 font-display text-[2rem] leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist or has moved. These will get you back on track:
        </p>
        <nav aria-label="Helpful links" className="mt-8">
          <ul className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <li>
              <Link to="/" className={`${LINK} w-full sm:w-auto`}>
                <Home className="h-4 w-4" aria-hidden="true" /> Home
              </Link>
            </li>
            <li>
              <a href="/#gallery" className={`${LINK} w-full sm:w-auto`}>
                <Images className="h-4 w-4" aria-hidden="true" /> Gallery
              </a>
            </li>
            <li>
              <Link to="/blog" className={`${LINK} w-full sm:w-auto`}>
                <BookOpen className="h-4 w-4" aria-hidden="true" /> Blog
              </Link>
            </li>
            <li>
              <BookCTA location="404" className="w-full sm:w-auto" />
            </li>
          </ul>
        </nav>
      </section>
      <SiteFooter />
    </main>
  );
}
