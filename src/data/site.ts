import { Instagram, MessageCircle, Phone } from "lucide-react";

export const STUDIO_NAME = "XING Tattoo Studio";
export const PHONE_DISPLAY = "+91 8970007818";
export const PHONE_TEL = "tel:+918970007818";
export const WHATSAPP_URL = "https://wa.me/918970007818";
export const INSTAGRAM_URL = "https://www.instagram.com/xingtattoo_blr/";
export const EMAIL = "xingtattoo.aecs@gmail.com";
export const EMAIL_TO = `mailto:${EMAIL}`;
/** Opens the studio's Google Business profile (reviews). Swap for the exact
 *  "Share" link from Google Maps (maps.app.goo.gl/…) once available. */
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=XING+Tattoo+Studio+AECS+Layout+Brookefield+Bengaluru";
export const ADDRESS_LINE = "AECS Layout, Brookefield (60 Feet Rd, above DMART), Bengaluru";

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/about" },
  { label: "Artist", href: "/tattoo-artist" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/faq" },
];

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
