import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";

import artistPortrait from "@/assets/artist/peace-tattoo-artist-xing-brookefield.webp";
import { aboutFaqs, aboutValues, hygieneStandards, visitLandmarks } from "@/data/about";
import { ARTIST, tattoosForClients } from "@/data/artist";
import { GOOGLE_REVIEWS_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/data/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { openBookingModal } from "@/components/booking/BookingContext";
import { AccordionFold, CreaseLines, FoldCard, SectionNav } from "@/components/sections/Origami";

const TITLE = "About XING Tattoo Studio | Custom Tattoo Studio in Brookefield, Bengaluru";
const DESCRIPTION =
  "The story of XING Tattoo Studio, AECS Layout, Brookefield — custom tattoos by Peace since 2021, clinic-level hygiene, 4.9★ on Google. Hours, map & FAQs.";
const MAP_EMBED =
  "https://www.google.com/maps?q=XING+Tattoo+Studio+SV+Plaza+AECS+Layout+Brookefield+Bengaluru&output=embed";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: TITLE,
          description: DESCRIPTION,
          about: { "@id": "#studio" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: aboutFaqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: AboutPage,
});

const SECTIONS = [
  { id: "story", label: "Our Story" },
  { id: "values", label: "Values" },
  { id: "hygiene", label: "Hygiene" },
  { id: "artist", label: "The Artist" },
  { id: "visit", label: "Visit Us" },
  { id: "faq", label: "FAQ" },
];

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
      <span
        className="mx-auto mt-3 block h-3 w-6 bg-gradient-to-r from-amber-300 to-amber-600 [clip-path:polygon(0_0,50%_100%,100%_0)]"
        aria-hidden="true"
      />
    </div>
  );
}

