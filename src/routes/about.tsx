import { FaqSection } from "@/components/faq/FaqSection";
import { QuickAnswer } from "@/components/faq/QuickAnswer";
import { aboutQuickAnswer } from "@/data/page-copy";
import { BookCTA, DirectionsCTA, WhatsAppCTA } from "@/components/cta";
import { AttributeChips, LazyMap } from "@/components/layout/StudioBits";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";

import artistPortrait from "@/assets/artist/peace-tattoo-artist-xing-brookefield.webp";
import {
  ADDRESS,
  BUSINESS_NAME,
  HOURS_TEXT,
  pageTitle,
  SHORT_ADDRESS,
} from "@/data/business";
import { aboutFaqs, aboutValues, hygieneStandards, visitLandmarks } from "@/data/about";
import { ARTIST, tattoosForClients } from "@/data/artist";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { AccordionFold, CreaseLines, FoldCard, SectionNav } from "@/components/sections/Origami";
import { faqNode, seoHead } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/blog";

const TITLE = pageTitle("About Us: Tattoo Studio in AECS Layout");
const DESCRIPTION =
  "Our custom tattoo studio above DMART Ready, AECS Layout, Brookefield: hygiene, process, hours and directions. Serving Whitefield and Marathahalli.";

export const Route = createFileRoute("/about")({
  head: () =>
    seoHead({
      path: "/about",
      title: TITLE,
      description: DESCRIPTION,
      pageType: "AboutPage",
      graph: [
        faqNode(aboutFaqs),
        breadcrumbSchema([{ label: "Home", href: "/" }, { label: "About Us" }]),
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
            About Xing Premium Tattoo Studio,{" "}
            <span className="block text-amber-700">Brookefield, Bangalore</span>
          </h1>
          <p className="mx-auto mt-5 max-w-sm font-script text-2xl text-amber-700">
            We make forever look easy.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-6 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p className="font-display text-xl leading-snug font-medium text-foreground">
              A tattoo is one of the few things you'll keep for life. We built Xing around that
              fact.
            </p>
            <p>
              Xing opened in {ARTIST.studioSince} on the 1st floor of SV Plaza, 60 Feet Road — right
              above DMART Ready in AECS Layout, Brookefield. The idea was simple: a custom tattoo
              studio for East Bengaluru where every design is drawn from scratch, every session is
              unhurried, and hygiene is treated like a clinic, not an afterthought.
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
              Every tattoo at Xing is designed and inked by one artist —{" "}
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
              <BookCTA location="about_story" />
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
              <span
                aria-hidden="true"
                data-n={String(i + 1).padStart(2, "0")}
                className="font-display text-3xl font-bold text-amber-700/25 before:content-[attr(data-n)]"
              />
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
            alt="Peace (Chingri Awungshi), lead tattoo artist at Xing Premium Tattoo Studio, Brookefield"
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
              experience and {ARTIST.tattoosCompleted} tattoos to every session at Xing. See the
              styles, signature work and client reviews on the full artist profile.
            </p>
            <Link
              to="/tattoo-artist"
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-primary px-6 py-3.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
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
              {BUSINESS_NAME}
            </h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <dt className="mt-0.5 shrink-0">
                  <MapPin className="h-4 w-4 text-amber-700" aria-hidden="true" />
                  <span className="sr-only">Address</span>
                </dt>
                <dd>
                  <address className="not-italic">{ADDRESS.full}</address>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="mt-0.5 shrink-0">
                  <Clock className="h-4 w-4 text-amber-700" aria-hidden="true" />
                  <span className="sr-only">Hours</span>
                </dt>
                <dd>{HOURS_TEXT}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="mt-0.5 shrink-0">
                  <Phone className="h-4 w-4 text-amber-700" aria-hidden="true" />
                  <span className="sr-only">Phone</span>
                </dt>
                <dd>
                  <a
                    href={PHONE_TEL}
                    data-track="click_call"
                    data-location="about_visit"
                    className="inline-flex min-h-11 items-center hover:text-amber-700"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </dd>
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
            <p className="eyebrow mt-6">At The Studio</p>
            <AttributeChips className="mt-3" />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <DirectionsCTA location="about_visit" variant="primary" className="px-3" />
              <WhatsAppCTA location="about_visit" className="px-3" />
            </div>
          </FoldCard>
          <LazyMap className="min-h-[320px] h-full" />
        </div>
      </section>

      <QuickAnswer data={aboutQuickAnswer}>
        <DirectionsCTA location="about_quick_answer" variant="primary" />
      </QuickAnswer>

      <FaqSection items={aboutFaqs} />

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="relative overflow-hidden bg-primary px-8 py-10 text-primary-foreground [clip-path:polygon(0_0,calc(100%-40px)_0,100%_40px,100%_100%,0_100%)]">
          <CreaseLines className="text-amber-200/10" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-amber-500">{SHORT_ADDRESS}</p>
              <p className="mt-2 font-display text-[1.35rem] leading-tight font-semibold tracking-wide text-balance uppercase sm:text-3xl">
                Wear Your Story. Properly.
              </p>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Free consultation. Custom design. No pressure — just good ink.
              </p>
            </div>
            <BookCTA location="about_end" className="bg-amber-700 text-white" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
