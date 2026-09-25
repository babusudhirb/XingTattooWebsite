import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CrownIcon,
  MessageCircle,
  PenTool,
  ShieldCheck,
  Shuffle,
  X,
} from "lucide-react";

import heroArt from "@/assets/hero-fineline-art.png";
import artistPortrait from "@/assets/artist/peace-tattoo-artist-xing-brookefield.jpg";
import offer1 from "@/assets/offers/offer-1.jpg";
import offer2 from "@/assets/offers/offer-2.jpg";

import { WHATSAPP_URL } from "@/data/site";
import { SERVICE_SLUGS, services } from "@/data/services";
import {
  gallery,
  galleryFilters,
  loadGallerySeen,
  mixGallery,
  saveGallerySeen,
} from "@/data/gallery";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SocialDock } from "@/components/site/SocialDock";
import { SectionHeading } from "@/components/site/SectionHeading";
import { GalleryLightbox } from "@/components/site/GalleryLightbox";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { BookingCTA } from "@/components/site/BookingCTA";
import { StudioHighlights } from "@/components/site/StudioHighlights";
import { reviewsSchema } from "@/data/reviews";
import { faqById, faqs, homeFaqIds } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { openBookingModal } from "@/components/site/BookingContext";
import { TattooFlash, type FlashName } from "@/components/site/TattooFlash";

const GALLERY_PAGE_SIZE = 24;
const GALLERY_PAGE_SIZE_PHONE = 12;

/** Client-only: how many photos to show per page on this screen. */
function galleryPageSizeForScreen() {
  return window.matchMedia("(max-width: 639px)").matches
    ? GALLERY_PAGE_SIZE_PHONE
    : GALLERY_PAGE_SIZE;
}

const homeFaqs = homeFaqIds.map((id) => faqById.get(id)!);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XING Tattoo Studio | Custom Tattoo Studio in Brookefield, Bengaluru" },
      {
        name: "description",
        content:
          "Custom tattoo studio in Brookefield, Bengaluru. Artist Peace (15+ yrs) designs every piece from scratch. 4.9★ on Google, single-use needles. Free consultation.",
      },
      { property: "og:title", content: "XING Tattoo Studio | Art You Wear" },
      {
        property: "og:description",
        content:
          "Custom tattoos, premium hygiene and unmatched artistry. Book a free consultation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(reviewsSchema()) }],
  }),
  component: Index,
});

const features = [
  { icon: PenTool, title: "Custom Designs", text: "Personalized just for you" },
  { icon: ShieldCheck, title: "Safe & Hygienic", text: "100% sterile & safe" },
  { icon: CrownIcon, title: "Premium Quality", text: "Premium inks & equipment" },
];

