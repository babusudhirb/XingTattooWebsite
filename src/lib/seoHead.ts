import {
  BRAND_NAME,
  BUSINESS_ID,
  BUSINESS_NAME,
  businessSchema,
  OG_IMAGE,
  OG_IMAGE_ALT,
  SITE_URL,
  WEBSITE_ID,
} from "@/data/business";

/**
 * The one canonical URL builder: https://www.xingtattoo.in + path, no query, no hash,
 * no trailing slash (the home page is "/").
 */
export const canonical = (path: string) => {
  const clean = path.split(/[?#]/)[0]!.replace(/\/+$/, "");
  return `${SITE_URL}${clean || "/"}`;
};

/** Absolute URL for a site path or an already-absolute URL. */
export const absolute = (u: string) => (/^https?:\/\//.test(u) ? u : `${SITE_URL}${u}`);

/** The studio and the website: the first two nodes of every page's graph. */
export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: BUSINESS_NAME,
  alternateName: BRAND_NAME,
  publisher: { "@id": BUSINESS_ID },
  inLanguage: "en-IN",
};
/** businessSchema without its own @context (the page graph has one). */
const businessNode = Object.fromEntries(
  Object.entries(businessSchema).filter(([k]) => k !== "@context"),
);

/** Page-node `speakable`: the H1 and the QuickAnswer section's direct answer. */
export const SPEAKABLE = {
  "@type": "SpeakableSpecification",
  cssSelector: ["h1", "#quick-answer"],
};

export const faqNode = (items: { question: string; answer: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

export interface SeoInput {
  /** Site path, e.g. "/about" ("/" for home). Canonical and og:url come from it. */
  path: string;
  /** Final <title> (already passed through pageTitle). */
  title: string;
  description: string;
  /** Social image (site path or absolute URL), 1200×630 unless width/height say otherwise. */
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: "website" | "article" | "profile";
  /** robots noindex,follow (pagination, expired offer). The self-canonical stays. */
  noindex?: boolean;
  /** false drops the canonical link (the 404 page only). */
  canonical?: false;
  /** schema.org type of the page node (AboutPage, ProfilePage, CollectionPage…), default WebPage. */
  pageType?: string;
  /** Extra properties for the page node, e.g. { mainEntity: { "@id": … } }. */
  page?: Record<string, unknown>;
  /** Page-specific JSON-LD nodes; merged into one @graph with the studio and website. */
  graph?: object[];
  meta?: Record<string, string>[];
  links?: Record<string, string>[];
}

/**
 * Everything a page needs in <head> for search and sharing: title, description, canonical,
 * Open Graph + Twitter tags and a single JSON-LD @graph (TattooParlor + WebSite + page nodes).
 */
export function seoHead(input: SeoInput) {
  const url = canonical(input.path);
  const image = absolute(input.image ?? OG_IMAGE);
  const imageAlt = input.imageAlt ?? OG_IMAGE_ALT;
  const graph = [
    businessNode,
    websiteNode,
    {
      "@type": input.pageType ?? "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: input.title,
      description: input.description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      primaryImageOfPage: image,
      inLanguage: "en-IN",
      ...input.page,
    },
    ...(input.graph ?? []),
  ];
  return {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      {
        name: "robots",
        content: input.noindex ? "noindex,follow" : "index,follow,max-image-preview:large",
      },
      { property: "og:type", content: input.type ?? "website" },
      { property: "og:title", content: input.title },
      { property: "og:description", content: input.description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: String(input.imageWidth ?? 1200) },
      { property: "og:image:height", content: String(input.imageHeight ?? 630) },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: imageAlt },
      ...(input.meta ?? []),
    ],
    links: [
      ...(input.canonical === false ? [] : [{ rel: "canonical", href: url }]),
      ...(input.links ?? []),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      },
    ],
  };
}
