import { createFileRoute } from "@tanstack/react-router";

import { pageTitle } from "@/data/business";
import { NotFoundPage } from "@/components/layout/NotFoundPage";
import { seoHead } from "@/lib/seo";

// Prerendered as 404.html, which .htaccess serves for every unknown URL.
export const Route = createFileRoute("/404")({
  head: () =>
    seoHead({
      path: "/404",
      title: pageTitle("Page Not Found"),
      description:
        "This page doesn't exist or has moved. Find tattoo services, the gallery and guides from Xing Premium Tattoo Studio, Brookefield.",
      noindex: true,
      canonical: false,
    }),
  component: NotFoundPage,
});