const offerImages = [
  { src: offer1, alt: "Festival offer — any tattoo up to 10 sq. inch for ₹2,499" },
  {
    src: offer2,
    alt: "Festival offer — 50% off tattoos, black & grey ₹399 or colour ₹499 per sq. inch",
  },
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

/** Small pieces that fit the "any tattoo up to 10 sq. inch" offer; style pre-fills booking. */
const OFFER_IDEAS: { label: string; style: string; icon: FlashName }[] = [
  { label: "Fine-line rose", style: "Minimalist", icon: "rose" },
  { label: "Mini compass", style: "Geometric", icon: "compass" },
  { label: "Moon & stars", style: "Minimalist", icon: "moon" },
  { label: "Heart & name banner", style: "Minimalist", icon: "heart" },
  { label: "Name or date script", style: "Minimalist", icon: "sparkle" },
  { label: "Om or Trishul", style: "Traditional", icon: "sparkle" },
  { label: "Mini dagger", style: "Black & Grey", icon: "dagger" },
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
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? "opacity-0" : "animate-fade-in opacity-100"
        }`}
        onClick={requestClose}
      />
      <div
        ref={panelRef}
        className={`relative z-10 max-h-[94vh] w-full max-w-3xl overflow-x-hidden overflow-y-auto rounded-sm border border-amber-400/30 bg-[#0b0a08] text-stone-100 shadow-[0_0_60px_-15px_rgba(245,158,11,0.35)] transition-all duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          closing ? "scale-95 opacity-0" : "animate-scale-in scale-100 opacity-100"
        }`}
      >
        {/* Decoration: gold glow + drifting flash-sheet line art, all behind content */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.18),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(250,204,21,0.08),transparent_50%)]" />
          <div className="absolute inset-3 rounded-sm border border-amber-400/10" />
          {OFFER_FLASH.map(({ name, className, rotate, delay }) => (
            <TattooFlash
              key={name}
              name={name}
              className={`flash-drift absolute text-amber-300/20 ${className}`}
              style={{ "--r": `${rotate}deg`, animationDelay: `${delay}s` } as React.CSSProperties}
            />
          ))}
        </div>

        <button
          ref={closeRef}
          onClick={requestClose}
          aria-label="Close offer"
          className="absolute top-3 right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/30 bg-black/60 text-amber-100 backdrop-blur transition-transform duration-300 hover:scale-110 hover:bg-black focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none sm:top-4 sm:right-4"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-4 pt-16 sm:p-8">
          <header className="text-center">
            <p className="font-display text-[0.65rem] font-semibold tracking-[0.3em] text-amber-400 uppercase">
              Festival Offer · Valid Until Oct 30
            </p>
            <h2
              id="offer-title"
              className="mt-2 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text font-display text-2xl font-bold tracking-wide text-transparent uppercase sm:text-3xl"
            >
              Stories On Skin, For Less
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-amber-400/60">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/60" />
              <TattooFlash name="sparkle" className="h-3 w-3" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>
          </header>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {offerImages.map((offer) => (
              <div
                key={offer.alt}
                className="group flex flex-col overflow-hidden rounded-sm border border-amber-400/25 bg-black shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-[0_14px_40px_-12px_rgba(245,158,11,0.35)]"
              >
                <button
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
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </button>
                <button
                  onClick={() => {
                    requestClose();
                    openBookingModal();
                  }}
                  className="flex items-center justify-center gap-2 bg-yellow-400 px-4 py-3 font-display text-xs font-bold tracking-[0.14em] text-black uppercase transition-colors hover:bg-yellow-300"
                >
                  Claim This Offer <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Small ideas that fit the "up to 10 sq. inch" offer; each opens booking with a style */}
          <div className="mt-7">
            <p className="text-center font-display text-[0.65rem] font-semibold tracking-[0.2em] text-amber-400/90 uppercase">
              Need an idea? These fit the 10 sq. inch offer
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2">
              {OFFER_IDEAS.map((idea) => (
                <li key={idea.label}>
                  <button
                    onClick={() => {
                      requestClose();
                      openBookingModal(idea.style);
                    }}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-amber-400/25 bg-white/[0.03] px-3 py-1.5 text-xs sm:min-h-0 text-stone-200 transition-colors hover:border-amber-400/70 hover:bg-amber-400/10 hover:text-amber-100 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  >
                    <TattooFlash name={idea.icon} className="h-3.5 w-3.5 text-amber-400" />
                    {idea.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-amber-400/60 px-6 py-3.5 font-display text-xs font-semibold tracking-[0.14em] text-amber-100 uppercase transition-colors hover:bg-amber-400/10"
            >
              <MessageCircle className="h-4 w-4" /> Chat On WhatsApp
            </a>
            <button
              onClick={requestClose}
              className="font-display text-xs font-semibold tracking-[0.14em] text-stone-400 uppercase underline-offset-4 transition-colors hover:text-stone-100 hover:underline"
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
  const [filter, setFilter] = useState("All");
  const [offerOpen, setOfferOpen] = useState(false);
  const [galleryPageSize, setGalleryPageSize] = useState(GALLERY_PAGE_SIZE);
  const [galleryVisibleCount, setGalleryVisibleCount] = useState(GALLERY_PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryAutoLoad, setGalleryAutoLoad] = useState(false);
  const galleryEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setOfferOpen(true), 10000);
    return () => window.clearTimeout(t);
  }, []);

  // Jumping in via the "Gallery" nav link (or any direct #gallery link) means
  // the visitor wants to browse the whole thing — switch to auto-load-on-scroll.
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#gallery") setGalleryAutoLoad(true);
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  // Server renders the stored order; the browser reshuffles after mount so each
  // visit shows a different, style-mixed set (shuffling during render would make
  // the server and client HTML disagree). The gallery is below the fold, so the
  // swap isn't visible. Photos this visitor saw on earlier visits go to the back,
  // so each visit (and each Shuffle click) leads with photos they haven't seen.
  const [mixedGallery, setMixedGallery] = useState(gallery);
  const nextGalleryMix = useCallback(() => {
    const pageSize = galleryPageSizeForScreen();
    const { visit, seen } = loadGallerySeen();
    const mixed = mixGallery(gallery, Math.random, seen);
    // Only what's actually on screen counts as "seen"
    saveGallerySeen(visit + 1, seen, mixed.slice(0, pageSize));
    setMixedGallery(mixed);
    setGalleryPageSize(pageSize);
    setGalleryVisibleCount(pageSize);
  }, []);
  useEffect(nextGalleryMix, [nextGalleryMix]);
  const reshuffleGallery = () => nextGalleryMix();

  const visibleGallery =
    filter === "All" ? mixedGallery : mixedGallery.filter((g) => g.tag === filter);
  const shownGallery = visibleGallery.slice(0, galleryVisibleCount);
  const hasMoreGallery = galleryVisibleCount < visibleGallery.length;

  useEffect(() => {
    setGalleryVisibleCount(galleryPageSize);
  }, [filter, galleryPageSize]);

  useEffect(() => {
    if (!galleryAutoLoad || !hasMoreGallery) return;
    const el = galleryEndRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setGalleryVisibleCount((c) => Math.min(c + galleryPageSize, visibleGallery.length));
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [
    galleryAutoLoad,
    hasMoreGallery,
    galleryVisibleCount,
    visibleGallery.length,
    galleryPageSize,
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      {offerOpen && <OfferModal onClose={() => setOfferOpen(false)} />}
      <SiteHeader onOfferClick={() => setOfferOpen(true)} />

      {/* Hero — fine-line artwork. Its white background is multiplied into the
          page colour, so the lines look drawn straight onto the page (no box).
          Phones: centred above the text, sized so art + text fit one screen.
          From lg: tall in the right-hand column. */}
      <section id="home" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-5 lg:py-16">
          <div className="relative flex justify-center pt-6 sm:pt-10 lg:order-last lg:pt-0">
            {/* Soft warm glow behind the drawing */}
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.10),transparent)] lg:w-[60%]"
              aria-hidden="true"
            />
            <img
              src={heroArt}
              alt="Fine-line floral tattoo design of a woman's face intertwined with flowering vines"
              width={315}
              height={1039}
              fetchPriority="high"
              className="relative block h-[32svh] max-h-[24rem] min-h-[14rem] w-auto mix-blend-multiply sm:h-[42svh] sm:max-h-[28rem] lg:h-[40rem] lg:max-h-[calc(100svh-10rem)] lg:min-h-[26rem]"
            />
          </div>

          <div className="relative z-10 px-5 pt-6 pb-8 sm:pt-8 sm:pb-12 lg:px-0 lg:pt-0 lg:pb-0">
            <div className="flex items-center gap-3">
              <PenTool className="h-4 w-4 -rotate-45" />
              <p className="eyebrow">Ink Your Story</p>
            </div>
            <h1 className="mt-4 font-display text-[2.6rem] leading-[0.95] font-medium tracking-tight uppercase sm:mt-5 sm:text-6xl lg:text-7xl">
              Art you wear.
              <span className="mt-1 block font-extrabold">For life.</span>
            </h1>
            <p className="mt-4 max-w-[19rem] text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:max-w-md sm:text-base">
              Custom tattoos. Premium hygiene. Unmatched artistry.
              <span className="hidden sm:inline">
                <br />
              </span>{" "}
              We turn your ideas into timeless ink.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-primary px-4 font-display text-xs font-semibold tracking-[0.12em] text-primary-foreground uppercase transition-opacity hover:opacity-90 sm:gap-3 sm:px-7 sm:py-4 sm:tracking-[0.14em]"
              >
                <span className="sm:hidden">Book Now</span>
                <span className="hidden sm:inline">Book Consultation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#gallery"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-primary bg-background px-4 font-display text-xs font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-accent sm:px-7 sm:py-4 sm:tracking-[0.14em]"
              >
                <span className="sm:hidden">Our Work</span>
                <span className="hidden sm:inline">Explore Work</span>
              </a>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-border pt-5 sm:mt-12 sm:gap-6 sm:border-0 sm:pt-0">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
                  <Icon className="h-5 w-5 sm:mt-0.5 sm:h-6 sm:w-6" strokeWidth={1.4} />
                  <div>
                    <p className="font-display text-[0.7rem] leading-tight font-semibold sm:text-sm">
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
          eyebrow="About XING Tattoo Studio"
          title="Custom Tattoo Studio in Brookefield, Bengaluru"
        />
        <p className="mx-auto mt-4 max-w-xs text-center font-script text-xl text-amber-700 sm:mt-5 sm:max-w-sm sm:text-2xl">
          We make forever look easy.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          A custom tattoo studio in AECS Layout, Brookefield — right above D-Mart. Since 2021, every
          design has been drawn from scratch and inked by one artist, with single-use needles opened
          in front of you. Trusted by clients from Whitefield, Marathahalli and across East
          Bengaluru.
        </p>

        <StudioHighlights />

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <Link
            to="/about"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-primary px-7 py-3.5 font-display text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
          >
            Read Our Story <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => openBookingModal()}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-primary px-7 py-3.5 font-display text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            Book Free Consultation <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-5 pb-12 sm:pb-16">
        <SectionHeading eyebrow="Our Services" title="Tattoo Styles We Specialize In" />
        {/* Box-free style cards: photo, then a numbered label on a hairline that fills amber on hover */}
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-6">
          {SERVICE_SLUGS.map((slug, i) => {
            const s = services[slug];
            return (
              <li key={slug}>
                <Link to="/services/$slug" params={{ slug }} className="group block">
                  <span className="block overflow-hidden rounded-sm bg-muted">
                    <img
                      src={s.heroImage}
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
                        <span className="font-display text-[0.65rem] font-semibold text-amber-700 tabular-nums">
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
            className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-primary px-7 py-3.5 sm:w-auto font-display text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            View All Services
          </Link>
        </div>
      </section>

      {/* Artist — short teaser; the full profile lives on /tattoo-artist */}
      <section
        id="artist"
        aria-labelledby="artist-title"
        className="relative mx-auto max-w-7xl overflow-hidden px-5 py-12 sm:py-16"
      >
        <div className="relative grid items-center gap-6 sm:gap-10 lg:grid-cols-[0.95fr_1fr] lg:gap-14">
          {/* Portrait — white backdrop multiplies into the page colour, no hard box */}
          <figure className="group relative mx-auto w-full max-w-[20rem] sm:max-w-[520px]">
            <img
              src={artistPortrait}
              alt="Peace (Chingri Awungshi), best tattoo artist in Brookefield, Bengaluru, arms crossed showing tattooed forearms at XING Tattoo Studio"
              width={1200}
              height={1350}
              loading="lazy"
              className="w-full mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <figcaption className="sr-only">
              Peace, lead tattoo artist at XING Tattoo Studio, Brookefield
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
              Peace (Chingri Awungshi) — Lead Tattoo Artist, Brookefield, Bengaluru
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              15+ years, 1800+ tattoos and a 4.9★ Google rating. Every consultation, stencil and
              session at XING is done by Peace personally — from realism and portraits to fine-line
              and Indian traditional work.
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
                <button
                  onClick={() => openBookingModal()}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-primary px-4 py-4 sm:gap-3 sm:px-7 font-display text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="sm:hidden">Book Now</span>
                  <span className="hidden sm:inline">Book With Peace</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
                <Link
                  to="/tattoo-artist"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-primary px-4 py-4 sm:px-7 font-display text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
                >
                  Meet Peace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mx-auto max-w-7xl px-5 pb-12 sm:pb-16">
        <SectionHeading eyebrow="Our Work" title="Tattoo Gallery" />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
          {gallery.length}+ real tattoos from the chair — no stock photos. Tap any style to filter,
          tap any photo to see it up close.
        </p>
        {/* Phones: one swipeable row (bleeds to the screen edges); wraps and centres from sm */}
        <div className="-mx-5 mt-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-6 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
          {galleryFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`min-h-11 shrink-0 snap-start rounded-sm px-4 py-2 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={reshuffleGallery}
            aria-label="Shuffle gallery photos"
            className="inline-flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-sm border border-border px-4 py-2 text-xs font-medium whitespace-nowrap text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-700 hover:text-foreground"
          >
            <Shuffle className="h-3.5 w-3.5" /> Shuffle
          </button>
        </div>
        <div className="mt-5 columns-2 gap-3 sm:mt-6 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5">
          {shownGallery.map(({ img, alt, tag }, i) => (
            <button
              key={`${filter}-${tag}-${alt}-${i}`}
              onClick={() => setLightboxIndex(i)}
              aria-label={`View ${alt}`}
              className="animate-fade-in group media-hover mb-3 block w-full sm:mb-4 appearance-none break-inside-avoid rounded-sm border-0 bg-transparent p-0 text-left focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
              style={{
                animationDelay: `${(i % galleryPageSize) * 0.05}s`,
                animationFillMode: "backwards",
              }}
            >
              <img
                src={img}
                alt={alt}
                width={640}
                height={768}
                loading="lazy"
                className="block h-auto w-full cursor-zoom-in"
              />
              <span className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/85 via-primary/20 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                <span className="font-display text-[0.6rem] tracking-[0.16em] text-primary-foreground uppercase">
                  {tag}
                </span>
                <span className="mt-1 text-xs text-primary-foreground/80">{alt}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          {hasMoreGallery && galleryAutoLoad && (
            <p
              ref={galleryEndRef}
              className="animate-pulse text-xs tracking-wide text-muted-foreground uppercase"
            >
              Loading more tattoos…
            </p>
          )}
          {hasMoreGallery && !galleryAutoLoad && (
            <button
              onClick={() => setGalleryVisibleCount((c) => c + galleryPageSize)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 sm:w-auto rounded-sm border border-primary px-7 py-3.5 font-display text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent"
            >
              Load More Tattoos ({visibleGallery.length - galleryVisibleCount} more)
            </button>
          )}
          <button
            onClick={() => openBookingModal()}
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-sm bg-primary px-7 py-3.5 font-display text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90 sm:w-auto"
          >
            <span className="sm:hidden">Book Your Consultation</span>
            <span className="hidden sm:inline">Love What You See? Book Your Consultation</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </section>

      <GalleryLightbox
        items={visibleGallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <ReviewsSection />

      {/* FAQ — the five most-asked questions; the full set lives on /faq */}
      <section
        id="faq"
        aria-labelledby="home-faq-title"
        className="mx-auto max-w-7xl px-5 pb-12 sm:pb-16"
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
              Tattoo questions,{" "}
              <span className="font-script text-[2.2rem] text-amber-700 sm:text-5xl">answered</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The five things people ask us most before a session. Cost, pain, hygiene, first
              tattoos and aftercare — plus {faqs.length - homeFaqs.length} more answers on our FAQ
              page.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Link
                to="/faq"
                className="inline-flex min-h-12 items-center justify-center gap-2 sm:gap-3 rounded-sm bg-primary px-6 py-3.5 font-display text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
              >
                <span className="sm:hidden">All {faqs.length} FAQs</span>
                <span className="hidden sm:inline">View All {faqs.length} FAQs</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-primary px-3 py-3.5 font-display text-xs font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-accent sm:px-6 sm:tracking-[0.14em]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">Ask Us</span>
                <span className="hidden sm:inline">Ask Your Question</span>
              </a>
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue={homeFaqIds[0]!} className="space-y-3">
            {homeFaqs.map((faq, i) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-sm border border-border bg-card px-4 shadow-[var(--shadow-card)] transition-colors data-[state=open]:border-amber-700/40 sm:px-5"
              >
                <AccordionTrigger className="gap-3 py-4 font-display text-sm font-semibold hover:no-underline sm:gap-4 sm:py-5 sm:text-base">
                  <span className="flex items-center gap-4 text-left">
                    <span className="font-display text-xs font-bold text-amber-700 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="pb-5 text-sm leading-relaxed text-muted-foreground sm:pl-9"
                >
                  <p>{faq.answer}</p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-semibold tracking-wide text-foreground/70 uppercase">
                      People also ask:
                    </span>
                    {faq.related.slice(0, 2).map((rid) => (
                      <Link
                        key={rid}
                        to="/faq"
                        hash={rid}
                        className="text-amber-700 underline decoration-amber-700/30 underline-offset-4 hover:decoration-amber-700"
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

      <SiteFooter />
    </main>
  );
}
