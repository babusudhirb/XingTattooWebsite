import { Phone } from "lucide-react";

import { BRAND_NAME, PHONE_DISPLAY, PHONE_TEL } from "@/data/business";
import { cn } from "@/lib/utils";
import { BASE, ICON_ONLY, VARIANTS, type CtaVariant } from "./styles";

/** "Call +91 89700 07818" (icon-only in the sticky bar). Fires `click_call`. */
export function CallCTA({
  location,
  variant = "secondary",
  iconOnly = false,
  className,
}: {
  location: string;
  variant?: CtaVariant;
  iconOnly?: boolean;
  className?: string;
}) {
  return (
    <a
      href={PHONE_TEL}
      data-track="click_call"
      data-location={location}
      aria-label={iconOnly ? `Call ${BRAND_NAME}` : undefined}
      className={cn(iconOnly ? ICON_ONLY : cn(BASE, VARIANTS[variant]), className)}
    >
      <Phone className={iconOnly ? "h-5 w-5" : "h-4 w-4 shrink-0"} aria-hidden="true" />
      {!iconOnly && `Call ${PHONE_DISPLAY}`}
    </a>
  );
}
