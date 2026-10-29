import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Flame,
  RefreshCcw,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { QuickAnswer } from "@/components/faq/QuickAnswer";
import { serviceQuickAnswer } from "@/data/page-content";
import { BookingCta, WhatsAppCta } from "@/components/cta";
import { services, type ServiceContent } from "@/data/services";
import { gallery, CARD_SIZES, cardSrcSet, heroSrcSet } from "@/data/gallery";
import { preload } from "react-dom";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { postBySlug, SERVICE_GUIDES } from "@/data/blog";
import { LazyGalleryLightbox } from "@/components/gallery/LazyGalleryLightbox";
import { AftercareSteps, BenefitCards } from "@/components/services/ServiceDetailCards";
import { ReadMore } from "@/components/ui/ReadMore";

const HERO_SIZES = "(min-width: 1024px) 600px, 100vw";

function PainMeter({ score }: { score: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-4 rounded-full ${i < score ? "bg-amber-700" : "bg-border"}`}
        />
      ))}
    </span>
  );
}

export function ServicePage({ service }: { service: ServiceContent }) {
  // The hero photo is the LCP: hint it at the top of <head> (see the home page)
  preload(service.heroImage, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: heroSrcSet(service.heroImage),
    imageSizes: HERO_SIZES,
  });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [headlineMain, headlineSub] = (service.heroHeadline ?? service.name).split(" | ");
  const quickAnswer = serviceQuickAnswer(service.slug);

  const relatedGallery =
    service.galleryImages.length > 0
      ? service.galleryImages.map((g) => ({ img: g.src, alt: g.alt, tag: service.shortName }))
      : service.galleryTag
        ? gallery.filter((g) => g.tag === service.galleryTag)
        : [];
  const relatedServices = service.relatedSlugs.map((slug) => services[slug]);
  const guides = (SERVICE_GUIDES[service.slug] ?? [])
    .map(postBySlug)
    .filter((p): p is BlogPostMeta => !!p);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 pt-5">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            to="/"
            className="-my-3.5 inline-block min-w-11 py-3.5 transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to="/services"
            className="-my-3.5 inline-block min-w-11 py-3.5 transition-colors hover:text-foreground"
          >
            Services
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{service.shortName}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-6 pb-10 lg:grid-cols-2 lg:py-8">
          <div>
            <p className="eyebrow">Tattoo Style</p>
            <h1 className="mt-3 font-display text-[clamp(1.5rem,6.6vw,1.75rem)] leading-[1.1] font-medium tracking-tight text-balance sm:text-5xl sm:uppercase lg:text-[3.25rem]">
              {headlineMain}
            </h1>
            {headlineSub && (
              <p className="subtitle mt-2 font-display text-xl text-amber-700 sm:text-2xl lg:text-3xl">
                {headlineSub}
              </p>
            )}
            <p className="mt-3 max-w-md font-script text-2xl text-amber-700">{service.tagline}</p>
            {/* CTAs before the summary, so they sit above the fold on every screen */}
            <div className="mt-6 flex flex-wrap gap-3">
              <BookingCta location="service_hero" style={service.shortName} />
              <WhatsAppCta location="service_hero" />
            </div>
            {service.heroSummary && (
              <ReadMore className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                <p>{service.heroSummary}</p>
              </ReadMore>
            )}
            {service.heroTrustPoints && (
              <ul className="mt-6 grid max-w-lg gap-x-5 gap-y-2 sm:grid-cols-2">
                {service.heroTrustPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" strokeWidth={2} />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative">
            <img
              src={service.heroImage}
              srcSet={heroSrcSet(service.heroImage)}
              sizes={HERO_SIZES}
              alt={service.heroImageAlt}
              width={800}
              height={1000}
              fetchPriority="high"
              className="blend-image relative mx-auto max-h-[520px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 rounded-sm border border-border bg-card px-6 py-6 shadow-[var(--shadow-card)] sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-12">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-amber-700" strokeWidth={1.5} />
            <div>
              <p className="font-display text-xs font-bold leading-snug">
                {service.quickFacts.sessionTime}
              </p>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                Session Time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 shrink-0 text-amber-700" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <PainMeter score={service.quickFacts.painScore} />
              </div>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                {service.quickFacts.painLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 shrink-0 text-amber-700" strokeWidth={1.5} />
            <div>
              <p className="font-display text-xs font-bold leading-snug">
                {service.quickFacts.healingTime}
              </p>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                Healing Time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCcw className="h-5 w-5 shrink-0 text-amber-700" strokeWidth={1.5} />
            <div>
              <p className="font-display text-xs font-bold leading-snug">
                {service.quickFacts.touchUp}
              </p>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                Touch-Up Policy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      {service.benefitCards ? (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading
            eyebrow={`Why ${service.shortName}`}
            title={service.whyChooseTitle ?? `Why Choose ${service.shortName} Tattoos?`}
          />
          {service.whyChooseIntro && (
            <ReadMore className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>{service.whyChooseIntro}</p>
            </ReadMore>
          )}
          <BenefitCards cards={service.benefitCards} styleName={service.shortName} />
        </section>
      ) : service.whyChoosePoints ? (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading
            eyebrow={`Why ${service.shortName}`}
            title={service.whyChooseTitle ?? `Why Choose ${service.shortName} Tattoos?`}
          />
          {service.whyChooseIntro && (
            <ReadMore className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>{service.whyChooseIntro}</p>
            </ReadMore>
          )}
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {service.whyChoosePoints.map((point) => (
              <li
                key={point.title}
                className="rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <h3 className="font-display text-xs font-semibold tracking-[0.12em] text-amber-700 uppercase">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.text}</p>
              </li>
            ))}
          </ul>
          {service.bestFor.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {service.bestFor.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading eyebrow="What It Is" title={`Understanding ${service.shortName}`} />
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {service.introParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-display text-xs font-semibold tracking-[0.14em] uppercase text-amber-700">
                What Makes It {service.shortName}
              </h3>
              <ul className="mt-4 space-y-3">
                {service.characteristics.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" strokeWidth={2} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-display text-xs font-semibold tracking-[0.14em] uppercase text-amber-700">
                Is {service.shortName} Right For You?
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.bestFor.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Explainer */}
      {service.explainer && (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading eyebrow="The Technique" title={service.explainer.title} />
          <div className="mt-8 grid gap-8 lg:grid-cols-5">
            <ReadMore className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:col-span-3">
              <div className="space-y-4">
                {service.explainer.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </ReadMore>
            <div className="rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
              <h3 className="font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase">
                {service.explainer.idealStylesTitle}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.explainer.idealStyles.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-amber-700 hover:text-foreground"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Specialties */}
      {service.specialties && (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading
            eyebrow="Specialties"
            title={service.specialtiesTitle ?? `Our ${service.shortName} Specialties`}
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.specialties.map((item) => (
              <li
                key={item.title}
                className="group media-hover rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <h3 className="font-display text-xs font-semibold tracking-[0.1em] text-amber-700 uppercase transition-colors group-hover:text-amber-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Studio difference */}
      {service.studioDifference && (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading
            eyebrow={service.studioDifferenceEyebrow ?? "Precision & Safety"}
            title={service.studioDifferenceTitle ?? "The Xing Premium Difference"}
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {service.studioDifference.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-xs font-semibold tracking-[0.1em] uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Process */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <SectionHeading eyebrow="Our Process" title="How We Build It" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {service.process.map((step, i) => (
            <div
              key={step.title}
              className="group media-hover rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)]"
            >
              <span
                aria-hidden="true"
                data-n={String(i + 1).padStart(2, "0")}
                className="font-display text-3xl font-bold text-accent transition-colors duration-300 group-hover:text-amber-700 before:content-[attr(data-n)]"
              />
              <h3 className="mt-3 font-display text-xs font-semibold tracking-[0.1em] uppercase">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aftercare */}
      {service.aftercareSteps ? (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading
            eyebrow="Healing Guide"
            title={service.aftercareTitle ?? `${service.shortName} Aftercare Guide`}
          />
          {service.aftercareIntro && (
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
              {service.aftercareIntro}
            </p>
          )}
          <AftercareSteps steps={service.aftercareSteps} />
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
            General guidance only — always follow the printed aftercare sheet given after your
            session, and contact us if anything looks infected rather than simply healing.
          </p>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading
            eyebrow="Healing Guide"
            title={`${service.shortName} Aftercare Timeline`}
          />
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
            Every style heals a little differently. Here's exactly what to expect with your{" "}
            {service.shortName.toLowerCase()} tattoo, stage by stage.
          </p>
          <div className="relative mt-10 space-y-6 border-l border-border pl-6 sm:pl-10">
            {service.aftercare.map((stage) => (
              <div key={stage.period} className="relative">
                <span className="absolute top-1 -left-[1.95rem] h-3 w-3 rounded-full border-2 border-background bg-amber-700 sm:-left-[2.7rem]" />
                <div className="rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                  <p className="eyebrow text-amber-700">{stage.period}</p>
                  <h3 className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.08em]">
                    {stage.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {stage.advice.map((a) => (
                      <li
                        key={a}
                        className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-700" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
            General guidance only — always follow the printed aftercare sheet given after your
            session, and contact us if anything looks infected rather than simply healing.
          </p>
        </section>
      )}

      {/* Mini gallery */}
      {relatedGallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <SectionHeading eyebrow="Recent Work" title={`${service.shortName} Tattoos We've Done`} />
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
            Every piece below was tattooed right here at Xing. Tap any photo to see it up close.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {relatedGallery.map(({ img, alt }, i) => (
              <button
                key={`${alt}-${i}`}
                onClick={() => setLightboxIndex(i)}
                aria-label={`View ${alt}`}
                className="animate-fade-in group media-hover block w-full appearance-none rounded-sm border-0 bg-transparent p-0 text-left focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "backwards" }}
              >
                <img
                  src={img}
                  alt={alt}
                  width={640}
                  height={768}
                  loading="lazy"
                  className="h-56 w-full cursor-zoom-in object-cover"
                />
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href={`/gallery#${service.slug}`}
              className="inline-flex items-center gap-3 rounded-full border border-primary px-7 py-3.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
            >
              View Full Gallery <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      )}

      <LazyGalleryLightbox
        items={relatedGallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      {quickAnswer && <QuickAnswer data={quickAnswer} />}

      <FaqAccordion items={service.faqs} className="mx-auto max-w-7xl px-5 pb-16" />

      <RelatedPosts
        posts={guides}
        eyebrow="Read Before You Book"
        title={`${service.shortName} Tattoo Guides`}
      />

      {/* Cross-sell */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <SectionHeading eyebrow="Explore More" title="Other Styles You Might Like" />
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {relatedServices.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group media-hover rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
            >
              <img
                src={s.cardImage}
                srcSet={cardSrcSet(s.cardImage)}
                sizes={CARD_SIZES}
                alt={s.heroImageAlt}
                width={640}
                height={768}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
              <div className="px-3 py-4 text-center">
                <h3 className="font-display text-xs font-semibold tracking-[0.12em] uppercase transition-colors group-hover:text-amber-700">
                  {s.shortName}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-sm border border-amber-700/30 bg-primary px-8 py-8 text-primary-foreground">
          <div>
            <p className="eyebrow text-amber-500">Free Consultation</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-wide uppercase sm:text-3xl">
              {service.ctaHeadline ?? `Ready For Your ${service.shortName} Tattoo?`}
            </h3>
            <p className="mt-2 text-sm text-primary-foreground/80">
              {service.ctaSubcopy ??
                "Tell us your idea — we'll sketch it, size it and quote it, no pressure."}
            </p>
            <Link
              to="/contact"
              className="mt-2 inline-flex min-h-11 items-center text-sm text-primary-foreground underline underline-offset-4"
            >
              Visit the studio: contact &amp; directions
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <BookingCta
              location="service_end"
              style={service.shortName}
              className="bg-amber-700 text-white"
            />
            <WhatsAppCta
              location="service_end"
              className="border-primary-foreground/30 text-primary-foreground [@media(hover:hover)]:hover:bg-primary-foreground/10"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
