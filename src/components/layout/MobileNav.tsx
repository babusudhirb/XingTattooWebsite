import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Instagram, Menu, MessageCircle, Navigation, Phone, X } from "lucide-react";

import {
  DIRECTIONS_URL,
  INSTAGRAM_URL,
  isActiveHref,
  navLinks,
  PHONE_DISPLAY,
  PHONE_TEL,
  STUDIO_NAME,
  WHATSAPP_URL,
} from "@/data/site";
import { SERVICE_SLUGS, services } from "@/data/services";
import { openBookingModal } from "@/components/booking/BookingContext";
import { Logo } from "@/components/layout/Logo";
import { useOfferActive } from "@/lib/offer";

const ROW =
  "flex min-h-12 items-center justify-between gap-3 border-b border-border font-display text-base font-semibold tracking-wide";

/**
 * Phone & tablet navigation (below lg): a menu button in the header that
 * opens a full-height drawer with every page, every style and contact links.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const offerActive = useOfferActive();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-sm border border-border transition-colors hover:bg-accent lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[80] flex w-[min(22rem,100vw)] flex-col bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-2xl data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div onClick={close}>
              <Logo />
            </div>
            <Dialog.Close
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-border transition-colors hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Pages, tattoo styles and contact options
          </Dialog.Description>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            {/* Same order as the desktop header */}
            <ul>
              {navLinks.slice(0, 1).map(({ label, href }) => (
                <li key={href}>
                  <a href={href} onClick={close} className={ROW}>
                    {label}
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                </li>
              ))}
              <li>
                <Link to="/services" onClick={close} className={ROW}>
                  Tattoo Designs
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
              {navLinks.slice(1).map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={close}
                    aria-current={isActiveHref(pathname, href) ? "page" : undefined}
                    className={`${ROW} aria-[current=page]:text-amber-800`}
                  >
                    {label}
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
            <Link
              to="/offer"
              onClick={close}
              className="mt-3 flex min-h-12 items-center justify-between rounded-full border border-amber-400/30 bg-[#0b0a08] px-4 font-display text-xs font-bold tracking-[0.14em] text-amber-200 uppercase"
            >
              Offers
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>

            <p className="eyebrow mt-6">Tattoo Styles</p>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {SERVICE_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug }}
                    onClick={close}
                    className="flex min-h-11 items-center gap-2 rounded-sm border border-border p-1.5 pr-3 text-sm transition-colors hover:bg-accent"
                  >
                    <img
                      src={services[slug].thumbImage}
                      width={32}
                      height={32}
                      loading="lazy"
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-8 shrink-0 rounded-sm object-cover"
                    />
                    {services[slug].shortName}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <a
                href={PHONE_TEL}
                className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-full border border-border text-xs font-bold"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-full border border-border text-xs font-bold"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-full border border-border text-xs font-bold"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              <span className="block font-semibold text-foreground/80">{STUDIO_NAME}</span>
              {PHONE_DISPLAY}
            </p>
          </nav>

          <div className="border-t border-border p-5">
            <button
              onClick={() => {
                close();
                openBookingModal();
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-display text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase"
            >
              Book Free Consultation <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Phones only (below md): a thumb-reach action bar pinned to the bottom,
 * padded clear of the iPhone home indicator. Replaces the floating social dock.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: "var(--brand-whatsapp)" }}
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <a
          href={PHONE_TEL}
          aria-label={`Call ${PHONE_DISPLAY}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: "var(--brand-call)" }}
        >
          <Phone className="h-5 w-5" />
        </a>
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get directions to the studio"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground"
        >
          <Navigation className="h-5 w-5" />
        </a>
        <button
          onClick={() => openBookingModal()}
          className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-3 font-display text-xs font-bold tracking-[0.12em] text-primary-foreground uppercase"
        >
          <span className="truncate">
            <span className="min-[400px]:hidden">Book Free</span>
            <span className="hidden min-[400px]:inline">Book Free Consultation</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
