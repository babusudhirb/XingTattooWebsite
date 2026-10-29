import { createFileRoute, notFound } from "@tanstack/react-router";

import { pageTitle } from "@/data/business";
import { activeCategories, posts } from "@/data/blog";
import { BlogListing } from "@/components/blog/BlogListing";
import { blogItemList, breadcrumbSchema, type Crumb } from "@/lib/blog";
import { seoHead } from "@/lib/seoHead";

export const Route = createFileRoute("/blog/category/$category")({
  loader: ({ params }) => {
    const category = activeCategories.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return { slug: category.slug, label: category.label };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const list = posts.filter((p) => p.category === loaderData.slug);
    // "Tattoo Guides" would read "Tattoo Guides Tattoo Guides" — only add the suffix when it isn't in the label
    const topic = /guides/i.test(loaderData.label)
      ? loaderData.label
      : `${loaderData.label} Tattoo Guides`;
    const title = pageTitle(topic);
    // 145–158 characters whatever the label length: add the longest closing line that fits
    const base = `${topic} from Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru.`;
    const description =
      base +
      ([
        " Read the guides, then book your free tattoo consultation in AECS Layout.",
        " Read the guides, then book a free, no-pressure tattoo consultation.",
        " Read the guides, then book your free tattoo consultation.",
        " Read the guides, then book a free consultation.",
        " Book a free consultation.",
      ].find((e) => (base + e).length <= 158) ?? "");
    const crumbs: Crumb[] = [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: loaderData.label },
    ];
    return seoHead({
      path: `/blog/category/${loaderData.slug}`,
      title,
      description,
      pageType: "CollectionPage",
      graph: [blogItemList(list), breadcrumbSchema(crumbs)],
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug, label } = Route.useLoaderData();
  return (
    <BlogListing
      key={slug}
      title={`${/guides/i.test(label) ? label : `${label} Tattoo Guides`} from Brookefield, Bangalore`}
      intro={`${label} articles by Peace (Chingri Awungshi) at Xing Premium Tattoo Studio, AECS Layout, Brookefield, Bengaluru.`}
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label }]}
      list={posts.filter((p) => p.category === slug)}
      category={slug}
    />
  );
}
