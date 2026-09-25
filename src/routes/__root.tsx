import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BookingModal } from "../components/site/BookingModal";
import artistPortrait from "../assets/artist/peace-tattoo-artist-xing-brookefield.jpg";

/** Site-wide LocalBusiness schema — hours must match the booking modal (closed Tuesdays). */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  // Shared with the home page's review schema so both describe one business.
  "@id": "#studio",
  name: "XING Tattoo Studio",
  description:
    "Custom tattoo studio in Brookefield, Bengaluru led by Artist Peace (15+ years) — realism, portrait, black & grey, geometric, Indian traditional and fine-line tattoos.",
  telephone: "+91-8970007818",
  email: "xingtattoo.aecs@gmail.com",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1st Floor, SV Plaza, 267, 60 Feet Rd, above DMART, AECS Layout A Block",
    addressLocality: "Brookefield, Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560037",
    addressCountry: "IN",
  },
  areaServed: ["Brookefield", "Whitefield", "Marathahalli", "Bengaluru"],
  foundingDate: "2021",
  knowsLanguage: ["en", "hi", "kn"],
  employee: {
    "@type": "Person",
    name: "Peace",
    alternateName: "Chingri Awungshi",
    jobTitle: "Lead Tattoo Artist",
    image: artistPortrait,
    description:
      "Lead tattoo artist at XING Tattoo Studio, Brookefield, Bengaluru, with 15+ years of experience and 1800+ tattoos completed.",
    knowsAbout: [
      "Realism tattoos",
      "Portrait tattoos",
      "Black and grey tattoos",
      "Fine-line tattoos",
      "Geometric tattoos",
      "Indian traditional tattoos",
    ],
    worksFor: { "@id": "#studio" },
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "21:00",
    },
  ],
  sameAs: ["https://www.instagram.com/xingtattoo_blr/"],
  makesOffer: {
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: "Free Tattoo Consultation" },
    price: "0",
    priceCurrency: "INR",
  },
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

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
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#faf9f7" },
      { title: "XING Tattoo Studio | Custom Tattoos in Brookefield, Bengaluru" },
      {
        name: "description",
        content:
          "Custom tattoos by Artist Peace (15+ years) at XING Tattoo Studio, AECS Layout, Brookefield, Bengaluru. 4.9★ Google rated, 100% single-use sterile needles. Book a free consultation.",
      },
      { name: "author", content: "XING Tattoo Studio" },
      { property: "og:site_name", content: "XING Tattoo Studio" },
      { property: "og:title", content: "XING Tattoo Studio | Custom Tattoos in Brookefield" },
      {
        property: "og:description",
        content:
          "Custom tattoos, premium hygiene and 15+ years of artistry in Brookefield, Bengaluru.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessSchema) }],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Karla:wght@400;500;600&family=Dancing+Script:wght@600&display=swap",
      },
      {
        // Signature font subset to just the glyphs in "Peace" — a few KB
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&text=Peace&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <BookingModal />
    </QueryClientProvider>
  );
}
