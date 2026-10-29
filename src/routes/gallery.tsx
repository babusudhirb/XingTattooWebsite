import { useState } from "react";
import { preload } from "react-dom";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { BRAND_NAME, LEAD_ARTIST, pageTitle } from "@/data/business";
import { SERVICE_SLUGS, services } from "@/data/services";
import {
  GALLERY_SIZES,
  gallerySrcSet,
  STUDIO_TAG,
  studioGallery,
  styleGallery,
  type GalleryItem,
} from "@/data/gallery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BookingCta, WhatsAppCta } from "@/components/cta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SocialDock } from "@/components/layout/SocialDock";
import { LazyGalleryLightbox } from "@/components/gallery/LazyGalleryLightbox";
import { breadcrumbSchema, type Crumb } from "@/lib/blog";
import { absolute, seoHead } from "@/lib/seoHead";

/** Photos per style in the server HTML; "Show all" adds the rest. */
const STYLE_PREVIEW = 4;
/** Studio portfolio photos in the server HTML, and per "Load more". */
const PORTFOLIO_PAGE = 12;

const CRUMBS: Crumb[] = [{ label: "Home", href: "/" }, { label: "Tattoo Gallery" }];
const H1 = "Tattoo Gallery — Real Work from Brookefield, Bangalore";

const sections = SERVICE_SLUGS.map((slug) => ({
  slug,
  name: services[slug].name,
  shortName: services[slug].shortName,
  tagline: services[slug].tagline,
  items: styleGallery(slug),
}));
/** Everything in the server HTML, in page order — the ImageGallery schema lists exactly these. */
const serverImages = [
  ...sections.flatMap((s) => s.items.slice(0, STYLE_PREVIEW)),
  ...studioGallery.slice(0, PORTFOLIO_PAGE),
];

export const Route = createFileRoute("/gallery")({
  head: () =>
    seoHead({
      path: "/gallery",
      title: pageTitle("Tattoo Gallery: Real Work, Brookefield"),
      description: `Real tattoos by ${LEAD_ARTIST.name} at ${BRAND_NAME}, Brookefield, Bangalore: realism, portrait, Black & Grey, geometric, Indian traditional and fine-line.`,
      pageType: "ImageGallery",
      page: {
        associatedMedia: serverImages.map((g) => ({
          "@type": "ImageObject",
          contentUrl: absolute(g.img),
          caption: g.alt,
        })),
      },
      graph: [breadcrumbSchema(CRUMBS)],
    }),
  component: GalleryPage,
});

