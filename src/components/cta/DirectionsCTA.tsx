import { Navigation } from "lucide-react";

import { BRAND_NAME, DIRECTIONS_URL } from "@/data/business";
import { cn } from "@/lib/utils";
import { BASE, ICON_ONLY, VARIANTS, type CtaVariant } from "./styles";

/** "Get Directions" — Google Maps directions to the studio. Fires `click_directions`. */
export function DirectionsCTA({
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
      href={DIRECTIONS_URL}
      target="_blank"
      rel="noopener"
      data-track="click_directions"
      data-location={location}
      aria-label={iconOnly ? `Get Directions to ${BRAND_NAME}` : undefined}
      className={cn(iconOnly ? ICON_ONLY : cn(BASE, VARIANTS[variant]), className)}
    >
      <Navigation className={iconOnly ? "h-5 w-5" : "h-4 w-4 shrink-0"} aria-hidden="true" />
      {!iconOnly && "Get Directions"}
    </a>
  );
}
