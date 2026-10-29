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

/** The one site navigation, in order — header, drawer and footer. Services opens the six
 *  style pages (dropdown on desktop, sub-list in the drawer); Offers follows while one runs. */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Artist", href: "/tattoo-artist" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
export const SERVICES_HREF = "/services";

/** Footer "Studio" column. */
export const studioLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "Artist", href: "/tattoo-artist" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
] as const;

/** Page links (not #anchors) are active on their own URL and everything below it. */
export function isActiveHref(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
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
