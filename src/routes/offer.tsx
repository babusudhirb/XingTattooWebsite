import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { offerFaqs } from "@/data/page-content";
import { isOfferActive } from "@/data/business";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { track } from "@/lib/trackEvent";
import offerCss from "@/styles/offer-page.css?url";
import artistPortrait from "@/assets/artist/peace-tattoo-artist-xing-brookefield.webp";
import offerHeroSamurai from "@/assets/offers/page/offer-hero-samurai.webp";
import {
  ADDRESS,
  BRAND_NAME,
  BUSINESS_ID,
  BUSINESS_NAME,
  LOGO_HEIGHT,
  LOGO_SRC,
  LOGO_WIDTH,
  COUNTS,
  DIRECTIONS_URL,
  HOURS_TEXT,
  MAP_EMBED_URL,
  OFFER,
  pageTitle,
  SERVICE_AREAS,
  SITE_URL,
} from "@/data/business";
import { useOfferActive } from "@/hooks/useOfferActive";
import { ARTIST } from "@/data/artist";
import { offerDaysLeft } from "@/data/offer";
import { GOOGLE_RATING, reviews } from "@/data/reviews";
import { services } from "@/data/services";
import { GOOGLE_REVIEWS_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/data/navigation";
import { sendOfferClaim } from "@/lib/booking-request";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { faqNode, seoHead } from "@/lib/seoHead";
import { breadcrumbSchema } from "@/lib/blog";

/*
 * Offer landing page (/offer) — an ad landing page: the logo is the only link
 * back into the main site, every other exit is a conversion (claim popup,
 * WhatsApp, call, map).
 * Styles live in src/styles/offer-page.css, scoped under .olp.
 */

const TITLE = pageTitle("Tattoo Offer in Brookefield, Bangalore");
const DESCRIPTION = `Up to 50% off custom tattoos at Xing Premium Tattoo Studio, Brookefield. ${OFFER.validLabel}. Book a free consultation on WhatsApp or in AECS Layout.`;

const wa = (text: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;

/* Intent events only (see lib/trackEvent.ts). Never treat these clicks as confirmed
   bookings. No form text is tracked. */
function trackIntent(event: string, placement?: string) {
  track(event, { location: placement || "offer_page", page_variant: "xing_offer_v2" });
}

/* ── Content ─────────────────────────────────────────────────────────── */

const { realism, portrait, geometric, minimalist, traditional } = services;
const blackGrey = services["black-grey"];

const HERO_IMAGE = {
  src: offerHeroSamurai,
  alt: "Black and grey samurai warrior forearm tattoo with red accents by Xing Premium Tattoo Studio, Brookefield, Bengaluru",
};

type OfferId = "small" | "10-sq-inch" | "large-50" | "privilege";

interface Offer {
  id: OfferId;
  badge: string;
  /** Short name used in the claim form and the lead email. */
  name: string;
  kicker: string;
  /** Small line above the headline on the photo, e.g. "Up to". */
  pricePrefix?: string;
  /** Headline on the photo — never a rupee figure; the exact quote comes at the consultation. */
  price: string;
  title: string;
  text: string;
  img: string;
  alt: string;
  featured?: boolean;
}

const OFFERS: Offer[] = [
  {
    id: "small",
    badge: "Perfect first tattoo",
    name: "Small & first tattoo offer",
    kicker: "Small & first tattoos",
    price: "Offer price",
    title: "Small & first tattoos",
    text: "Minimal, fine-line, name and symbol tattoos.",
    img: minimalist.galleryImages[6]!.src,
    alt: "Fine-line floral heart tattoo on wrist — small tattoo offer at Xing Premium Tattoo Studio, Brookefield",
  },
  {
    id: "10-sq-inch",
    badge: "Most popular",
    name: "Any 10 sq. inch tattoo offer",
    kicker: "Any 10 sq. inch tattoo",
    price: "Offer price",
    title: "Any 10 sq. inch tattoo",
    text: "Any design, any style — up to 10 square inches.",
    img: geometric.cardImage,
    alt: "Geometric compass and moon forearm tattoo — 10 sq. inch tattoo offer at Xing Premium Tattoo Studio, Brookefield",
    featured: true,
  },
  {
    id: "large-50",
    badge: "Biggest saving",
    name: "Up to 50% off large tattoos",
    kicker: "Large tattoos",
    pricePrefix: "Up to",
    price: "50% off",
    title: "Up to 50% off large tattoos",
    text: "Sleeves, back pieces, portraits and cover-ups.",
    img: realism.galleryImages[1]!.src,
    alt: "Realistic eagle wing sleeve tattoo — up to 50% off large tattoos at Xing Premium Tattoo Studio",
  },
  {
    id: "privilege",
    badge: "Additional privilege",
    name: "Extra savings on bigger pieces",
    kicker: "Spend more, save more",
    price: "Extra off",
    title: "Extra savings on bigger pieces",
    text: "Larger pieces get extra savings — ask at your free consultation.",
    img: traditional.cardImage,
    alt: "Detailed black and grey hand tattoo — extra savings on bigger pieces at Xing Premium Tattoo Studio",
  },
];

/** Compact offer picker in the desktop hero; each opens the claim popup preselected. */
const HERO_PICKS: { id: OfferId; value: string; label: string; popular?: boolean }[] = [
  { id: "small", value: "Offer price", label: "Small & first" },
  { id: "10-sq-inch", value: "Offer price", label: "Any 10 sq. inch", popular: true },
  { id: "large-50", value: "50% off", label: "Large tattoos" },
  { id: "privilege", value: "Extra off", label: "Bigger pieces" },
];

const WHY_XING: { value: string; label: string; text: string; icon: ReactNode }[] = [
  {
    value: `${COUNTS.years} yrs`,
    label: "Artist experience",
    text: "Every piece by Peace, our lead artist.",
    icon: (
      <path d="M16 4 19.6 11.3 27.7 12.5 21.8 18.2 23.2 26.2 16 22.4 8.8 26.2 10.2 18.2 4.3 12.5 12.4 11.3Z" />
    ),
  },
  {
    value: "Single-use",
    label: "Needles",
    text: "Sealed and opened in front of you.",
    icon: <path d="m16 3 11 4v9c0 6-11 13-11 13S5 22 5 16V7ZM11 15l4 4 7-8" />,
  },
  {
    value: "Imported",
    label: "Premium US ink",
    text: "Vivid, skin-safe, built to last.",
    icon: (
      <path d="M16 4c5 7 8 11.5 8 15.5a8 8 0 0 1-16 0C8 15.5 11 11 16 4ZM12.5 20a3.5 3.5 0 0 0 3.5 3.5" />
    ),
  },
  {
    value: `${ARTIST.tattoosCompleted}`,
    label: "Tattoos done",
    text: "Without a single concern.",
    icon: <path d="M5 17l7 7L27 8" />,
  },
];

const WORK = [
  { src: realism.cardImage, alt: realism.heroImageAlt },
  portrait.galleryImages[0]!,
  { src: minimalist.cardImage, alt: minimalist.heroImageAlt },
  geometric.galleryImages[0]!,
  { src: blackGrey.cardImage, alt: blackGrey.heroImageAlt },
  { src: portrait.cardImage, alt: portrait.heroImageAlt },
  minimalist.galleryImages[2]!,
  realism.galleryImages[2]!,
];

const ARTIST_FACTS = [
  `${GOOGLE_RATING}★ Google rating`,
  `${ARTIST.yearsExperience} years experience`,
  `${ARTIST.tattoosCompleted} tattoos`,
  "English · हिन्दी · ಕನ್ನಡ",
];

const STAGES: { title: string; text: string; guide?: { label: string; items: string[] } }[] = [
  {
    title: "Consult",
    text: `Your idea, refined by ${COUNTS.tattoos} tattoos of experience.`,
    guide: {
      label: "Pre-Session Guide",
      items: [
        "Sleep well and eat a proper meal before you come in.",
        "Stay hydrated and avoid alcohol for 24 hours before.",
        "Wear loose clothing that gives easy access to the area.",
        "Tell us about any allergy, medical condition or medication.",
        "Bring a snack and water for longer sessions.",
      ],
    },
  },
  {
    title: "Design",
    text: "Custom artwork drawn for your anatomy — no stock outlines.",
  },
  {
    title: "Session",
    text: "Strict sterile protocol, start to finish.",
  },
  {
    title: "Post Care",
    text: "Tailored aftercare for lifetime preservation.",
    guide: {
      label: "Aftercare Guide",
      items: [
        "Wash gently twice a day with mild, unscented soap and pat dry.",
        "Apply a thin layer of aftercare ointment — never a thick coat.",
        "Don’t pick or scratch peeling skin.",
        "No swimming, saunas or long soaks for 2–3 weeks.",
        "Keep it out of direct sun while healing; use SPF once healed.",
      ],
    },
  },
];

const FIRST_TATTOO_POINTS = [
  {
    title: "No finished design needed",
    text: "Bring an idea, a word or a photo — we draw it with you.",
  },
  {
    title: "Honest advice on pain & placement",
    text: "We tell you what to expect before the needle starts.",
  },
  { title: "Your pace, always", text: "Take breaks whenever you like. Nothing is rushed." },
  {
    title: "Free touch-up",
    text: "One free touch-up within 45–60 days if any part heals unevenly.",
  },
];

const REVIEWS = reviews.slice(0, 6);

const offerSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OfferCatalog",
      name: `${OFFER.title} — Xing Premium Tattoo Studio`,
      url: `${SITE_URL}${OFFER.url}`,
      itemListElement: OFFERS.map((o) => ({
        "@type": "Offer",
        name: o.name,
        description: o.text,
        validFrom: `${OFFER.validFrom}T00:00:00+05:30`,
        validThrough: `${OFFER.validThrough}T23:59:59+05:30`,
        seller: { "@id": BUSINESS_ID },
      })),
    },
  ],
};

