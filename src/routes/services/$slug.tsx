import { createFileRoute, notFound } from "@tanstack/react-router";

import {
  BRAND_NAME,
  BUSINESS_ID,
  BUSINESS_NAME,
  businessSchema,
  pageTitle,
  SITE_URL,
} from "@/data/business";
import { getService } from "@/data/services";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import { faqNode, seoHead } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/blog";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const path = `/services/${params.slug}`;
    return seoHead({
      path,
      title: pageTitle(loaderData.metaTitle),
      description: loaderData.metaDescription,
      image: `/og/services-${params.slug}.jpg`,
      imageAlt: loaderData.heroImageAlt,
      graph: [
        {
          "@type": "Service",
          "@id": `${SITE_URL}${path}#service`,
          serviceType: loaderData.name,
          name: `${loaderData.name} | ${BRAND_NAME}`,
          description: loaderData.metaDescription,
          url: `${SITE_URL}${path}`,
          areaServed: businessSchema.areaServed,
          provider: { "@id": BUSINESS_ID, name: BUSINESS_NAME },
        },
        faqNode(loaderData.faqs),
        breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Tattoo Services", href: "/services" },
          { label: loaderData.name },
        ]),
      ],
    });
  },
  component: ServiceRoute,
});

function ServiceRoute() {
  const service = Route.useLoaderData();
  return <ServiceTemplate service={service} />;
}
