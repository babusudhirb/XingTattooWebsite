import { Link } from "@tanstack/react-router";
import { Home, Images, MapPin, Sparkles } from "lucide-react";

import { WhatsAppCta } from "@/components/cta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SocialDock } from "@/components/layout/SocialDock";

const LINK =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary px-6 font-display text-xs font-bold tracking-[0.12em] uppercase transition-colors hover:bg-accent";

/** "Page not found" inside the normal site shell. Used by the router and prerendered as 404.html. */
export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:py-28">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 font-display text-[2rem] leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist or has moved. These will get you back on track:
        </p>
        <nav aria-label="Helpful links" className="mt-8">
          <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
            {[
              { to: "/", label: "Home", icon: Home },
              { to: "/services", label: "Services", icon: Sparkles },
              { to: "/gallery", label: "Gallery", icon: Images },
              { to: "/contact", label: "Contact", icon: MapPin },
            ].map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className={`${LINK} w-full sm:w-auto`}>
                  <Icon className="h-4 w-4" aria-hidden="true" /> {label}
                </Link>
              </li>
            ))}
            <li className="col-span-2">
              <WhatsAppCta location="404" className="w-full sm:w-auto" />
            </li>
          </ul>
        </nav>
      </section>
      <SiteFooter />
    </main>
  );
}
