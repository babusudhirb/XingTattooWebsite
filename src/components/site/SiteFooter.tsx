import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 text-xs text-muted-foreground">
            Custom tattoos. Premium hygiene. Unmatched artistry.
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
        <div className="col-span-2 sm:col-span-1">
          <p className="eyebrow">Contact Us</p>
          <ul className="mt-3 text-xs text-muted-foreground lg:mt-4 lg:space-y-2">
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              <a
                href={PHONE_TEL}
                className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground lg:min-h-0 lg:min-w-0"
              >
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <a
                href={EMAIL_TO}
                className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground lg:min-h-0 lg:min-w-0"
              >
                {EMAIL}
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-2 lg:min-h-0">
              <MapPin className="h-3.5 w-3.5" /> Brookefield, Bangalore, India
            </li>
          </ul>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="eyebrow">Working Hours</p>
          <ul className="mt-3 text-xs text-muted-foreground lg:mt-4 lg:space-y-2">
            <li className="py-1 lg:py-0">Mon: 10:00 AM – 9:00 PM</li>
            <li className="py-1 lg:py-0">Tue: Studio Cleanse & Rest Day</li>
            <li className="py-1 lg:py-0">Wed: 10:00 AM – 9:00 PM</li>
            <li className="py-1 lg:py-0">Thu: 10:00 AM – 9:00 PM</li>
            <li className="py-1 lg:py-0">Fri: 10:00 AM – 9:00 PM</li>
            <li className="py-1 lg:py-0">Sat: 10:00 AM – 9:00 PM</li>
            <li className="py-1 lg:py-0">Sun: 10:00 AM – 9:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-5 text-xs text-muted-foreground">
        <p>© 2021 XING Tattoo Studio. All Rights Reserved.</p>
        <p className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
        </p>
      </div>
    </footer>
  );
}