export const Route = createFileRoute("/offer")({
  // Evaluated at build (prerender): once the offer has ended, a rebuild keeps /offer
  // at 200 but drops the Offer schema, sets noindex,follow and leaves it out of the sitemap.
  head: () =>
    seoHead({
      path: "/offer",
      title: TITLE,
      description: DESCRIPTION,
      noindex: !isOfferActive(),
      links: [{ rel: "stylesheet", href: offerCss }],
      graph: [
        ...(isOfferActive() ? [...offerSchema["@graph"], faqNode(offerFaqs)] : []),
        breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Tattoo Offer" }]),
      ],
    }),
  component: OfferPage,
});

/* ── Small pieces ────────────────────────────────────────────────────── */

/** A tracked outbound link (WhatsApp, phone, maps, reviews). */
function T({
  href,
  track,
  placement,
  className,
  label,
  children,
}: {
  href: string;
  track: string;
  placement?: string;
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      className={className}
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      data-track={track}
      data-location={placement || "offer_page"}
    >
      {children}
    </a>
  );
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.5-4.8a8.5 8.5 0 1 1 16-4.2Z" />
    <path d="M8 7.6c.7 4.1 2.9 6.3 7 7l1-2.1-2.5-1-1 1c-1.4-.7-2.4-1.7-3.1-3.1l1-1-1.1-2.1Z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

const Stars = ({ n = 5 }: { n?: number }) => (
  <span className="stars" aria-label={`${n} out of 5 stars`}>
    {"★".repeat(n)}
  </span>
);

/** Opens the claim popup (optionally with an offer preselected). */
function ClaimButton({
  onOpen,
  offer,
  placement,
  className = "btn",
  children = "Claim your tattoo offer",
}: {
  onOpen: (offer: OfferId | undefined, placement: string) => void;
  offer?: OfferId;
  placement: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => onOpen(offer, placement)}>
      {children}
    </button>
  );
}

