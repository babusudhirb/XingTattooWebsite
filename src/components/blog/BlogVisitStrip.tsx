import { BookingCta, CallCta, DirectionsCta, WhatsAppCta } from "@/components/cta";
import { ADDRESS, BUSINESS_NAME, HOURS_SHORT } from "@/data/business";

/** "Visit the studio" strip used at the end of blog listings. */
export function BlogVisitStrip() {
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
          <BookingCta location="blog_end" icon={false} />
          <DirectionsCta location="blog_end" />
          <CallCta location="blog_end" />
          <WhatsAppCta location="blog_end" />
        </div>
      </div>
    </section>
  );
}
