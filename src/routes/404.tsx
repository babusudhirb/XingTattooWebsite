import { createFileRoute } from "@tanstack/react-router";

import { pageTitle } from "@/data/business";
import { NotFoundPage } from "@/components/layout/NotFoundPage";

// Prerendered as 404.html, which .htaccess serves for every unknown URL.
export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: pageTitle("Page Not Found") },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});
