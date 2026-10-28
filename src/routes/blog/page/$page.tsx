import { createFileRoute, notFound } from "@tanstack/react-router";

import { pageTitle } from "@/data/business";
import { pageCount, postsForPage } from "@/data/blog";
import { BlogListing } from "@/components/blog/BlogListing";
import { blogItemList, breadcrumbSchema, type Crumb } from "@/lib/blog";
import { seoHead } from "@/lib/seo";

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
    const crumbs: Crumb[] = [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: `Page ${page}` },
    ];
    return seoHead({
      path: `/blog/page/${page}`,
      title: pageTitle(`Tattoo Blog – Page ${page}`),
      description: `More tattoo guides, ideas and aftercare advice from Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru. Page ${page} of ${pageCount}. Book a free consult.`,
      pageType: "CollectionPage",
      graph: [blogItemList(postsForPage(page)), breadcrumbSchema(crumbs)],
    });
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
