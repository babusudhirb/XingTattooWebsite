import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CrownIcon, PenTool, ShieldCheck, X } from "lucide-react";

import { QuickAnswer } from "@/components/faq/QuickAnswer";
import { homeQuickAnswer } from "@/data/page-copy";
import { BookCTA, WhatsAppCTA } from "@/components/cta";
import heroArt from "@/assets/hero-fineline-art.webp";
import heroArtSmall from "@/assets/hero-fineline-art-sm.webp";
import artistPortrait from "@/assets/artist/peace-tattoo-artist-xing-brookefield.webp";

import { ADDRESS, COUNTS, GOOGLE_RATING, isOfferActive, OFFER, pageTitle } from "@/data/business";
import { OFFER_IDEAS, OFFER_IMAGE_SIZE, OFFER_LABEL, offerImages } from "@/data/offer";
import { SERVICE_SLUGS, services } from "@/data/services";
import { GALLERY_SIZES, gallerySrcSet, studioGallery, styleGallery } from "@/data/gallery";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { BookingCTA } from "@/components/booking/BookingCTA";
import { StudioHighlights } from "@/components/sections/StudioHighlights";
import { faqById, faqs, homeFaqIds } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { openBookingModal } from "@/components/booking/BookingContext";
import { TattooFlash, type FlashName } from "@/components/sections/TattooFlash";
import { RelatedGuides } from "@/components/blog/RelatedGuides";
import { HOME_GUIDES, posts, sectionPosts } from "@/data/blog";
import { blogItemList } from "@/lib/blog";
import { faqNode, seoHead, SPEAKABLE } from "@/lib/seo";

/** Gallery preview: each style's lead photo, then three studio photos — each opens its
 *  section of /gallery. */
const galleryPreview = [
  ...SERVICE_SLUGS.map((slug) => ({ ...styleGallery(slug)[0]!, href: `/gallery#${slug}` })),
  ...studioGallery.slice(0, 3).map((g) => ({ ...g, href: "/gallery#portfolio" })),
];

const homeFaqs = homeFaqIds.map((id) => faqById.get(id)!);
/** The three newest posts first (so every new post gets a home-page link), then the picks. */
const homeGuides = [...new Set([...posts.slice(0, 3), ...sectionPosts(HOME_GUIDES)])].slice(0, 6);

const HOME_TITLE = pageTitle("Tattoo Studio in Brookefield, Bangalore");
const HOME_DESCRIPTION = `Custom tattoos by Peace, ${ADDRESS.landmark}. Rated ${GOOGLE_RATING}★ on Google. Book a free consultation.`;

export const Route = createFileRoute("/")({
  head: () =>
    seoHead({
      path: "/",
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      // The hero drawing is the largest thing on screen: fetch the right one first
      links: [
        {
          rel: "preload",
          as: "image",
          href: heroArtSmall,
          media: "(max-width: 1023px)",
          fetchPriority: "high",
        },
        {
          rel: "preload",
          as: "image",
          href: heroArt,
          media: "(min-width: 1024px)",
          fetchPriority: "high",
        },
      ],
      page: { speakable: SPEAKABLE },
      graph: [
        faqNode(homeFaqs),
        { ...blogItemList(homeGuides), name: "Tattoo guides from Xing Premium Tattoo Studio" },
      ],
    }),
  component: Index,
});

const features = [
  { icon: PenTool, title: "Custom Designs", text: "Personalized just for you" },
  { icon: ShieldCheck, title: "Safe & Hygienic", text: "100% sterile & safe" },
  { icon: CrownIcon, title: "Premium Quality", text: "Premium inks & equipment" },
];

/** Background flash art for the offer popup: position, tilt and drift offset. */
const OFFER_FLASH: {
  name: FlashName;
  className: string;
  rotate: number;
  delay: number;
}[] = [
  { name: "compass", className: "-top-6 -left-6 h-32 w-32", rotate: -12, delay: 0 },
  {
    name: "heart",
    className: "top-16 right-10 hidden h-20 w-20 sm:block",
    rotate: 8,
    delay: 1.5,
  },
  { name: "dagger", className: "top-1/3 -right-4 h-28 w-28", rotate: 24, delay: 3 },
  { name: "rose", className: "bottom-10 -left-4 h-28 w-28", rotate: -8, delay: 2 },
  { name: "moon", className: "-bottom-4 right-8 h-24 w-24", rotate: 10, delay: 4 },
  { name: "sparkle", className: "top-1/2 left-6 hidden h-8 w-8 sm:block", rotate: 0, delay: 1 },
];

