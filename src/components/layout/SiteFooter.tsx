import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { EMAIL, EMAIL_TO, navLinks } from "@/data/site";
import { SERVICE_SLUGS, services } from "@/data/services";
import {
  ADDRESS,
  BUSINESS_NAME,
  GOOGLE_RATING,
  HOURS,
  INSTAGRAM_URL,
  MAPS_PLACE_URL,
  OPEN_LABEL,
  PHONE_DISPLAY,
  PHONE_TEL,
  REVIEW_COUNT,
  WHATSAPP_CHAT_URL,
} from "@/data/business";
import { DirectionsCTA } from "@/components/cta";
import { Logo } from "@/components/layout/Logo";
import { VisitStudio } from "@/components/layout/VisitStudio";
/** `showMap` adds the "Visit the studio" map block — the home page only. */
export function SiteFooter({ showMap = false }: { showMap?: boolean }) {
  const [emailUser, emailDomain] = EMAIL.split("@");
  return (
    <footer className="cv-auto border-t border-border">
      {showMap && <VisitStudio />}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Logo imgClassName="h-16 w-auto" />
          {/* NAP — each item its own block, values straight from the GBP data */}
          <p className="mt-4 text-sm font-semibold text-balance text-foreground/90">
            {BUSINESS_NAME}
          </p>
          <address className="mt-2 text-xs leading-relaxed not-italic text-muted-foreground">
            <a
              href={MAPS_PLACE_URL}
              target="_blank"
              rel="noopener"
              className="transition-colors hover:text-foreground"
            >
              {ADDRESS.full}
            </a>
          </address>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" /> Instagram
          </a>
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
        <div className="col-span-2 min-w-0 sm:col-span-1">
          <p className="eyebrow">Contact Us</p>
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground lg:mt-4 lg:space-y-2">
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only">Phone: </span>
              <a
                href={PHONE_TEL}
                data-track="click_call"
                data-location="footer"
                className="inline-flex min-h-12 items-center transition-colors hover:text-foreground lg:min-h-0"
              >
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only">Email: </span>
              <a
                href={EMAIL_TO}
                data-track="click_email"
                data-location="footer"
                className="inline-flex min-h-12 min-w-0 items-center transition-colors hover:text-foreground lg:min-h-0"
              >
                {/* Long address: allowed to wrap before the @ in a narrow column */}
                <span className="min-w-0">
                  {emailUser}
                  <wbr />@{emailDomain}
                </span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener"
                data-track="click_whatsapp"
                data-location="footer"
                className="inline-flex min-h-12 items-center transition-colors hover:text-foreground lg:min-h-0"
              >
                WhatsApp
              </a>
            </li>
          </ul>
          <DirectionsCTA location="footer" className="mt-4 px-5" />
          <p className="mt-3 text-xs">
            <a
              href={MAPS_PLACE_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center font-semibold text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              See us on Google ({GOOGLE_RATING}★ · {REVIEW_COUNT} reviews)
            </a>
          </p>
        </div>
        <div className="col-span-2 min-w-0 sm:col-span-1">
          <p className="eyebrow">Working Hours</p>
          {/* All seven days, full names — the same lines as the GBP profile */}
          <dl className="mt-3 grid grid-cols-[6rem_minmax(0,1fr)] gap-x-2 gap-y-1.5 text-xs text-muted-foreground lg:mt-4">
            {HOURS.map(({ long, closed }) => (
              <div key={long} className="col-span-2 grid grid-cols-subgrid">
                <dt className="font-semibold whitespace-nowrap text-foreground/80">{long}</dt>
                <dd className={closed ? "font-semibold text-amber-800" : "whitespace-nowrap"}>
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
          © 2021–{new Date().getFullYear()} {BUSINESS_NAME}
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
