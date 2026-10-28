import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { BRAND_NAME, GBP_SERVICES, pageTitle, serviceAnchor, SITE_URL } from "@/data/business";
import { SERVICE_SLUGS, services } from "@/data/services";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { Breadcrumbs } from "@/components/blog/BlogBits";
import { seoHead } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/blog";

export const Route = createFileRoute("/services/")({
  head: () =>
    seoHead({
      path: "/services",
      title: pageTitle("Tattoo Services in Brookefield, Bangalore"),
      description:
        "Realism, portrait, Black & Grey, geometric, Indian traditional and fine-line tattoos in AECS Layout, Brookefield. Book a free consultation with Peace.",
      pageType: "CollectionPage",
      graph: [
        {
          "@type": "ItemList",
          itemListElement: SERVICE_SLUGS.map((slug, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/services/${slug}`,
            name: services[slug].name,
          })),
        },
        breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Tattoo Services" }]),
      ],
    }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-5 pt-5">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tattoo Services" }]} />
      </div>
      <section className="mx-auto max-w-7xl px-5 pt-8 pb-14 text-center">
        <p className="eyebrow">Every Style. One Studio.</p>
        <h1 className="mt-4 font-display text-[2.1rem] leading-[1.05] font-medium tracking-tight text-balance uppercase sm:text-5xl">
          Tattoo Services in Brookefield, Bangalore
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Six distinct tattoo styles, each with its own process, healing timeline and best-fit
          placements. Pick one below to see exactly what to expect.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {SERVICE_SLUGS.map((slug) => {
            const s = services[slug];
            return (
              <Link
                key={slug}
                to="/services/$slug"
                params={{ slug }}
                className="group media-hover rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
              >
                <img
                  src={s.cardImage}
                  alt={s.heroImageAlt}
                  width={640}
                  height={768}
                  loading="lazy"
                  className="h-48 w-full object-cover"
                />
                <div className="px-4 py-5 text-center">
                  <h2 className="font-display text-sm font-semibold tracking-[0.1em] uppercase transition-colors group-hover:text-amber-700">
                    {s.shortName}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.tagline}</p>
                  <span className="mt-3 inline-flex items-center gap-1 font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase">
                    Learn More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="all-services-title"
        className="mx-auto max-w-7xl border-t border-border px-5 py-14"
      >
        <p className="eyebrow text-center">Everything We Do</p>
        <h2
          id="all-services-title"
          className="mt-3 text-center font-display text-2xl font-medium tracking-tight sm:text-3xl"
        >
          All services at {BRAND_NAME}
        </h2>
        <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-x-8 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          {GBP_SERVICES.map((name) => (
            <li
              key={name}
              id={serviceAnchor(name)}
              className="scroll-mt-28 border-b border-border py-2.5"
            >
              {name}
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}