/** Studio mark — links back to the home page. */
const Brand = () => (
  <Link to="/" className="brand">
    <img
      src={LOGO_SRC}
      alt="Xing Premium Tattoo Studio — home"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
    />
  </Link>
);

/* ── Page ─────────────────────────────────────────────────────────────── */

function OfferPage() {
  const privacyRef = useRef<HTMLDialogElement>(null);
  const claimRef = useRef<HTMLDialogElement>(null);
  const [daysLeft, setDaysLeft] = useState<number | undefined>(undefined);
  const offerActive = useOfferActive();
  // The reviews' second (loop) copy is added in the browser only: in the server HTML every
  // review appears once.
  const [reviewLoop, setReviewLoop] = useState(false);
  useEffect(() => {
    setDaysLeft(offerDaysLeft());
    setReviewLoop(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const urgency =
    daysLeft === undefined
      ? OFFER.validLabel
      : daysLeft === 0
        ? "Ends tonight"
        : daysLeft === 1
          ? "Ends tomorrow"
          : `Only ${daysLeft} days left`;

  /* Claim popup */
  const [claimOffer, setClaimOffer] = useState<OfferId>("10-sq-inch");
  const [claimName, setClaimName] = useState("");
  const [claimPhone, setClaimPhone] = useState("");
  const [claimIdea, setClaimIdea] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [claimErrors, setClaimErrors] = useState<{ name?: string; phone?: string }>({});
  const [claimStatus, setClaimStatus] = useState<"idle" | "sending" | "sent" | "whatsapp">("idle");

  const openClaim = (offer: OfferId | undefined, placement: string) => {
    if (offer) setClaimOffer(offer);
    if (claimStatus !== "sending") setClaimStatus("idle");
    setClaimErrors({});
    trackIntent("offer_claim_open", placement);
    claimRef.current?.showModal();
  };

  const chosenOffer = OFFERS.find((o) => o.id === claimOffer)!;
  const claimWhatsApp = wa(
    `Hi Xing! I'd like to claim this offer: ${chosenOffer.name}.\nName: ${claimName.trim()}\nPhone: ${claimPhone.trim()}` +
      (claimIdea.trim() ? `\nMy idea: ${claimIdea.trim()}` : "") +
      "\nPlease share the quote and available slots.",
  );

  const onClaim = async (e: FormEvent) => {
    e.preventDefault();
    const errors: typeof claimErrors = {};
    if (claimName.trim().length < 2) errors.name = "Enter your name";
    if (!/^[+]?[0-9]{10,13}$/.test(claimPhone.replace(/[\s-]/g, "")))
      errors.phone = "Enter a valid phone / WhatsApp number";
    setClaimErrors(errors);
    if (errors.name || errors.phone) return;

    setClaimStatus("sending");
    trackIntent("offer_claim_submit", claimOffer);
    try {
      await sendOfferClaim({
        data: {
          name: claimName,
          phone: claimPhone,
          offer: chosenOffer.name,
          idea: claimIdea || undefined,
          company: honeypot,
        },
      });
      setClaimStatus("sent");
      track("generate_lead", { location: "offer_claim" });
    } catch (err) {
      // The WhatsApp button on the next screen still carries the claim.
      console.error("Offer claim email failed", err);
      setClaimStatus("whatsapp");
    }
  };

  /* "Design your tattoos" form */
  const [type, setType] = useState("A new tattoo");
  const [size, setSize] = useState("Not sure yet");
  const [idea, setIdea] = useState("");

  const onQuote = (e: FormEvent) => {
    e.preventDefault();
    const text = idea.trim();
    const message =
      "Hi Xing! Here's my tattoo idea.\nType: " +
      type +
      "\nSize: " +
      size +
      (text ? "\nMy idea: " + text : "") +
      "\nPlease help me with the design, offer price and appointment availability.";
    trackIntent("whatsapp_enquiry_open", "ideas_form");
    window.open(wa(message), "_blank", "noopener");
  };

  const closeOnBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    const b = e.currentTarget.getBoundingClientRect();
    if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom)
      e.currentTarget.close();
  };

  return (
    <>
      <div className="olp">
        <a className="skip" href="#main">
          Skip to content
        </a>

        {offerActive ? (
          <button
            type="button"
            className="top-offer"
            onClick={() => openClaim(undefined, "top_bar")}
          >
            <span className="top-offer-tag">{urgency}</span>
            <span>
              Up to <strong>50% off</strong> custom tattoos
              <span className="top-offer-extra"> · {OFFER.validLabel}</span>
            </span>
            <span className="top-offer-cta">Claim now →</span>
          </button>
        ) : (
          <p className="top-offer top-offer-ended" role="status">
            Offer ended — book a free consultation. (It ran until {OFFER.endsLabel}.)
          </p>
        )}

        <header className="site-header">
          <div className="wrap header-inner">
            <Brand />
            <nav className="nav" aria-label="On this page">
              <a href="#offers">Offers</a>
              <a href="#work">Our work</a>
              <a href="#reviews">Reviews</a>
              <a href="#studio">Visit us</a>
              <a href={PHONE_TEL} data-track="click_call" data-location="offer_header">
                Call {PHONE_DISPLAY}
              </a>
              <ClaimButton onOpen={openClaim} placement="header">
                Claim offer
              </ClaimButton>
            </nav>
          </div>
        </header>

        <main id="main">
          <div className="wrap pt-3">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tattoo Offer" }]} />
          </div>
          {/* Hero */}
          <section className="wrap hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <span className="eyebrow">Tattoo offer · Brookefield, Bangalore</span>
              <h1 id="hero-title">
                <span className="h1-line">Tattoo Offer in Brookefield, Bangalore:</span>{" "}
                <span className="h1-accent">Up to 50% Off</span>
              </h1>
              <p className="intro">
                A tattoo on your skin is your bold story — crafted with precision, hygiene and care
                at Xing Premium Tattoo Studio.
              </p>
              {/* Desktop only: pick an offer straight from the hero (hidden on phones) */}
              <div className="hero-picks" role="group" aria-label="Choose your offer">
                {HERO_PICKS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`hero-pick${p.popular ? " popular" : ""}`}
                    onClick={() => openClaim(p.id, `hero_pick_${p.id}`)}
                  >
                    {p.popular && <span className="hero-pick-tag">Most popular</span>}
                    <strong>{p.value}</strong>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
              <div className="hero-actions">
                <ClaimButton onOpen={openClaim} offer="10-sq-inch" placement="hero" />
                <a className="text-link" href="#offers">
                  See all 4 offers <span aria-hidden="true">↓</span>
                </a>
              </div>
              <ul className="hero-assure">
                <li>Free consultation</li>
                <li>No advance to claim</li>
                <li>Exact quote at your free consultation</li>
              </ul>
              <ul className="hero-proof" aria-label="Why clients trust Xing">
                <li>
                  <Stars /> <strong>{GOOGLE_RATING}</strong> Google rating
                </li>
                <li>
                  <strong>{ARTIST.tattoosCompleted}</strong> tattoos
                </li>
                <li>
                  <strong>{ARTIST.yearsExperience}</strong> yrs experience
                </li>
              </ul>
            </div>
            <div className="hero-visual">
              <img
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                width={800}
                height={1000}
                fetchPriority="high"
              />
              <div className="hero-badge" aria-hidden="true">
                <span>Up to</span>
                <strong>50%</strong>
                <span>off</span>
              </div>
              <div className="hero-card">
                <span>{OFFER.validLabel}</span>
                <strong>Free consultation</strong>
                <em>{urgency}</em>
              </div>
            </div>
          </section>

          {/* Offers */}
          <section className="section offers-section" id="offers" aria-labelledby="offers-title">
            <div className="wrap">
              <div className="section-heading center">
                <span className="eyebrow">Limited-time tattoo offers in Brookefield</span>
                <h2 id="offers-title">
                  Premium ink. <em>Smaller price.</em>
                </h2>
                <p>
                  Same artist, same sterile care, same imported ink — just a better price. Pick your
                  offer and we confirm the final quote before you book.
                </p>
              </div>
              <div className="offers">
                {OFFERS.map((o) => (
                  <article
                    key={o.id}
                    className={`offer-card${o.featured ? " featured" : ""}`}
                    aria-labelledby={`offer-${o.id}`}
                  >
                    <button
                      type="button"
                      className="offer-photo"
                      onClick={() => openClaim(o.id, `photo_${o.id}`)}
                      aria-label={`Claim: ${o.name}`}
                    >
                      <img src={o.img} alt={o.alt} width={1120} height={1400} loading="lazy" />
                      <span className="offer-badge" aria-hidden="true">
                        {o.badge}
                      </span>
                      <span className="offer-overlay" aria-hidden="true">
                        <span className="offer-kicker">{o.kicker}</span>
                        <span className="offer-price">
                          {o.pricePrefix && <small>{o.pricePrefix} </small>}
                          {o.price}
                        </span>
                      </span>
                    </button>
                    <div className="offer-body">
                      <h3 id={`offer-${o.id}`}>{o.title}</h3>
                      <p>{o.text}</p>
                      <ClaimButton
                        onOpen={openClaim}
                        offer={o.id}
                        placement={`card_${o.id}`}
                        className={`btn${o.featured ? " gold" : " outline"}`}
                      >
                        Claim offer <span aria-hidden="true">→</span>
                      </ClaimButton>
                    </div>
                  </article>
                ))}
              </div>
              <p className="price-note">
                {OFFER.validLabel}. Exact quote at your free consultation — final price and
                eligibility are confirmed after reviewing your design, size and placement.
              </p>
            </div>
          </section>

          {/* Why Xing */}
          <section className="why-section" aria-labelledby="why-title">
            <div className="wrap">
              <div className="section-heading center">
                <span className="eyebrow">Tattoo studio in Brookefield you can trust</span>
                <h2 id="why-title">
                  Why choose <em>Xing?</em>
                </h2>
              </div>
              <ul className="why-grid">
                {WHY_XING.map((w) => (
                  <li key={w.label}>
                    <svg
                      className="why-icon"
                      viewBox="0 0 32 32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {w.icon}
                    </svg>
                    <strong className="why-value">{w.value}</strong>
                    <h3>{w.label}</h3>
                    <p>{w.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Our work */}
          <section className="section wrap" id="work" aria-labelledby="work-title">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Real tattoos from our studio</span>
                <h2 id="work-title">
                  Less explaining.
                  <br />
                  More <em>showing.</em>
                </h2>
              </div>
              <p>Every piece below was inked by Peace at Xing, Brookefield.</p>
            </div>
            <div className="work-grid">
              {WORK.map((img) => (
                <figure key={img.src}>
                  <img src={img.src} alt={img.alt} width={1120} height={1400} loading="lazy" />
                </figure>
              ))}
            </div>
            <div className="work-cta">
              <p>Love a style? Your version could be next.</p>
              <ClaimButton onOpen={openClaim} placement="work" />
            </div>
          </section>

          {/* Artist */}
          <section className="artist-section section" id="artist" aria-labelledby="artist-title">
            <div className="wrap artist-grid">
              <div className="artist-photo">
                <img
                  src={artistPortrait}
                  alt="Peace (Chingri Awungshi), lead tattoo artist at Xing Premium Tattoo Studio, Brookefield, Bengaluru"
                  width={1200}
                  height={1350}
                  loading="lazy"
                />
                <div className="artist-tag">
                  <strong>{ARTIST.name}</strong>
                  {ARTIST.role} at Xing
                </div>
              </div>
              <div className="artist-copy">
                <span className="eyebrow">The artist behind the ink</span>
                <h2 id="artist-title">
                  Meet <em>{ARTIST.name}.</em>
                </h2>
                <p className="artist-role">
                  {ARTIST.fullName} — {ARTIST.role} at Xing Premium Tattoo Studio
                </p>
                <p>
                  With {ARTIST.yearsExperience} years behind the machine and{" "}
                  {ARTIST.tattoosCompleted} tattoos completed, Peace is the one hand behind every
                  piece at Xing Premium Tattoo Studio in AECS Layout, Brookefield. Clients come from
                  Whitefield, Marathahalli and across Bengaluru for custom realism, portraits,
                  fine-line work and Indian traditional designs — each one drawn from scratch and
                  inked in a studio run to clinic-level hygiene.
                </p>
                <ul className="artist-facts">
                  {ARTIST_FACTS.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Path to ink */}
          <section className="section wrap path-section" aria-labelledby="path-title">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Path to ink</span>
                <h2 id="path-title">
                  Your story. <em>Our care.</em>
                </h2>
              </div>
              <p>Four stages. Nothing rushed, nothing skipped.</p>
            </div>
            <ol className="stages">
              {STAGES.map((s, i) => (
                <li key={s.title}>
                  <span className="stage-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {s.guide && (
                    <details className="guide">
                      <summary>
                        {s.guide.label} <span aria-hidden="true">→</span>
                      </summary>
                      <ul>
                        {s.guide.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* First tattoo */}
          <section className="first-section" aria-labelledby="first-title">
            <div className="wrap first-grid">
              <div>
                <span className="eyebrow">Nervous? That’s normal</span>
                <h2 id="first-title">
                  First tattoo?
                  <br />
                  <em>Welcome here.</em>
                </h2>
                <p>
                  Most of our clients walk in for their very first tattoo. You don’t need every
                  detail figured out — just the idea. We handle the rest, gently.
                </p>
                <figure className="first-quote">
                  <blockquote>
                    “Got my first tattoo here and I was a bit nervous, but the artist made the whole
                    process smooth and comfortable.”
                  </blockquote>
                  <figcaption>
                    <Stars /> J P Rai · Google review
                  </figcaption>
                </figure>
              </div>
              <div>
                <ul className="first-points">
                  {FIRST_TATTOO_POINTS.map((p) => (
                    <li key={p.title}>
                      <span className="check" aria-hidden="true">
                        ✓
                      </span>
                      <div>
                        <strong>{p.title}</strong>
                        <p>{p.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <ClaimButton
                  onOpen={openClaim}
                  offer="small"
                  placement="first_tattoo"
                  className="btn gold"
                >
                  Claim my first tattoo offer
                </ClaimButton>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="reviews-section section" id="reviews" aria-labelledby="reviews-title">
            <div className="wrap">
              <div className="reviews-head">
                <div>
                  <span className="eyebrow">Real clients. Real ink.</span>
                  <h2 id="reviews-title">
                    Voice of <em>trust.</em>
                  </h2>
                </div>
                <div className="rating-box">
                  <strong>{GOOGLE_RATING}</strong>
                  <div>
                    <Stars />
                    <span>Google rating · {ARTIST.happyClients} happy clients</span>
                  </div>
                </div>
              </div>
              {/* Auto-sliding row: the browser adds a second copy so the loop is seamless */}
              <div className="reviews">
                <div className="reviews-track">
                  {(reviewLoop ? [...REVIEWS, ...REVIEWS] : REVIEWS).map((r, i) => (
                    <figure
                      key={`${r.name}-${i}`}
                      className="review"
                      aria-hidden={i >= REVIEWS.length || undefined}
                      inert={i >= REVIEWS.length || undefined}
                    >
                      <div className="review-top">
                        <Stars n={r.rating} />
                        <span className="review-tag">{r.highlight}</span>
                      </div>
                      <blockquote>“{r.quote}”</blockquote>
                      <figcaption>
                        <span className="avatar" aria-hidden="true">
                          {r.name.charAt(0)}
                        </span>
                        <span>
                          <strong>{r.name}</strong>
                          Google review
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <div className="reviews-cta">
                <ClaimButton onOpen={openClaim} placement="reviews" />
                <T
                  className="text-link"
                  href={GOOGLE_REVIEWS_URL}
                  track="click_reviews"
                  placement="reviews"
                >
                  Read all reviews on Google <span aria-hidden="true">↗</span>
                </T>
              </div>
            </div>
          </section>

          {/* Design your tattoos */}
          <section className="quote-section" id="ideas" aria-labelledby="ideas-title">
            <div className="wrap quote-grid">
              <div>
                <span className="eyebrow">Your next chapter starts here</span>
                <h2 id="ideas-title">
                  Design your
                  <br />
                  <i>tattoos.</i>
                </h2>
                <p>
                  A word, a sketch, a screenshot — tell us a little and we’ll take it from there. No
                  finished design needed. No pressure to book.
                </p>
                <p className="contact-note">
                  Prefer a call?{" "}
                  <T href={PHONE_TEL} track="click_call" placement="ideas">
                    {PHONE_DISPLAY}
                  </T>
                </p>
              </div>
              <form className="quote-form" onSubmit={onQuote}>
                <div className="form-row">
                  <div>
                    <label htmlFor="tattoo-type">I’m thinking of</label>
                    <select id="tattoo-type" value={type} onChange={(e) => setType(e.target.value)}>
                      <option>A new tattoo</option>
                      <option>A cover-up</option>
                      <option>An extension</option>
                      <option>A touch-up</option>
                      <option>I’d like some guidance</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tattoo-size">Rough size</label>
                    <select id="tattoo-size" value={size} onChange={(e) => setSize(e.target.value)}>
                      <option>Not sure yet</option>
                      <option>Small / minimal</option>
                      <option>Up to 10 square inches</option>
                      <option>Medium / detailed</option>
                      <option>Large / sleeve</option>
                    </select>
                  </div>
                </div>
                <label htmlFor="tattoo-idea">
                  Your idea <span>(optional)</span>
                </label>
                <textarea
                  id="tattoo-idea"
                  maxLength={600}
                  placeholder="A name, a symbol, a story…"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                />
                <button type="submit" className="btn">
                  <WhatsAppIcon /> Send my idea on WhatsApp
                </button>
                <p className="micro">
                  Opens WhatsApp with your idea ready to send — attach your reference photos there.
                </p>
              </form>
            </div>
          </section>

          {/* Location */}
          <section className="wrap location" id="studio" aria-labelledby="studio-title">
            <div className="location-copy">
              <span className="eyebrow">Come find your ink</span>
              <h2 id="studio-title">
                In the heart of <em>Brookefield.</em>
              </h2>
              <address>
                <strong>{BUSINESS_NAME}</strong>
                {ADDRESS.full}
              </address>
              <dl className="location-info">
                <div>
                  <dt>Studio hours</dt>
                  <dd>{HOURS_TEXT}</dd>
                </div>
                <div>
                  <dt>Call or WhatsApp</dt>
                  <dd>
                    <T href={PHONE_TEL} track="click_call" placement="location">
                      {PHONE_DISPLAY}
                    </T>
                  </dd>
                </div>
                <div>
                  <dt>Serving</dt>
                  <dd>{SERVICE_AREAS.join(" · ")}</dd>
                </div>
              </dl>
              <div className="location-actions">
                <ClaimButton onOpen={openClaim} placement="location" />
                <T
                  className="btn outline"
                  href={DIRECTIONS_URL}
                  track="click_directions"
                  placement="location"
                >
                  Get Directions
                </T>
              </div>
            </div>
            <div className="map">
              <iframe
                src={MAP_EMBED_URL}
                title={`Map: ${BUSINESS_NAME}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="wrap footer-inner">
            <p>Made personal. Made permanent.</p>
            <button type="button" onClick={() => privacyRef.current?.showModal()}>
              Privacy &amp; enquiries
            </button>
          </div>
        </footer>

        <div className="mobile-cta" aria-label="Claim your tattoo offer">
          <ClaimButton onOpen={openClaim} placement="mobile_sticky" className="btn gold" />
          <T
            className="btn outline icon-only"
            href={wa("Hi Xing! I'd like to know more about the tattoo offer.")}
            track="click_whatsapp"
            placement="mobile_sticky"
            label={`WhatsApp ${BRAND_NAME}`}
          >
            <WhatsAppIcon />
          </T>
          <T
            className="btn outline icon-only call"
            href={PHONE_TEL}
            track="click_call"
            placement="mobile_sticky"
            label={`Call ${BRAND_NAME}`}
          >
            <PhoneIcon />
          </T>
        </div>

        {/* Claim popup */}
        <dialog
          className="claim-dialog"
          ref={claimRef}
          aria-labelledby="claim-title"
          onClick={closeOnBackdrop}
        >
          <form method="dialog" className="dialog-close">
            <button aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </form>
          {claimStatus === "sent" || claimStatus === "whatsapp" ? (
            <div className="claim-done">
              <span className="claim-tick" aria-hidden="true">
                ✓
              </span>
              <h2 id="claim-title">
                {claimStatus === "sent" ? "Offer claimed!" : "One last step"}
              </h2>
              <p>
                {claimStatus === "sent"
                  ? `Thanks, ${claimName.trim().split(" ")[0]}! The studio will call you shortly to lock in “${chosenOffer.name}”. Want it faster? Send it on WhatsApp too.`
                  : `Thanks, ${claimName.trim().split(" ")[0]}! Send your claim on WhatsApp to lock in “${chosenOffer.name}” — the studio replies within the day.`}
              </p>
              <T
                className="btn whatsapp"
                href={claimWhatsApp}
                track="click_whatsapp"
                placement="claim_done"
              >
                <WhatsAppIcon /> Send on WhatsApp
              </T>
            </div>
          ) : (
            <form className="claim-form" onSubmit={onClaim} noValidate>
              <span className="eyebrow">{urgency}</span>
              <h2 id="claim-title">Claim your tattoo offer</h2>
              <p className="claim-sub">Takes 20 seconds. We call you back with your price.</p>

              <fieldset>
                <legend>Choose your offer</legend>
                <div className="claim-offers">
                  {OFFERS.map((o) => (
                    <label key={o.id} className={claimOffer === o.id ? "active" : undefined}>
                      <input
                        type="radio"
                        name="offer"
                        value={o.id}
                        checked={claimOffer === o.id}
                        onChange={() => setClaimOffer(o.id)}
                      />
                      <strong>{[o.pricePrefix, o.price].filter(Boolean).join(" ")}</strong>
                      <span>{o.kicker}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="claim-name">Your name</label>
              <input
                id="claim-name"
                autoComplete="name"
                value={claimName}
                onChange={(e) => setClaimName(e.target.value)}
                aria-invalid={!!claimErrors.name}
                aria-describedby={claimErrors.name ? "claim-name-err" : undefined}
              />
              {claimErrors.name && (
                <p className="field-error" id="claim-name-err">
                  {claimErrors.name}
                </p>
              )}

              <label htmlFor="claim-phone">Phone / WhatsApp</label>
              <input
                id="claim-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91"
                value={claimPhone}
                onChange={(e) => setClaimPhone(e.target.value)}
                aria-invalid={!!claimErrors.phone}
                aria-describedby={claimErrors.phone ? "claim-phone-err" : undefined}
              />
              {claimErrors.phone && (
                <p className="field-error" id="claim-phone-err">
                  {claimErrors.phone}
                </p>
              )}

              <label htmlFor="claim-idea">
                Your tattoo idea <span>(optional)</span>
              </label>
              <textarea
                id="claim-idea"
                maxLength={600}
                placeholder="e.g. small name tattoo on wrist"
                value={claimIdea}
                onChange={(e) => setClaimIdea(e.target.value)}
              />

              {/* Honeypot — hidden from people, tempting to bots */}
              <input
                className="hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                name="company"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />

              <button type="submit" className="btn gold" disabled={claimStatus === "sending"}>
                {claimStatus === "sending" ? "Claiming…" : "Claim my offer →"}
              </button>
              <p className="micro">
                Free consultation · No advance to claim · 18+ only.{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => privacyRef.current?.showModal()}
                >
                  Privacy
                </button>
              </p>
            </form>
          )}
        </dialog>

        <dialog className="privacy-dialog" ref={privacyRef} onClick={closeOnBackdrop}>
          <h2>Privacy &amp; enquiries</h2>
          <p>
            When you claim an offer, your name, phone number, chosen offer and idea are emailed to
            Xing Premium Tattoo Studio so we can call you back with a quote. They are used only for
            your enquiry and never sold or shared.
          </p>
          <p>
            The “Design your tattoos” form only prepares a WhatsApp message — you decide whether to
            send it. WhatsApp and Google Maps apply their own privacy policies when you use them.
          </p>
          <p>
            For questions about your enquiry, contact Xing Premium Tattoo Studio at{" "}
            <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>.
          </p>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </dialog>
      </div>
      {offerActive && <FaqAccordion items={offerFaqs} id="offer-faq" />}
      <SiteFooter />
    </>
  );
}
