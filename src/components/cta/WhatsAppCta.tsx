import { MessageCircle } from "lucide-react";

import { BRAND_NAME, WHATSAPP_CHAT_URL } from "@/data/business";
import { cn } from "@/lib/utils";
import { BASE, ICON_ONLY, VARIANTS, type CtaVariant } from "./ctaStyles";

/** "WhatsApp" — opens a chat with the consultation message. Fires `click_whatsapp`. */
export function WhatsAppCta({
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
      href={WHATSAPP_CHAT_URL}
      target="_blank"
      rel="noopener"
      data-track="click_whatsapp"
      data-location={location}
      aria-label={iconOnly ? `WhatsApp ${BRAND_NAME}` : undefined}
      className={cn(iconOnly ? ICON_ONLY : cn(BASE, VARIANTS[variant]), className)}
    >
      <MessageCircle className={iconOnly ? "h-5 w-5" : "h-4 w-4 shrink-0"} aria-hidden="true" />
      {!iconOnly && "WhatsApp"}
    </a>
  );
}