function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />
      <SectionNav sections={SECTIONS} />

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
          <span className="text-foreground">About Us</span>
        </nav>
      </div>

      {/* Hero + story */}
      <section
        id="story"
        aria-labelledby="about-title"
        className="relative scroll-mt-36 overflow-hidden"
      >
        <CreaseLines />
        <div className="relative mx-auto max-w-4xl px-5 py-12 text-center lg:py-16">
          <p className="eyebrow">About Us · Since {ARTIST.studioSince}</p>
          <h1
            id="about-title"
            className="mt-4 font-display text-[2rem] leading-[1.05] font-medium tracking-tight text-balance sm:text-5xl"
          >
            About XING Tattoo Studio,{" "}
            <span className="block text-amber-700">Brookefield, Bengaluru</span>
          </h1>
          <p className="mx-auto mt-5 max-w-sm font-script text-2xl text-amber-700">
            We make forever look easy.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-6 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p className="font-display text-xl leading-snug font-medium text-foreground">
              A tattoo is one of the few things you'll keep for life. We built XING around that
              fact.
            </p>
            <p>
              XING Tattoo Studio opened in {ARTIST.studioSince} on the 1st floor of SV Plaza, 60
              Feet Road — right above D-Mart in AECS Layout, Brookefield. The idea was simple: a
              custom tattoo studio for East Bengaluru where every design is drawn from scratch,
              every session is unhurried, and hygiene is treated like a clinic, not an afterthought.
            </p>
            <p>
              Since then, {ARTIST.happyClients} clients from Brookefield, Whitefield, Marathahalli,
              ITPL and beyond have trusted us with first tattoos, names and dates, memorial
              portraits, deity pieces, cover-ups and full sleeves — {ARTIST.tattoosCompleted}{" "}
              tattoos and a {ARTIST.googleRating}★ Google rating later, the idea hasn't changed.
            </p>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Every tattoo at XING is designed and inked by one artist —{" "}
              <Link
                to="/tattoo-artist"
                className="font-semibold text-foreground underline decoration-amber-700/40 underline-offset-4 hover:decoration-amber-700"
              >
                Peace ({ARTIST.fullName})
              </Link>
              , with {ARTIST.yearsExperience} years of experience across realism, portraits, black
              &amp; grey, fine-line, geometric and Indian traditional work. That means the person
              you consult with is the person who draws your design and the person who tattoos it.
            </p>
            <p>
              We'd rather do fewer tattoos properly than rush more of them. It's why consultations
              are free and unhurried, why we'll give you honest advice on size and placement, and
              why a free touch-up is part of the deal if anything heals unevenly.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-3 rounded-sm bg-primary px-6 py-3.5 font-display text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pt-8 pb-4">
          <AccordionFold
            items={[
              { value: ARTIST.studioSince, label: "Studio opened" },
              tattoosForClients,
              { value: `${ARTIST.googleRating}★`, label: "Google rating" },
            ]}
          />
        </div>
      </section>

      {/* Values */}
      <section
        id="values"
        aria-labelledby="values-title"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <SectionTitle eyebrow="What We Stand For" title="Our Values" id="values-title" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aboutValues.map(({ title, text }, i) => (
            <FoldCard key={title} as="li" className="h-full">
              <span className="font-display text-3xl font-bold text-amber-700/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-sm font-semibold tracking-[0.08em] uppercase">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </FoldCard>
          ))}
        </ul>
      </section>

      {/* Hygiene */}
      <section
        id="hygiene"
        aria-labelledby="hygiene-title"
        className="scroll-mt-36 bg-primary text-primary-foreground"
      >
        <div className="relative mx-auto max-w-7xl overflow-hidden px-5 py-14">
          <CreaseLines className="text-amber-200/10" />
          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow text-amber-500">Safety First</p>
              <h2
                id="hygiene-title"
                className="mt-2 font-display text-[1.35rem] leading-tight font-semibold tracking-wide text-balance uppercase sm:text-3xl"
              >
                Hygiene & Safety Standards
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/75">
                A tattoo is a procedure that breaks the skin, so we run the studio like one. These
                standards apply to every client, every session — no exceptions.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {hygieneStandards.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 bg-white/[0.04] p-4 text-sm [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%)]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Artist teaser */}
      <section
        id="artist"
        aria-labelledby="about-artist-title"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <img
            src={artistPortrait}
            alt="Peace (Chingri Awungshi), lead tattoo artist at XING Tattoo Studio, Brookefield"
            width={1200}
            height={1350}
            loading="lazy"
            className="mx-auto w-full max-w-sm mix-blend-multiply"
          />
          <div>
            <p className="eyebrow">The Artist</p>
            <h2
              id="about-artist-title"
              className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl"
            >
              Meet Peace — the one hand behind every piece
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              {ARTIST.fullName}, known to clients as Peace, brings {ARTIST.yearsExperience} years of
              experience and {ARTIST.tattoosCompleted} tattoos to every session at XING. See the
              styles, signature work and client reviews on the full artist profile.
            </p>
            <Link
              to="/tattoo-artist"
              className="mt-6 inline-flex items-center gap-3 rounded-sm border border-primary px-6 py-3.5 font-display text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
            >
              View Artist Profile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Visit us */}
      <section
        id="visit"
        aria-labelledby="visit-title"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <SectionTitle eyebrow="Find Us" title="Visit The Studio" id="visit-title" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <FoldCard className="h-full">
            <h3 className="font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase">
              XING Tattoo Studio
            </h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd>
                    <address className="not-italic">
                      1st Floor, SV Plaza, 267, 60 Feet Rd, AECS Layout A Block, Brookefield,
                      Bengaluru, Karnataka 560037
                    </address>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <div>
                  <dt className="sr-only">Hours</dt>
                  <dd>
                    Wednesday – Monday: 10:00 AM – 9:00 PM
                    <br />
                    <span className="text-muted-foreground">Tuesday: closed</span>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a
                      href={PHONE_TEL}
                      className="inline-flex min-h-11 items-center hover:text-amber-700"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
            <p className="eyebrow mt-6">Landmarks</p>
            <ul className="mt-3 space-y-2">
              {visitLandmarks.map((l) => (
                <li key={l} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-amber-600" />
                  {l}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 font-display text-[0.7rem] font-semibold tracking-[0.12em] text-primary-foreground uppercase hover:opacity-90"
              >
                <Navigation className="h-3.5 w-3.5" /> Directions
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-primary px-4 py-3 font-display text-[0.7rem] font-semibold tracking-[0.12em] uppercase hover:bg-accent"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            </div>
          </FoldCard>
          <div className="relative min-h-[320px] overflow-hidden border border-border [clip-path:polygon(0_0,100%_0,100%_calc(100%-32px),calc(100%-32px)_100%,0_100%)]">
            <iframe
              title="Map showing XING Tattoo Studio, AECS Layout, Brookefield, Bengaluru"
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale-[40%]"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        aria-labelledby="about-faq-title"
        className="mx-auto max-w-7xl scroll-mt-36 px-5 py-14"
      >
        <SectionTitle eyebrow="Good To Know" title="Studio FAQs" id="about-faq-title" />
        <div className="mx-auto mt-8 max-w-2xl">
          <Accordion type="single" collapsible>
            {aboutFaqs.map((faq, i) => (
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

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="relative overflow-hidden bg-primary px-8 py-10 text-primary-foreground [clip-path:polygon(0_0,calc(100%-40px)_0,100%_40px,100%_100%,0_100%)]">
          <CreaseLines className="text-amber-200/10" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-amber-500">AECS Layout, Brookefield · Above D-Mart</p>
              <p className="mt-2 font-display text-[1.35rem] leading-tight font-semibold tracking-wide text-balance uppercase sm:text-3xl">
                Wear Your Story. Properly.
              </p>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Free consultation. Custom design. No pressure — just good ink.
              </p>
            </div>
            <button
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-3 rounded-sm bg-amber-600 px-6 py-3.5 font-display text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Free Consultation <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
