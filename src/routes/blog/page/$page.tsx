import { createFileRoute, notFound } from "@tanstack/react-router";

import { pageTitle, SITE_URL } from "@/data/business";
import { pageCount, postsForPage } from "@/data/blog";
import { BlogListing } from "@/components/blog/BlogListing";
import { blogItemList, breadcrumbSchema, type Crumb } from "@/lib/blog";

export const Route = createFileRoute("/blog/page/$page")({
  loader: ({ params }) => {
    const page = Number(params.page);
    // Page 1 lives at /blog; anything else outside the range is a 404.
    if (!Number.isInteger(page) || page < 2 || page > pageCount) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { page } = loaderData;
    const title = pageTitle(`Tattoo Blog – Page ${page}`);
    const description = `More tattoo guides, ideas and aftercare advice from Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru. Page ${page} of ${pageCount}. Book a free consult.`;
    const crumbs: Crumb[] = [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: `Page ${page}` },
    ];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/blog/page/${page}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [blogItemList(postsForPage(page)), breadcrumbSchema(crumbs)],
          }),
        },
      ],
    };
  },
  component: BlogPage,
});

function BlogPage() {
  const { page } = Route.useLoaderData();
  return (
    <BlogListing
      title={`Tattoo Guides & Ideas — Page ${page}`}
      intro="More real advice from Peace (Chingri Awungshi) at Xing Premium Tattoo Studio, Brookefield, Bengaluru."
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: `Page ${page}` },
      ]}
      list={postsForPage(page)}
      page={page}
    />
  );
}
