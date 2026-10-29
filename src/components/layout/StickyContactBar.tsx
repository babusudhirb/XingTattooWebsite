import { BookingCta, CallCta, DirectionsCta, WhatsAppCta } from "@/components/cta";

/**
 * Phones only (below md): a thumb-reach action bar pinned to the bottom,
 * padded clear of the iPhone home indicator. Replaces the floating social dock.
 */
export function StickyContactBar() {
  return (
    <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pt-2 pr-[max(0.75rem,var(--sar))] pb-[calc(8px+var(--sab))] pl-[max(0.75rem,var(--sal))] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur transition-transform duration-200 md:hidden landscape-phone:block">
      <div className="mx-auto flex max-w-md items-center gap-2">
        <WhatsAppCta
          location="sticky_bar"
          iconOnly
          className="bg-[var(--brand-whatsapp)] text-white"
        />
        <CallCta location="sticky_bar" iconOnly className="bg-[var(--brand-call)] text-white" />
        <DirectionsCta
          location="sticky_bar"
          iconOnly
          className="border border-border bg-card text-foreground"
        />
        <BookingCta location="sticky_bar" shortBelow="400" className="min-w-0 flex-1 px-3" />
      </div>
    </div>
  );
}
