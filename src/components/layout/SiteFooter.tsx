import { Instagram, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  EMAIL,
  EMAIL_TO,
  INSTAGRAM_URL,
  navLinks,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
} from "@/data/site";
import { SERVICE_SLUGS, services } from "@/data/services";
import {
  ADDRESS,
  BUSINESS_NAME,
  DIRECTIONS_URL,
  HOURS_ROWS,
  MAPS_PLACE_URL,
  OPEN_LABEL,
} from "@/data/business";
import { Logo } from "@/components/layout/Logo";
import { VisitStudio } from "@/components/layout/VisitStudio";

/** `showMap` adds the "Visit the studio" map block — the home page only. */
export function SiteFooter({ showMap = false }: { showMap?: boolean }) {
  const [emailUser, emailDomain] = EMAIL.split("@");
  return (
    <footer className="border-t border-border">
      {showMap && <VisitStudio />}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 text-xs leading-relaxed text-balance text-muted-foreground">
            <span className="font-semibold text-foreground/80">{BUSINESS_NAME}.</span> Custom
            tattoos, premium hygiene and honest advice — {ADDRESS.landmark}.
          </p>
          <div className="mt-5 flex gap-2 text-muted-foreground">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={EMAIL_TO}
              aria-label="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <p className="eyebrow">Quick Links</p>
          <ul className="mt-3 text-xs text-muted-foreground lg:mt-4 lg:space-y-2">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground lg:min-h-0 lg:min-w-0"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/services"
                className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground lg:min-h-0 lg:min-w-0"
              >
                Services
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Our Services</p>
          <ul className="mt-3 text-xs text-muted-foreground lg:mt-4 lg:space-y-2">
            {SERVICE_SLUGS.map((slug) => (
              <li key={slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug }}
                  className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground lg:min-h-0 lg:min-w-0"
                >
                  {services[slug].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Contact + hours share a row on phones, so both are visible without scrolling */}
        <div className="min-w-0">
          <p className="eyebrow">Contact Us</p>
          {/* One contact item per line — labels keep phone, email and address apart for
              screen readers and text extraction ("…07818xingtattoo…" before) */}
          <address className="mt-3 not-italic lg:mt-4">
            <ul className="space-y-1 text-xs text-muted-foreground lg:space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="sr-only">Phone: </span>
                <a
                  href={PHONE_TEL}
                  className="inline-flex min-h-12 min-w-12 items-center transition-colors hover:text-foreground lg:min-h-0 lg:min-w-0"
                >
                  {PHONE_DISPLAY}
                </a>{" "}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="sr-only">Email: </span>
                <a
                  href={EMAIL_TO}
                  className="inline-flex min-h-12 min-w-0 items-center transition-colors hover:text-foreground lg:min-h-0"
                >
                  {/* Long address: allowed to wrap before the @ in a narrow column */}
                  <span className="min-w-0">
                    {emailUser}
                    <wbr />@{emailDomain}
                  </span>
                </a>{" "}
              </li>
              <li className="flex gap-2 py-2 lg:py-0">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="sr-only">Address: </span>
                <a
                  href={MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 leading-relaxed transition-colors hover:text-foreground"
                >
                  {ADDRESS.full}
                </a>{" "}
              </li>
              <li className="flex items-center gap-2">
                <Navigation className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 min-w-12 items-center font-semibold text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline lg:min-h-0 lg:min-w-0"
                >
                  Get directions
                </a>
              </li>
            </ul>
          </address>
        </div>
        <div className="min-w-0">
          <p className="eyebrow">Working Hours</p>
          <dl className="mt-3 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2 gap-y-2 pt-3.5 text-xs text-muted-foreground lg:mt-4 lg:pt-0">
            {HOURS_ROWS.map(({ label, closed }) => (
              <div key={label} className="col-span-2 grid grid-cols-subgrid">
                <dt className="font-semibold whitespace-nowrap text-foreground/80">{label}</dt>
                <dd className={closed ? "text-amber-800" : "whitespace-nowrap"}>
                  {closed ? "Closed" : OPEN_LABEL}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-5 text-xs text-muted-foreground">
        {/* Year is stamped at build time; the browser may be a year ahead after New Year */}
        <p suppressHydrationWarning>
          © 2021–{new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
        </p>
        <nav aria-label="Legal" className="flex gap-4">
          <Link
            to="/privacy-policy"
            className="inline-flex min-h-12 items-center transition-colors hover:text-foreground lg:min-h-0"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="inline-flex min-h-12 items-center transition-colors hover:text-foreground lg:min-h-0"
          >
            Terms &amp; Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
