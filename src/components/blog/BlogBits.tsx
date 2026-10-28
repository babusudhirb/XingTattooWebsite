import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight, MessageCircle, Navigation, Phone } from "lucide-react";

import type { Crumb } from "@/lib/blog";
import { openBookingModal } from "@/components/booking/BookingContext";

import {
  ADDRESS,
  BUSINESS_NAME,
  DIRECTIONS_URL,
  HOURS_SHORT,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
} from "@/data/business";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {items.map((c, i) => (
          <Fragment key={c.label}>
            {i > 0 && (
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
            )}
            <li>
              {c.href ? (
                <a
                  href={c.href}
                  className="inline-flex min-h-11 items-center hover:text-foreground hover:underline"
                >
                  {c.label}
                </a>
              ) : (
                <span aria-current="page" className="text-foreground/80">
                  {c.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

const BTN =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 font-display text-xs font-bold tracking-[0.12em] uppercase transition-colors sm:w-auto";

/** "Visit the studio" strip used at the end of blog listings. */
export function VisitStrip() {
  return (
    <section aria-labelledby="blog-visit-title" className="mx-auto max-w-7xl px-5 pb-14 sm:pb-20">
      <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">Visit The Studio</p>
          <h2
            id="blog-visit-title"
            className="mt-2 font-display text-xl font-semibold tracking-tight text-balance sm:text-2xl"
          >
            {BUSINESS_NAME}
          </h2>
          <address className="mt-3 text-sm leading-relaxed not-italic text-muted-foreground">
            {ADDRESS.full}
          </address>
          <p className="mt-2 text-sm text-muted-foreground">
            {HOURS_SHORT}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className={`${BTN} bg-primary text-primary-foreground hover:opacity-90`}
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" /> Book Free Consultation
          </button>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN} border border-primary hover:bg-accent`}
          >
            <Navigation className="h-4 w-4" aria-hidden="true" /> Directions
          </a>
          <a href={PHONE_TEL} className={`${BTN} border border-primary hover:bg-accent`}>
            <Phone className="h-4 w-4" aria-hidden="true" /> Call {PHONE_DISPLAY}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN} border border-primary hover:bg-accent`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export function BlogBackLink() {
  return (
    <Link
      to="/blog"
      className="inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase hover:underline"
    >
      All articles
    </Link>
  );
}
