import { Outlet, createRootRoute, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "@/styles/global.css?url";
import archivoFont from "@/assets/fonts/archivo-latin.woff2?url";
import karlaFont from "@/assets/fonts/karla-latin.woff2?url";
import { BookingModalLoader } from "@/components/booking/BookingModalLoader";
import { BUSINESS_NAME, GEO_META } from "@/data/business";
import { NotFoundPage } from "@/components/layout/NotFoundPage";

const GSC_VERIFICATION = import.meta.env["VITE_GSC_VERIFICATION"] as string | undefined;
const BING_VERIFICATION = import.meta.env["VITE_BING_VERIFICATION"] as string | undefined;

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-primary bg-background px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  // Site-wide tags only. Each route adds its own title, description, canonical, Open Graph
  // and JSON-LD @graph through seoHead() in src/lib/seo.ts.
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#faf9f7" },
      { name: "author", content: BUSINESS_NAME },
      { property: "og:site_name", content: BUSINESS_NAME },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      ...GEO_META,
      // Search Console / Bing ownership tags, only when the build sets them (see SEARCH-CONSOLE.md)
      ...(GSC_VERIFICATION
        ? [{ name: "google-site-verification", content: GSC_VERIFICATION }]
        : []),
      ...(BING_VERIFICATION ? [{ name: "msvalidate.01", content: BING_VERIFICATION }] : []),
    ],
    links: [
      // Fonts are self-hosted (src/styles/fonts.css); preload the two used above the fold.
      ...[archivoFont, karlaFont].map((href) => ({
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href,
        crossOrigin: "anonymous" as const,
      })),
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <BookingModalLoader />
    </>
  );
}
