import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, MessageCircle, Quote } from "lucide-react";

import artistPortrait from "@/assets/artist/peace-tattoo-artist-xing-brookefield.webp";
import {
  ARTIST,
  artistBookingSteps,
  artistFaqs,
  artistMilestones,
  artistSignatureWork,
  artistStyles,
} from "@/data/artist";
import { BUSINESS_ID, COUNTS, pageTitle, SITE_URL } from "@/data/business";
import { reviews } from "@/data/reviews";
import { services } from "@/data/services";
import { WHATSAPP_URL } from "@/data/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { GalleryLightbox } from "@/components/sections/GalleryLightbox";
import { openBookingModal } from "@/components/booking/BookingContext";
import {
  AccordionFold,
  CreaseLines,
  FoldCard,
  OrigamiFrame,
  SectionNav,
} from "@/components/sections/Origami";

const TITLE = pageTitle("Meet Peace, Tattoo Artist");
const DESCRIPTION =
  `Meet Peace (Chingri Awungshi), Lead Artist at Xing Premium Tattoo Studio, Brookefield, Bengaluru: ${COUNTS.years} years of realism, portraits and fine line work.`;

export const Route = createFileRoute("/tattoo-artist")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: artistPortrait },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/tattoo-artist` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: TITLE,
          description: DESCRIPTION,
          mainEntity: {
            "@type": "Person",
            name: ARTIST.name,
            alternateName: ARTIST.fullName,
            jobTitle: ARTIST.role,
            image: artistPortrait,
            worksFor: { "@id": BUSINESS_ID },
            knowsAbout: artistStyles.map((s) => `${s.title} tattoos`),
            knowsLanguage: ["en", "hi", "kn"],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: artistFaqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: TattooArtistPage,
});

const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "styles", label: "Styles" },
  { id: "milestones", label: "Milestones" },
  { id: "work", label: "Work" },
  { id: "booking", label: "How To Book" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

/** Google reviews that mention Peace by name. */
const artistReviews = reviews.filter((r) => /\bpeace\b/i.test(r.quote));

function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <div className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={id}
        className="mt-2 font-display text-[1.35rem] leading-tight font-semibold tracking-wide text-balance uppercase sm:text-3xl"
      >
        {title}
      </h2>
      {/* Small folded-paper divider */}
      <span
        className="mx-auto mt-3 block h-3 w-6 bg-gradient-to-r from-amber-300 to-amber-600 [clip-path:polygon(0_0,50%_100%,100%_0)]"
        aria-hidden="true"
      />
    </div>
  );
}

function TattooArtistPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />
      <SectionNav sections={SECTIONS} />

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
          <span className="text-foreground">Tattoo Artist</span>
        </nav>
      </div>

      {/* Profile hero */}
      <section
        id="profile"
        aria-labelledby="artist-name"
        className="relative scroll-mt-36 overflow-hidden"
      >
        <CreaseLines />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_1.05fr] lg:py-14">
          <OrigamiFrame>
            <img
              src={artistPortrait}
              alt="Peace (Chingri Awungshi), best tattoo artist in Brookefield, Bengaluru, at Xing Premium Tattoo Studio"
              width={1200}
              height={1350}
              fetchPriority="high"
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </OrigamiFrame>

          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-amber-700" /> Tattoo Artist · Brookefield, Bengaluru
            </p>
            <h1
              id="artist-name"
              className="mt-5 font-display text-[2.75rem] leading-[1] font-medium tracking-tight sm:text-6xl"
            >
              Peace{" "}
              <span className="mt-2 block text-xl font-normal tracking-normal text-muted-foreground sm:text-2xl">
                {ARTIST.fullName} — {ARTIST.role} at Xing Premium Tattoo Studio
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              With {ARTIST.yearsExperience} years behind the machine and {ARTIST.tattoosCompleted}{" "}
              tattoos completed, Peace is the one hand behind every piece at Xing Premium Tattoo
              Studio in AECS Layout, Brookefield. Clients come from Whitefield, Marathahalli and
              across Bengaluru for custom realism, portraits, fine-line work and Indian traditional
              designs — each one drawn from scratch and inked in a studio run to clinic-level
              hygiene.
            </p>

            {/* Folded "tag" facts */}
            <ul className="mt-7 flex flex-wrap gap-3">
              {[
                `${ARTIST.googleRating}★ Google rating`,
                `${ARTIST.yearsExperience} years experience`,
                "Custom designs only",
                "English · हिन्दी · ಕನ್ನಡ",
              ].map((tag) => (
                <li
                  key={tag}
                  className="bg-gradient-to-r from-amber-50 to-amber-100 py-2 pr-5 pl-4 text-xs font-semibold text-amber-900 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_50%,calc(100%-10px)_100%,0_100%)]"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-display text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
              >
                Book With Peace <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-primary px-7 py-4 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            <div className="mt-8">
              <p className="font-signature -rotate-3 text-6xl leading-none" aria-hidden="true">
                Peace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <section
        id="styles"
        aria-labelledby="styles-title"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <SectionTitle
          eyebrow="What Peace Tattoos"
          title="Tattoo Styles & Specialities"
          id="styles-title"
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artistStyles.map(({ slug, title, text }) => (
            <FoldCard key={slug} as="li" className="h-full">
              <Link to="/services/$slug" params={{ slug }} className="group flex h-full gap-4">
                <img
                  src={services[slug].heroImage}
                  alt={services[slug].heroImageAlt}
                  width={160}
                  height={200}
                  loading="lazy"
                  className="h-24 w-20 shrink-0 object-cover [clip-path:polygon(0_0,100%_0,100%_85%,85%_100%,0_100%)]"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-semibold tracking-[0.08em] uppercase transition-colors group-hover:text-amber-700">
                    {title}
                  </h3>
                  <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                    {text}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase">
                    Explore style <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </FoldCard>
          ))}
        </ul>
      </section>

      {/* Milestones */}
      <section
        id="milestones"
        aria-labelledby="milestones-title"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <SectionTitle eyebrow="By The Numbers" title="Milestones" id="milestones-title" />
        <div className="mt-10">
          <AccordionFold items={artistMilestones} />
        </div>
      </section>

      {/* Signature work */}
      <section
        id="work"
        aria-labelledby="work-title"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <SectionTitle eyebrow="Portfolio" title="Signature Work By Peace" id="work-title" />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
          A cross-section of real pieces tattooed at Xing. Tap any photo to see it up close.
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {artistSignatureWork.map(({ img, alt }, i) => (
            <li key={img}>
              <button
                onClick={() => setLightboxIndex(i)}
                aria-label={`View ${alt}`}
                className={`group relative block w-full overflow-hidden focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none ${
                  // Alternate the folded corner so the grid reads like scattered paper
                  i % 2 === 0
                    ? "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]"
                    : "[clip-path:polygon(22px_0,100%_0,100%_100%,0_100%,0_22px)]"
                }`}
              >
                <img
                  src={img}
                  alt={alt}
                  width={400}
                  height={500}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Diagonal crease highlight that sweeps across on hover */}
                <span
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,rgba(255,255,255,0.35)_50%,transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <a
            href="/#gallery"
            className="inline-flex items-center gap-3 rounded-full border border-primary px-7 py-3.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
          >
            View Full Gallery <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <GalleryLightbox
        items={artistSignatureWork}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      {/* How to book */}
      <section
        id="booking"
        aria-labelledby="booking-title-artist"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <SectionTitle
          eyebrow="Working With Peace"
          title="How To Book Your Tattoo"
          id="booking-title-artist"
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {artistBookingSteps.map(({ title, text }, i) => (
            <FoldCard key={title} as="li" className="h-full">
              <span className="font-display text-3xl font-bold text-amber-700/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-xs font-semibold tracking-[0.12em] uppercase">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </FoldCard>
          ))}
        </ol>
      </section>

      {/* Reviews mentioning Peace */}
      {artistReviews.length > 0 && (
        <section
          id="reviews"
          aria-labelledby="artist-reviews-title"
          className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
        >
          <SectionTitle
            eyebrow="From Google Reviews"
            title="What Clients Say About Peace"
            id="artist-reviews-title"
          />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {artistReviews.map((r) => (
              <FoldCard key={r.name} as="li" className="h-full">
                <figure className="flex h-full flex-col">
                  <Quote className="h-6 w-6 rotate-180 text-amber-600/40" aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    <p>“{r.quote}”</p>
                  </blockquote>
                  <figcaption className="mt-4 font-display text-sm font-semibold">
                    — {r.name}
                  </figcaption>
                </figure>
              </FoldCard>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <a
              href="/#reviews"
              className="inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase underline-offset-4 hover:underline"
            >
              See all reviews
            </a>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section
        id="faq"
        aria-labelledby="artist-faq-title"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <SectionTitle eyebrow="Good To Know" title="Questions About Peace" id="artist-faq-title" />
        <div className="mx-auto mt-8 max-w-2xl">
          <Accordion type="single" collapsible>
            {artistFaqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-display text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA — folded banner */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="relative overflow-hidden bg-primary px-8 py-10 text-primary-foreground [clip-path:polygon(0_0,calc(100%-40px)_0,100%_40px,100%_100%,0_100%)]">
          <CreaseLines className="text-amber-200/10" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-amber-500">One Artist · Full Attention</p>
              <p className="mt-2 font-display text-[1.35rem] leading-tight font-semibold tracking-wide text-balance uppercase sm:text-3xl">
                Ready To Work With Peace?
              </p>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Free consultation at Xing Premium Tattoo Studio, AECS Layout, Brookefield.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-3 rounded-full bg-amber-600 px-6 py-3.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-0.5"
              >
                Book Consultation <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 rounded-full border border-primary-foreground/30 px-6 py-3.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-primary-foreground/10"
              >
                About The Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
