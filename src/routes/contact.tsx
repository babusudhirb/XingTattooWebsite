import { createFileRoute, Link } from "@tanstack/react-router";

import { ADDRESS, BRAND_NAME, BUSINESS_ID, pageTitle, SERVICE_AREAS } from "@/data/business";
import { faqById } from "@/data/faqs";
import { Breadcrumbs } from "@/components/blog/BlogBits";
import { BookCTA, CallCTA, DirectionsCTA, WhatsAppCTA } from "@/components/cta";
import { FaqSection } from "@/components/faq/FaqSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SocialDock } from "@/components/layout/SocialDock";
import { VisitStudio } from "@/components/layout/VisitStudio";
import { breadcrumbSchema, type Crumb } from "@/lib/blog";
import { faqNode, seoHead } from "@/lib/seo";

const CRUMBS: Crumb[] = [{ label: "Home", href: "/" }, { label: "Contact" }];
const contactFaqs = ["location", "opening-hours", "walk-ins"].map((id) => faqById.get(id)!);

export const Route = createFileRoute("/contact")({
  head: () =>
    seoHead({
      path: "/contact",
      title: pageTitle("Contact & Directions: Tattoo Studio Brookefield"),
      description: `Visit ${BRAND_NAME} on the First Floor of SV Plaza, above DMART Ready, 60 Feet Road, AECS Layout, Brookefield. Call, WhatsApp or get directions.`,
      pageType: "ContactPage",
      page: { mainEntity: { "@id": BUSINESS_ID } },
      graph: [faqNode(contactFaqs), breadcrumbSchema(CRUMBS)],
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-5 pt-5">
        <Breadcrumbs items={CRUMBS} />
      </div>
      <section className="mx-auto max-w-3xl px-5 pt-6 pb-10 text-center sm:pt-8">
        <p className="eyebrow">Contact & Directions</p>
        <h1 className="mt-3 font-display text-h1 font-semibold tracking-tight text-balance">
          Contact Xing Premium Tattoo Studio, Brookefield
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Book a free consultation, message us on WhatsApp, call, or visit the studio in AECS
          Layout, Brookefield.
        </p>
        <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3">
          <BookCTA location="contact" shortBelow="sm" className="col-span-2" />
          <WhatsAppCTA location="contact" />
          <DirectionsCTA location="contact" />
          <CallCTA location="contact" className="col-span-2" />
        </div>
      </section>

      <VisitStudio />

      <section aria-labelledby="find-us-title" className="mx-auto max-w-3xl px-5 py-section">
        <h2 id="find-us-title" className="font-display text-h2 font-semibold tracking-tight">
          How to find us
        </h2>
        <ol className="mt-5 space-y-3 text-pretty text-muted-foreground">
          <li>
            <strong className="text-foreground">60 Feet Road, AECS Layout:</strong> look for SV
            Plaza, No. 267, with DMART Ready below.
          </li>
          <li>
            <strong className="text-foreground">First Floor:</strong> the studio is{" "}
            {ADDRESS.landmark}.
          </li>
          <li>
            <strong className="text-foreground">Coming from further away?</strong> We're easy to
            reach from {SERVICE_AREAS.slice(2).join(", ")}. Tap Get Directions for a Google Maps
            route.
          </li>
        </ol>
        <p className="mt-5 text-sm text-muted-foreground">
          Before you visit, see{" "}
          <Link to="/gallery" className="text-amber-800 underline underline-offset-4">
            our tattoo gallery
          </Link>{" "}
          or read the{" "}
          <Link to="/faq" className="text-amber-800 underline underline-offset-4">
            tattoo FAQs
          </Link>
          .
        </p>
      </section>

      <FaqSection
        items={contactFaqs}
        className="mx-auto max-w-7xl border-t border-border px-5 py-section"
      />

      <SiteFooter />
    </main>
  );
}