/** `priority`: the first photos on the page — fetched at once, not lazily (they're the LCP). */
function Photo({
  item,
  onOpen,
  priority = false,
}: {
  item: GalleryItem;
  onOpen: () => void;
  priority?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View larger: ${item.alt}`}
        className="group block w-full overflow-hidden rounded-sm bg-muted focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
      >
        <img
          src={item.img}
          srcSet={gallerySrcSet(item.img)}
          sizes={GALLERY_SIZES}
          alt={item.alt}
          width={800}
          height={1000}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="aspect-[4/5] w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </button>
    </li>
  );
}

function GalleryPage() {
  // The first photo is the LCP: hint it at the top of <head>
  const first = sections[0]!.items[0]!;
  preload(first.img, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: gallerySrcSet(first.img),
    imageSizes: GALLERY_SIZES,
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [portfolioCount, setPortfolioCount] = useState(PORTFOLIO_PAGE);
  const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; index: number } | null>(null);

  const portfolio = studioGallery.slice(0, portfolioCount);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-5 pt-5">
        <Breadcrumbs items={CRUMBS} />
      </div>
      <section className="mx-auto max-w-3xl px-5 pt-6 pb-8 text-center sm:pt-8 sm:pb-10">
        <p className="eyebrow">Our Work · No Stock Photos</p>
        <h1 className="mt-3 font-display text-h1 font-semibold tracking-tight text-balance">
          {H1}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Tattoos {LEAD_ARTIST.name} designed and inked at our AECS Layout studio. Pick a style, or
          tap a photo to see it up close.
        </p>
      </section>

      {/* Style chips: real links to the sections below, one swipeable line on phones */}
      <nav aria-label="Tattoo styles" className="mx-auto max-w-7xl px-5">
        <ul className="bleed-to-sm flex snap-x gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {[
            ...sections.map((s) => ({ id: s.slug, label: s.shortName })),
            { id: "portfolio", label: "Studio Portfolio" },
          ].map(({ id, label }) => (
            <li key={id} className="shrink-0 snap-start">
              <a
                href={`#${id}`}
                className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm whitespace-nowrap transition-colors hover:border-amber-700 hover:text-foreground"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {sections.map((s) => {
        const shown = expanded[s.slug] ? s.items : s.items.slice(0, STYLE_PREVIEW);
        return (
          <section
            key={s.slug}
            id={s.slug}
            aria-labelledby={`${s.slug}-title`}
            className="mx-auto max-w-7xl scroll-mt-28 border-b border-border px-5 py-section"
          >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2
                  id={`${s.slug}-title`}
                  className="font-display text-h2 font-semibold tracking-tight"
                >
                  {s.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
              </div>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="inline-flex min-h-11 items-center gap-2 font-display text-xs font-bold tracking-[0.12em] text-amber-800 uppercase hover:underline"
              >
                About {s.shortName} tattoos{" "}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {shown.map((item, i) => (
                <Photo
                  key={item.img}
                  item={item}
                  priority={s.slug === sections[0]!.slug && i < 2}
                  onOpen={() => setLightbox({ items: s.items, index: i })}
                />
              ))}
            </ul>
            {s.items.length > STYLE_PREVIEW && (
              <button
                type="button"
                aria-expanded={!!expanded[s.slug]}
                onClick={() => setExpanded((e) => ({ ...e, [s.slug]: !e[s.slug] }))}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-primary px-6 font-display text-xs font-bold tracking-[0.12em] uppercase transition-colors hover:bg-accent sm:w-auto"
              >
                {expanded[s.slug]
                  ? "Show fewer"
                  : `Show all ${s.items.length} ${s.shortName} photos`}
              </button>
            )}
          </section>
        );
      })}

      <section
        id="portfolio"
        aria-labelledby="portfolio-title"
        className="mx-auto max-w-7xl scroll-mt-28 px-5 py-section"
      >
        <h2 id="portfolio-title" className="font-display text-h2 font-semibold tracking-tight">
          {STUDIO_TAG} Portfolio
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          More work from {BRAND_NAME}, Brookefield — {studioGallery.length} photos.
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {portfolio.map((item, i) => (
            <Photo
              key={item.img}
              item={item}
              onOpen={() => setLightbox({ items: studioGallery, index: i })}
            />
          ))}
        </ul>
        {portfolioCount < studioGallery.length && (
          <button
            type="button"
            onClick={() => setPortfolioCount((c) => c + PORTFOLIO_PAGE)}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-primary px-6 font-display text-xs font-bold tracking-[0.12em] uppercase transition-colors hover:bg-accent sm:w-auto"
          >
            Load more ({studioGallery.length - portfolioCount} more)
          </button>
        )}
      </section>

      <section
        aria-labelledby="gallery-cta-title"
        className="mx-auto max-w-3xl px-5 pb-section text-center"
      >
        <h2
          id="gallery-cta-title"
          className="font-display text-h2 font-semibold tracking-tight text-balance"
        >
          Like what you see?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Bring your idea to a free consultation, or{" "}
          <Link to="/contact" className="text-amber-800 underline underline-offset-4">
            find the studio
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <BookingCta location="gallery_end" />
          <WhatsAppCta location="gallery_end" />
        </div>
      </section>

      <LazyGalleryLightbox
        items={lightbox?.items ?? []}
        index={lightbox?.index ?? null}
        onClose={() => setLightbox(null)}
        onNavigate={(index) => setLightbox((l) => (l ? { ...l, index } : l))}
      />

      <SiteFooter />
    </main>
  );
}