function OfferModal({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing((c) => {
      if (!c) window.setTimeout(onClose, 240);
      return true;
    });
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const list: HTMLElement[] = Array.from(nodes).filter((n) => n.offsetParent !== null);
      if (list.length === 0) return;
      const first = list[0]!;
      const last = list[list.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [requestClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-6"
    >
      <div
        className={`absolute inset-0 bg-foreground/45 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? "opacity-0" : "animate-fade-in opacity-100"
        }`}
        onClick={requestClose}
      />
      <div
        ref={panelRef}
        className={`relative z-10 max-h-[94vh] w-full max-w-3xl overflow-x-hidden overflow-y-auto rounded-sm border border-border bg-background text-foreground shadow-[0_24px_70px_-20px_rgba(0,0,0,0.45)] transition-all duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          closing ? "scale-95 opacity-0" : "animate-scale-in scale-100 opacity-100"
        }`}
      >
        {/* Decoration: warm glow + drifting flash-sheet line art, all behind content */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.06),transparent_50%)]" />
          <div className="absolute inset-3 rounded-sm border border-amber-700/15" />
          {OFFER_FLASH.map(({ name, className, rotate, delay }) => (
            <TattooFlash
              key={name}
              name={name}
              className={`flash-drift absolute text-amber-700/15 ${className}`}
              style={{ "--r": `${rotate}deg`, animationDelay: `${delay}s` } as React.CSSProperties}
            />
          ))}
        </div>

        <button
          ref={closeRef}
          onClick={requestClose}
          aria-label="Close offer"
          className="absolute top-3 right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-card)] transition-transform duration-300 hover:scale-110 hover:bg-accent focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none sm:top-4 sm:right-4"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-4 pt-16 sm:p-8">
          <header className="text-center">
            <p className="font-display text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">
              {OFFER_LABEL} · {OFFER.validLabel}
            </p>
            <h2
              id="offer-title"
              className="mt-2 font-display text-2xl font-medium tracking-tight text-foreground uppercase sm:text-3xl"
            >
              More Art. <span className="font-extrabold">More You.</span>
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-amber-700/70">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-700/60" />
              <TattooFlash name="sparkle" className="h-3 w-3" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-700/60" />
            </div>
          </header>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {offerImages.map((offer) => (
              <div
                key={offer.alt}
                className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-700/50 hover:shadow-[var(--shadow-soft)]"
              >
                <button
                  type="button"
                  data-track="click_book_consultation"
                  data-location="offer_popup_poster"
                  onClick={() => {
                    requestClose();
                    openBookingModal();
                  }}
                  aria-label={offer.alt}
                  className="block w-full cursor-pointer overflow-hidden"
                >
                  <img
                    src={offer.src}
                    alt={offer.alt}
                    width={OFFER_IMAGE_SIZE}
                    height={OFFER_IMAGE_SIZE}
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </button>
                <BookCTA location="offer_popup" onClick={requestClose} className="m-2.5 px-4" />
              </div>
            ))}
          </div>

          {/* Small ideas that fit the "up to 10 sq. inch" offer; each opens booking with a style */}
          <div className="mt-7">
            <p className="text-center font-display text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">
              Need an idea? These fit the 10 sq. inch offer
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2">
              {OFFER_IDEAS.map((idea) => (
                <li key={idea.label}>
                  <button
                    type="button"
                    data-track="click_book_consultation"
                    data-location="offer_popup_idea"
                    onClick={() => {
                      requestClose();
                      openBookingModal(idea.style);
                    }}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs sm:min-h-0 text-foreground transition-colors hover:border-amber-700 hover:bg-accent focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
                  >
                    <TattooFlash name={idea.icon} className="h-3.5 w-3.5 text-amber-700" />
                    {idea.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <WhatsAppCTA location="offer_popup" className="bg-background" />
            <Link
              to="/offer"
              onClick={requestClose}
              data-track="click_offer"
              data-location="offer_popup"
              className="inline-flex items-center gap-2 px-2 py-3.5 font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase underline-offset-4 transition-colors hover:text-amber-800 hover:underline"
            >
              View Offer <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={requestClose}
              className="font-display text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [offerOpen, setOfferOpen] = useState(false);

  useEffect(() => {
    // The popup only runs while the GBP offer is live (India time)
    if (!isOfferActive()) return;
    const t = window.setTimeout(() => setOfferOpen(true), 10000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      {offerOpen && <OfferModal onClose={() => setOfferOpen(false)} />}
      <SiteHeader />

      {/* Hero — fine-line artwork. Its white background is multiplied into the
          page colour, so the lines look drawn straight onto the page (no box).
          Below lg: the drawing sits beside the headline (same row), with the
          buttons and features full-width underneath. From lg: tall in the
          right-hand column, text centred beside it. */}
      <section id="home" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-5 pt-6 pb-8 sm:gap-x-8 sm:pt-10 sm:pb-12 lg:grid-cols-2 lg:gap-x-10 lg:py-16">
          <div className="relative col-start-2 row-start-1 flex justify-center lg:row-span-2">
            {/* Below lg the drawing is small, so it gets a bolder-stroke version */}
            <picture>
              <source media="(max-width: 1023px)" srcSet={heroArtSmall} />
              <img
                src={heroArt}
                alt="Fine-line floral tattoo design of a woman's face intertwined with flowering vines"
                width={1260}
                height={4156}
                fetchPriority="high"
                className="relative block h-80 w-auto mix-blend-multiply sm:h-96 lg:h-[40rem] lg:max-h-[calc(100svh-10rem)] lg:min-h-[26rem]"
              />
            </picture>
          </div>

          <div className="relative z-10 col-start-1 row-start-1 lg:self-end">
            {/* The H1 is the keyword line (styled as the eyebrow); the big tagline is a <p> */}
            <h1 className="eyebrow flex items-center gap-3 leading-snug text-balance">
              <PenTool className="h-4 w-4 shrink-0 -rotate-45 text-foreground" aria-hidden="true" />
              Premium Tattoo Studio in Brookefield, Bangalore
            </h1>
            <p className="subtitle mt-4 font-display text-[clamp(2rem,9.5vw,2.6rem)] leading-[0.95] font-medium tracking-tight uppercase sm:mt-5 sm:text-6xl lg:text-7xl">
              <span className="block">Art you wear.</span>{" "}
              <span className="mt-1 block font-extrabold">For life.</span>
            </p>
            <p className="mt-4 max-w-[19rem] text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:max-w-md sm:text-base">
              Custom tattoos. Premium hygiene. Unmatched artistry.
              <span className="hidden sm:inline">
                <br />
              </span>{" "}
              We turn your ideas into timeless ink.
            </p>
          </div>

          <div className="relative z-10 col-span-2 row-start-2 lg:col-span-1 lg:col-start-1 lg:self-start">
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <BookCTA location="hero" className="col-span-2 sm:px-7" />
              <Link
                to="/gallery"
                className="col-span-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-primary bg-background px-4 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-7 md:min-h-13 [@media(hover:hover)]:hover:bg-accent"
              >
                View Work
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-border pt-5 sm:mt-12 sm:gap-6 sm:border-0 sm:pt-0">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
                  <Icon className="h-5 w-5 sm:mt-0.5 sm:h-6 sm:w-6" strokeWidth={1.4} />
                  <div>
                    <p className="font-display text-xs leading-tight font-semibold sm:text-sm">
                      {title}
                    </p>
                    <p className="hidden text-xs text-muted-foreground sm:block">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About — short teaser; the full story lives on /about */}
      <section id="about" className="mx-auto max-w-7xl px-5 pb-12 sm:pb-16">
        <SectionHeading
          eyebrow="About Xing Premium Tattoo Studio"
          title="Premium Tattoo Studio in Brookefield, Bangalore"
        />
        <p className="mx-auto mt-4 max-w-xs text-center font-script text-xl text-amber-700 sm:mt-5 sm:max-w-sm sm:text-2xl">
          We make forever look easy.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          A premium tattoo studio in AECS Layout, Brookefield — {ADDRESS.landmark}. Every design at
          Xing Premium Tattoo Studio is drawn from scratch and inked by Peace (Chingri Awungshi),
          our Lead Artist, with single-use needles opened in front of you. Trusted by clients from
          Brookefield, Marathahalli, Whitefield and across East Bengaluru.
        </p>

        <StudioHighlights />

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <Link
            to="/about"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-primary px-7 py-3.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
          >
            Read Our Story <ArrowRight className="h-4 w-4" />
          </Link>
          <BookCTA location="home_about" className="px-7" />
        </div>
      </section>

      <QuickAnswer data={homeQuickAnswer} className="mx-auto max-w-3xl px-5 pb-12 sm:pb-16" />

      {/* Services */}
      <section id="services" className="cv-auto mx-auto max-w-7xl px-5 pb-12 sm:pb-16">
        <SectionHeading eyebrow="Our Services" title="Tattoo Styles We Specialize In" />
        {/* Box-free style cards: photo, then a numbered label on a hairline that fills amber on hover */}
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-6">
          {SERVICE_SLUGS.map((slug, i) => {
            const s = services[slug];
            return (
              <li key={slug}>
                <Link to="/services/$slug" params={{ slug }} className="group block">
                  <span className="block overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={s.cardImage}
                      alt={s.heroImageAlt}
                      width={640}
                      height={800}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </span>
                  <div className="relative mt-3 pt-3">
                    <span
                      className="absolute top-0 left-0 h-px w-full bg-border"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute top-0 left-0 h-px w-6 bg-amber-700 transition-all duration-500 group-hover:w-full"
                      aria-hidden="true"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-xs font-semibold text-amber-700 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-xs font-semibold tracking-[0.12em] uppercase transition-colors group-hover:text-amber-700 sm:text-[0.8rem]">
                          {s.shortName}
                        </h3>
                      </div>
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-amber-700"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                      {s.tagline}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 sm:w-auto font-display text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            View All Services
          </Link>
        </div>
      </section>

      {/* Artist — short teaser; the full profile lives on /tattoo-artist */}
      <section
        id="artist"
        aria-labelledby="artist-title"
        className="cv-auto relative mx-auto max-w-7xl overflow-hidden px-5 py-12 sm:py-16"
      >
        <div className="relative grid items-center gap-6 sm:gap-10 lg:grid-cols-[0.95fr_1fr] lg:gap-14">
          {/* Portrait — white backdrop multiplies into the page colour, no hard box */}
          <figure className="group relative mx-auto w-full max-w-[20rem] sm:max-w-[520px]">
            <img
              src={artistPortrait}
              alt="Peace (Chingri Awungshi), best tattoo artist in Brookefield, Bengaluru, arms crossed showing tattooed forearms at Xing Premium Tattoo Studio"
              width={1200}
              height={1350}
              loading="lazy"
              className="w-full mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <figcaption className="sr-only">
              Peace, lead tattoo artist at Xing Premium Tattoo Studio, Brookefield
            </figcaption>
          </figure>

          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-amber-700" /> Meet The Artist
            </p>
            <h2
              id="artist-title"
              className="mt-5 font-display text-[2rem] leading-[1.1] font-medium tracking-tight sm:mt-6 sm:text-5xl"
            >
              One hand behind
              <br />
              every{" "}
              <span className="font-script text-[2.6rem] text-amber-700 sm:text-6xl">piece</span> in
              this studio.
            </h2>
            <p className="mt-4 font-display text-sm font-semibold tracking-wide text-foreground/80">
              Peace — Lead Artist, Brookefield, Bengaluru
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              {COUNTS.years} years, {COUNTS.tattoos} tattoos and a {GOOGLE_RATING}★ Google rating.
              Every consultation, stencil and session at Xing is done by Peace personally — from
              realism and portraits to fine-line and Indian traditional work.
            </p>

            <div className="mt-7 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-8">
              {/* Signature */}
              <div className="relative pr-4">
                <p
                  className="font-signature -rotate-3 text-5xl leading-none text-foreground sm:text-7xl"
                  aria-label="Signed, Peace"
                >
                  Peace
                </p>
                <svg
                  viewBox="0 0 200 24"
                  className="-mt-2 h-5 w-44 text-amber-700"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 16C50 8 110 5 196 9c-40 2-78 6-112 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="eyebrow mt-1">Chingri Awungshi · Lead Artist</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <BookCTA
                  location="home_artist"
                  label="Book with Peace"
                  className="col-span-2 sm:col-span-1"
                />
                <Link
                  to="/tattoo-artist"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-primary px-4 py-4 sm:px-7 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
                >
                  Meet Peace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery preview — the full gallery lives on /gallery */}
      <section
        id="gallery"
        aria-labelledby="gallery-title"
        className="cv-auto mx-auto max-w-7xl px-5 pb-12 sm:pb-16"
      >
        <SectionHeading id="gallery-title" eyebrow="Our Work" title="Tattoo Gallery" />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
          Real tattoos by Peace, no stock photos. Tap a photo to see more of that style.
        </p>
        <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          {galleryPreview.map(({ img, alt, tag, href }) => (
            <li key={img}>
              <a href={href} className="group media-hover block rounded-sm">
                <img
                  src={img}
                  srcSet={gallerySrcSet(img)}
                  sizes={GALLERY_SIZES}
                  alt={alt}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="sr-only">: see more {tag} tattoos</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/gallery"
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-primary px-7 font-display text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90 sm:w-auto"
          >
            See the Full Gallery <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <BookCTA location="home_gallery" variant="secondary" className="w-full px-7 sm:w-auto" />
        </div>
      </section>

      <ReviewsSection />

      <RelatedGuides
        posts={homeGuides}
        limit={6}
        eyebrow="Tattoo Guides & Answers"
        title="Tattoo Advice from Our Brookefield Studio"
        intro="Straight answers on cost, pain, hygiene and aftercare from Peace — plus tips for clients coming from Whitefield, ITPL and Marathahalli."
      />

      {/* FAQ — the five most-asked questions; the full set lives on /faq */}
      <section
        id="faq"
        aria-labelledby="home-faq-title"
        className="cv-auto mx-auto max-w-7xl px-5 pb-12 sm:pb-16"
      >
        <div className="grid gap-7 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-amber-700" /> Good To Know
            </p>
            <h2
              id="home-faq-title"
              className="mt-4 font-display text-[1.75rem] leading-[1.1] font-medium tracking-tight sm:mt-5 sm:text-4xl"
            >
              Frequently asked{" "}
              <span className="font-script text-[2.2rem] text-amber-700 sm:text-5xl">
                questions
              </span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The five things people ask us most before a session. Cost, pain, hygiene, first
              tattoos and aftercare — plus {faqs.length - homeFaqs.length} more answers on our FAQ
              page.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Link
                to="/faq"
                className="inline-flex min-h-12 items-center justify-center gap-2 sm:gap-3 rounded-full bg-primary px-6 py-3.5 font-display text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
              >
                All {faqs.length} FAQs
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
              <WhatsAppCTA location="home_faq" className="px-3 sm:px-6" />
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue={homeFaqIds[0]!} className="space-y-3">
            {homeFaqs.map((faq, i) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-sm border border-border bg-card px-4 shadow-[var(--shadow-card)] transition-colors data-[state=open]:border-amber-700/40 sm:px-5"
              >
                <AccordionTrigger
                  data-faq-q
                  className="gap-3 py-4 font-display text-sm font-semibold hover:no-underline sm:gap-4 sm:py-5 sm:text-base"
                >
                  <span className="flex items-center gap-4 text-left">
                    {/* Number as CSS content, so it isn't part of the question text */}
                    <span
                      aria-hidden="true"
                      data-n={String(i + 1).padStart(2, "0")}
                      className="font-display text-xs font-bold text-amber-700 tabular-nums before:content-[attr(data-n)]"
                    />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="pb-5 text-sm leading-relaxed text-muted-foreground sm:pl-9"
                >
                  <p data-faq-a>{faq.answer}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-semibold tracking-wide text-foreground/70 uppercase">
                      People also ask:
                    </span>
                    {faq.related.slice(0, 2).map((rid) => (
                      <Link
                        key={rid}
                        to="/faq"
                        hash={rid}
                        className="inline-flex min-h-11 items-center text-amber-700 underline decoration-amber-700/30 underline-offset-4 hover:decoration-amber-700"
                      >
                        {faqById.get(rid)?.question}
                      </Link>
                    ))}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <BookingCTA />

      <SiteFooter showMap />
    </main>
  );
}
