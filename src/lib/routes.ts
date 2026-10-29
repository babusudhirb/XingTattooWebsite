/**
 * Every static page of the site, in sitemap order — the one list read by
 * scripts/generate-seo-files.mjs (sitemaps, llms.txt), scripts/postbuild.mjs and the QA scripts.
 * Blog posts and category pages come from content/blog/*.md, not from here.
 * Plain data, no imports: Node scripts import this file directly.
 *
 * - `sources`: files whose last git commit date is the page's <lastmod>
 * - `indexable: "offer"`: indexable only while the GBP offer runs (OFFER in src/data/business.ts)
 */
export interface SiteRoute {
  path: string;
  /** Short page name for llms.txt and reports. */
  label: string;
  group: "pages" | "blog";
  indexable: boolean | "offer";
  sources: string[];
}

const SERVICE = [
  "src/routes/services/$slug.tsx",
  "src/data/services.ts",
  "src/components/services/ServiceTemplate.tsx",
];

export const SITE_ROUTES: SiteRoute[] = [
  {
    path: "/",
    label: "Home",
    group: "pages",
    indexable: true,
    sources: [
      "src/routes/index.tsx",
      "src/data/page-copy.ts",
      "src/data/services.ts",
      "src/data/reviews.ts",
    ],
  },
  {
    path: "/services",
    label: "Tattoo Services",
    group: "pages",
    indexable: true,
    sources: ["src/routes/services/index.tsx", "src/data/services.ts"],
  },
  {
    path: "/services/realism",
    label: "Realism Tattoos",
    group: "pages",
    indexable: true,
    sources: SERVICE,
  },
  {
    path: "/services/portrait",
    label: "Portrait Tattoos",
    group: "pages",
    indexable: true,
    sources: SERVICE,
  },
  {
    path: "/services/black-grey",
    label: "Black & Grey Tattoos",
    group: "pages",
    indexable: true,
    sources: SERVICE,
  },
  {
    path: "/services/geometric",
    label: "Geometric & Mandala Tattoos",
    group: "pages",
    indexable: true,
    sources: SERVICE,
  },
  {
    path: "/services/traditional",
    label: "Indian Traditional Tattoos",
    group: "pages",
    indexable: true,
    sources: SERVICE,
  },
  {
    path: "/services/minimalist",
    label: "Minimalist & Fine-Line Tattoos",
    group: "pages",
    indexable: true,
    sources: SERVICE,
  },
  {
    path: "/gallery",
    label: "Tattoo Gallery",
    group: "pages",
    indexable: true,
    sources: ["src/routes/gallery.tsx", "src/data/gallery.ts", "src/data/studio-photos.ts"],
  },
  {
    path: "/tattoo-artist",
    label: "Lead Artist Peace",
    group: "pages",
    indexable: true,
    sources: ["src/routes/tattoo-artist.tsx", "src/data/artist.ts"],
  },
  {
    path: "/faq",
    label: "Tattoo FAQs",
    group: "pages",
    indexable: true,
    sources: ["src/routes/faq.tsx", "src/data/faqs.ts"],
  },
  {
    path: "/about",
    label: "About the Studio",
    group: "pages",
    indexable: true,
    sources: ["src/routes/about.tsx", "src/data/about.ts"],
  },
  {
    path: "/contact",
    label: "Contact & Directions",
    group: "pages",
    indexable: true,
    sources: [
      "src/routes/contact.tsx",
      "src/components/layout/VisitStudio.tsx",
      "src/data/business.ts",
    ],
  },
  {
    path: "/offer",
    label: "Offer",
    group: "pages",
    indexable: "offer",
    sources: ["src/routes/offer.tsx", "src/data/offer.ts"],
  },
  {
    path: "/privacy-policy",
    label: "Privacy Policy",
    group: "pages",
    indexable: true,
    sources: ["src/routes/privacy-policy.tsx", "src/components/layout/LegalPage.tsx"],
  },
  {
    path: "/terms-and-conditions",
    label: "Terms & Conditions",
    group: "pages",
    indexable: true,
    sources: ["src/routes/terms-and-conditions.tsx", "src/components/layout/LegalPage.tsx"],
  },
  {
    path: "/blog",
    label: "Tattoo Blog",
    group: "blog",
    indexable: true,
    sources: ["src/routes/blog/index.tsx", "content/blog"],
  },
];
