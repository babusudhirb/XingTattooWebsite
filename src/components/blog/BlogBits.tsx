import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import type { Crumb } from "@/lib/blog";
import { BookCTA, CallCTA, DirectionsCTA, WhatsAppCTA } from "@/components/cta";

import { ADDRESS, BUSINESS_NAME, HOURS_SHORT } from "@/data/business";

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
                  className="inline-flex min-h-11 min-w-11 items-center hover:text-foreground hover:underline"
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
          <p className="mt-2 text-sm text-muted-foreground">{HOURS_SHORT}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
          <BookCTA location="blog_end" icon={false} />
          <DirectionsCTA location="blog_end" />
          <CallCTA location="blog_end" />
          <WhatsAppCTA location="blog_end" />
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
