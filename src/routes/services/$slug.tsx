import { createFileRoute, notFound } from "@tanstack/react-router";

import { BRAND_NAME, BUSINESS_ID, BUSINESS_NAME, businessSchema, pageTitle, SITE_URL } from "@/data/business";
import { getService } from "@/data/services";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const canonical = `${SITE_URL}/services/${params.slug}`;
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: loaderData.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: loaderData.name,
      name: `${loaderData.name} | ${BRAND_NAME}`,
      description: loaderData.metaDescription,
      areaServed: businessSchema.areaServed,
      provider: { "@id": BUSINESS_ID, name: BUSINESS_NAME },
    };
    return {
      meta: [
        { title: pageTitle(loaderData.metaTitle) },
        { name: "description", content: loaderData.metaDescription },
        { property: "og:title", content: pageTitle(loaderData.metaTitle) },
        { property: "og:description", content: loaderData.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:image", content: loaderData.heroImage },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
      ],
    };
  },
  component: ServiceRoute,
});

function ServiceRoute() {
  const service = Route.useLoaderData();
  return <ServiceTemplate service={service} />;
}
