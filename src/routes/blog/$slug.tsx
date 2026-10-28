import { createFileRoute, notFound } from "@tanstack/react-router";
import { postLoaders } from "virtual:blog";

import { BUSINESS_ID, BUSINESS_NAME, LEAD_ARTIST, SITE_URL } from "@/data/business";
import { absoluteUrl, categoryLabel } from "@/data/blog";
import { breadcrumbSchema, cardImage, postCrumbs, splitPostBody } from "@/lib/blog";
import { BlogPostView } from "@/components/blog/BlogPostView";
import { faqNode, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const load = postLoaders[params.slug];
    if (!load) throw notFound();
    return splitPostBody((await load()).default);
  },
  head: ({ loaderData: post }) => {
    if (!post) return {};
    const url = `${SITE_URL}/blog/${post.slug}`;
    return seoHead({
      path: `/blog/${post.slug}`,
      title: post.seoTitle,
      description: post.description,
      type: "article",
      image: post.ogImage,
      imageAlt: post.heroAlt,
      meta: [
        { name: "author", content: post.author },
        { property: "article:published_time", content: post.datePublished },
        { property: "article:modified_time", content: post.dateModified },
        { property: "article:section", content: categoryLabel(post.category) },
        ...post.tags.map((t) => ({ property: "article:tag", content: t })),
      ],
      links: [
        {
          rel: "preload",
          as: "image",
          href: post.heroImage,
          imageSrcSet: `${cardImage(post.heroImage)} 800w, ${post.heroImage} 1600w`,
          imageSizes: "(min-width: 1280px) 900px, (min-width: 1024px) 70vw, 100vw",
          fetchPriority: "high",
        },
      ],
      page: { mainEntity: { "@id": `${url}#post` } },
      graph: [
        {
          "@type": "BlogPosting",
          "@id": `${url}#post`,
          headline: post.title,
          description: post.description,
          ...(post.answer ? { abstract: post.answer } : {}),
          image: [absoluteUrl(post.ogImage), absoluteUrl(post.heroImage)],
          datePublished: post.datePublished,
          dateModified: post.dateModified,
          author: {
            "@type": "Person",
            "@id": `${SITE_URL}/tattoo-artist#peace`,
            name: LEAD_ARTIST.fullName,
            jobTitle: LEAD_ARTIST.role,
            url: `${SITE_URL}/tattoo-artist`,
          },
          publisher: { "@id": BUSINESS_ID, name: BUSINESS_NAME },
          mainEntityOfPage: url,
          keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
          articleSection: categoryLabel(post.category),
          inLanguage: "en-IN",
        },
        breadcrumbSchema([...postCrumbs(post), { label: post.title }]),
        ...(post.faqs.length
          ? [faqNode(post.faqs.map((f) => ({ question: f.q, answer: f.a })))]
          : []),
      ],
    });
  },
  component: PostRoute,
});

function PostRoute() {
  const post = Route.useLoaderData();
  return <BlogPostView key={post.slug} post={post} />;
}
