import { createFileRoute, notFound } from "@tanstack/react-router";
import { postLoaders } from "virtual:blog";

import { BUSINESS_ID, BUSINESS_NAME, SITE_URL } from "@/data/business";
import { absoluteUrl, categoryLabel } from "@/data/blog";
import { breadcrumbSchema, cardImage, postCrumbs, splitPostBody } from "@/lib/blog";
import { BlogPostView } from "@/components/blog/BlogPostView";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const load = postLoaders[params.slug];
    if (!load) throw notFound();
    return splitPostBody((await load()).default);
  },
  head: ({ loaderData: post }) => {
    if (!post) return {};
    const url = `${SITE_URL}/blog/${post.slug}`;
    const image = absoluteUrl(post.ogImage);
    return {
      meta: [
        { title: post.seoTitle },
        { name: "description", content: post.description },
        { name: "author", content: post.author },
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.seoTitle },
        { property: "og:description", content: post.description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: post.heroAlt },
        { property: "article:published_time", content: post.datePublished },
        { property: "article:modified_time", content: post.dateModified },
        { property: "article:section", content: categoryLabel(post.category) },
        ...post.tags.map((t) => ({ property: "article:tag", content: t })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.seoTitle },
        { name: "twitter:description", content: post.description },
        { name: "twitter:image", content: image },
      ],
      links: [
        { rel: "canonical", href: url },
        {
          rel: "preload",
          as: "image",
          href: post.heroImage,
          imageSrcSet: `${cardImage(post.heroImage)} 800w, ${post.heroImage} 1600w`,
          imageSizes: "(min-width: 1280px) 900px, (min-width: 1024px) 70vw, 100vw",
          fetchPriority: "high",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                "@id": `${url}#post`,
                headline: post.title,
                description: post.description,
                ...(post.answer ? { abstract: post.answer } : {}),
                image: [image, absoluteUrl(post.heroImage)],
                datePublished: post.datePublished,
                dateModified: post.dateModified,
                author: {
                  "@type": "Person",
                  name: "Peace (Chingri Awungshi)",
                  jobTitle: "Lead Tattoo Artist",
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
                ? [
                    {
                      "@type": "FAQPage",
                      mainEntity: post.faqs.map((f) => ({
                        "@type": "Question",
                        name: f.q,
                        acceptedAnswer: { "@type": "Answer", text: f.a },
                      })),
                    },
                  ]
                : []),
            ],
          }),
        },
      ],
    };
  },
  component: PostRoute,
});

function PostRoute() {
  const post = Route.useLoaderData();
  return <BlogPostView key={post.slug} post={post} />;
}
