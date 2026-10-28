import { ArrowRight } from "lucide-react";

import { openBookingModal } from "@/components/booking/BookingContext";
import { cn } from "@/lib/utils";
import { BASE, VARIANTS, type CtaVariant } from "./styles";

/** The only labels a booking button may show ("Book with Peace" on the artist page only). */
export type BookLabel = "Book Free Consultation" | "Book with Peace";

/**
 * Primary CTA: opens the booking form (free consultation). Fires
 * `click_book_consultation`; the form itself fires `generate_lead` on success.
 * `shortBelow` drops the word "Consultation" under that width ("Book Free"), so the
 * accessible name always equals what is visible — no duplicated hidden labels.
 */
export function BookCTA({
  location,
  label = "Book Free Consultation",
  style,
  shortBelow,
  variant = "primary",
  icon = true,
  className,
  onClick,
}: {
  location: string;
  label?: BookLabel;
  /** Pre-selects a tattoo style in the form. */
  style?: string;
  shortBelow?: "400" | "sm";
  variant?: CtaVariant;
  icon?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const text =
    label === "Book Free Consultation" && shortBelow ? (
      <>
        Book Free
        <span className={shortBelow === "400" ? "max-[399px]:hidden" : "max-sm:hidden"}>
          {" "}
          Consultation
        </span>
      </>
    ) : (
      label
    );
  return (
    <button
      type="button"
      data-track="click_book_consultation"
      data-location={location}
      onClick={() => {
        onClick?.();
        openBookingModal(style);
      }}
      className={cn(BASE, VARIANTS[variant], className)}
    >
      <span className="truncate">{text}</span>
      {icon && <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
    </button>
  );
}
