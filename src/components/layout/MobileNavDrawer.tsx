import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Instagram, Menu, X } from "lucide-react";
import {
  BUSINESS_NAME,
  HOURS_TEXT,
  INSTAGRAM_URL,
  MAPS_PLACE_URL,
  SHORT_ADDRESS,
} from "@/data/business";
import { isActiveHref, navLinks, SERVICES_HREF } from "@/data/navigation";
import { SERVICE_SLUGS, services } from "@/data/services";
import { BookingCta, CallCta, DirectionsCta, WhatsAppCta } from "@/components/cta";
import { Logo } from "@/components/layout/Logo";
import { useTodayHours } from "@/lib/openingHours";
import { useOfferActive } from "@/hooks/useOfferActive";

const ROW =
  "flex min-h-[52px] items-center justify-between gap-3 border-b border-border font-display text-base font-semibold tracking-wide";

/**
 * Phone & tablet navigation (below lg): a menu button in the header that
 * opens a full-height drawer with every page, every style and contact links.
 */
export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hours = useTodayHours();
  const offerActive = useOfferActive();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className="flex h-12 w-12 items-center justify-center rounded-sm border border-border transition-colors hover:bg-accent lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-0 z-[80] flex h-dvh w-full flex-col bg-background pt-[var(--sat)] pr-[var(--sar)] pb-[var(--sab)] pl-[var(--sal)] shadow-2xl sm:left-auto sm:w-[min(24rem,100vw)] data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div onClick={close}>
              <Logo />
            </div>
            <Dialog.Close
              aria-label="Close menu"
              className="flex h-12 w-12 items-center justify-center rounded-sm border border-border transition-colors hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Pages, tattoo styles and contact options
          </Dialog.Description>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            {/* Same order as the desktop header; the six styles sit under Services */}
            <ul>
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    onClick={close}
                    aria-current={isActiveHref(pathname, href) ? "page" : undefined}
                    className={`${ROW} aria-[current=page]:text-amber-800`}
                  >
                    {label}
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                  {href === SERVICES_HREF && (
                    <ul
                      aria-label="Tattoo styles"
                      className="grid grid-cols-2 gap-2 border-b border-border py-3"
                    >
                      {SERVICE_SLUGS.map((slug) => (
                        <li key={slug}>
                          <Link
                            to="/services/$slug"
                            params={{ slug }}
                            onClick={close}
                            className="flex min-h-12 items-center gap-2 rounded-sm border border-border p-1.5 pr-3 text-sm transition-colors hover:bg-accent"
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
                  )}
                </li>
              ))}
            </ul>
            {offerActive && (
              <Link
                to="/offer"
                data-track="click_offer"
                data-location="drawer"
                onClick={close}
                className="mt-3 flex min-h-12 items-center justify-between rounded-full border border-amber-400/30 bg-[#0b0a08] px-4 font-display text-xs font-bold tracking-[0.14em] text-amber-200 uppercase"
              >
                Offers
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            )}

            {/* NAP — same values as the footer and the GBP profile */}
            <div className="mt-6 rounded-sm border border-border p-4 text-sm">
              <p className="font-display font-semibold text-foreground">{BUSINESS_NAME}</p>
              <a
                href={MAPS_PLACE_URL}
                target="_blank"
                rel="noopener"
                className="mt-1 block text-muted-foreground underline-offset-4 hover:underline"
              >
                {SHORT_ADDRESS}
              </a>
              <p className="mt-2 min-h-5 font-medium" aria-live="polite">
                {hours?.status ?? HOURS_TEXT}
              </p>
              <CallCta location="drawer" className="mt-3 w-full" />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <WhatsAppCta location="drawer" className="px-3" />
                <DirectionsCta location="drawer" className="px-3" />
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" /> Instagram
              </a>
            </div>
          </nav>

          <div className="border-t border-border p-5">
            <BookingCta location="drawer" onClick={close} className="w-full" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
