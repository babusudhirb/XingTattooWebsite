import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SERVICE_SLUGS, services } from "@/data/services";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Tattoo Styles & Services | XING Tattoo Studio, Brookefield" },
      {
        name: "description",
        content:
          "Explore every tattoo style at XING Tattoo Studio, Brookefield — realism, portrait, black & grey, geometric, traditional and minimalist. Aftercare, timing and pricing guidance for each.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 py-14 text-center">
        <p className="eyebrow">Our Services</p>
        <h1 className="mt-4 font-display text-[2.1rem] leading-[1.05] font-medium tracking-tight uppercase sm:text-5xl">
          Every Style. One Studio.
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
                className="group media-hover rounded-sm border border-border bg-card shadow-[var(--shadow-card)]"
              >
                <img
                  src={s.heroImage}
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
                  <span className="mt-3 inline-flex items-center gap-1 font-display text-[0.65rem] font-semibold tracking-[0.14em] text-amber-700 uppercase">
                    Learn More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
