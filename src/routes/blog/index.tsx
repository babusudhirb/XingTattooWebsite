import { createFileRoute } from "@tanstack/react-router";

import { BUSINESS_ID, pageTitle, SITE_URL } from "@/data/business";
import {
  blogIndexPosts,
  featuredPosts,
  postsForPage,
  posts,
  signatureServicesSchema,
} from "@/data/blog";
import { BlogListing } from "@/components/blog/BlogListing";
import { cardImage } from "@/lib/blog";
import { blogItemList, breadcrumbSchema, type Crumb } from "@/lib/blog";
import { seoHead } from "@/lib/seo";

const TITLE = pageTitle("Tattoo Blog: Guides & Aftercare");
const DESCRIPTION =
  "Tattoo guides from Xing Premium Tattoo Studio, Brookefield, Bengaluru: first tattoos, aftercare, styles, placement and meanings by Peace. Book a free consult.";
const CRUMBS: Crumb[] = [{ label: "Home", href: "/" }, { label: "Blog" }];
const lead = featuredPosts[0];

export const Route = createFileRoute("/blog/")({
  head: () =>
    seoHead({
      path: "/blog",
      title: TITLE,
      description: DESCRIPTION,
      ...(posts[0] ? { image: posts[0].ogImage, imageAlt: posts[0].heroAlt } : {}),
      pageType: "CollectionPage",
      links: [
        // The first featured card is the largest image on screen at first load
        ...(lead
          ? [
              {
                rel: "preload",
                as: "image",
                href: cardImage(lead.heroImage),
                imageSrcSet: `${cardImage(lead.heroImage)} 800w, ${lead.heroImage} 1600w`,
                imageSizes: "(min-width: 1024px) 760px, 100vw",
                fetchPriority: "high",
              },
            ]
          : []),
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "Xing Premium Tattoo Studio Blog",
          href: "/blog/rss.xml",
        },
      ],
      graph: [
        {
          "@type": "Blog",
          "@id": `${SITE_URL}/blog#blog`,
          name: "Xing Premium Tattoo Studio Blog",
          description: DESCRIPTION,
          url: `${SITE_URL}/blog`,
          publisher: { "@id": BUSINESS_ID },
          inLanguage: "en-IN",
        },
        blogItemList(blogIndexPosts()),
        breadcrumbSchema(CRUMBS),
        signatureServicesSchema(),
      ],
    }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <BlogListing
      title="Tattoo Guides & Ideas from Brookefield, Bangalore"
      intro="Straight answers from Peace (Chingri Awungshi) at Xing Premium Tattoo Studio in AECS Layout: cost, safety, aftercare, styles and local tips."
      crumbs={CRUMBS}
      list={postsForPage(1)}
      showFeatured
      showSections
      showSignature
    />
  );
}
