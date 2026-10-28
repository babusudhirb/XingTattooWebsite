import { Instagram, MessageCircle, Phone } from "lucide-react";

import {
  ADDRESS,
  BRAND_NAME,
  EMAIL,
  INSTAGRAM_URL,
  MAPS_PLACE_URL,
  PHONE_TEL,
  WHATSAPP_URL,
} from "@/data/business";

// Contact details live in data/business.ts (the GBP source of truth); re-exported here
// so components keep one import path.
export {
  EMAIL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
  DIRECTIONS_URL,
  MAPS_PLACE_URL,
} from "@/data/business";
export const STUDIO_NAME = BRAND_NAME;
export const EMAIL_TO = `mailto:${EMAIL}`;
/** Opens the studio's Google Business profile (reviews). */
export const GOOGLE_REVIEWS_URL = MAPS_PLACE_URL;
export const ADDRESS_LINE = ADDRESS.full;

/** Header order: Home, Tattoo Designs (dropdown), the rest of these, then Offers. */
export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Artist", href: "/tattoo-artist" },
  { label: "Gallery", href: "/#gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
];

/** Page links (not #anchors) are active on their own URL and everything below it. */
export function isActiveHref(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const socials = [
  {
    icon: Instagram,
    label: "Instagram",
    href: INSTAGRAM_URL,
    style: { background: "var(--gradient-instagram)" },
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: WHATSAPP_URL,
    style: { background: "var(--brand-whatsapp)" },
  },
  {
    icon: Phone,
    label: "Call Us",
    href: PHONE_TEL,
    style: { background: "var(--brand-call)" },
  },
];
