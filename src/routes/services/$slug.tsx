import { createFileRoute, notFound } from "@tanstack/react-router";

import { getService } from "@/data/services";
import { ServiceTemplate } from "@/components/site/ServiceTemplate";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const canonical = `/services/${params.slug}`;
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
      name: `${loaderData.name} | XING Tattoo Studio`,
      description: loaderData.metaDescription,
      areaServed: ["Brookefield", "Whitefield", "Marathahalli", "Bengaluru"],
      provider: {
        "@type": "TattooParlor",
        name: "XING Tattoo Studio",
        image: loaderData.heroImage,
        telephone: "+91-8970007818",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1st Floor, SV Plaza, 267, 60 Feet Rd, above DMART, AECS Layout A Block",
          addressLocality: "Brookefield, Bengaluru",
          addressRegion: "Karnataka",
          postalCode: "560037",
          addressCountry: "IN",
        },
      },
    };
    return {
      meta: [
        { title: loaderData.metaTitle },
        { name: "description", content: loaderData.metaDescription },
        { property: "og:title", content: loaderData.metaTitle },
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
