import offer1499 from "@/assets/offers/page/offer-1499.webp";
import offer50Off from "@/assets/offers/page/offer-50-off.webp";
import offerBigDiscount from "@/assets/offers/page/offer-big-discount.webp";

import type { FlashName } from "@/components/sections/TattooFlash";

/** Current offer — shared by the home page popup and the /offer page. */
export const OFFER_LABEL = "Limited Time Offer";
export const OFFER_ENDS_LABEL = "October 31";
/** Last day of the offer (inclusive, studio's local date). */
export const OFFER_ENDS = new Date(2026, 9, 31, 23, 59, 59);

export const offerImages = [
  {
    src: offer1499,
    alt: "More art, more you — lowest tattoo starting at ₹1,499, any tattoo up to 10 inch at only ₹2,499",
  },
  {
    src: offer50Off,
    alt: "Limited time offer — any tattoo up to 10 sq. inch at ₹2,499, 50% off: black & white ₹399, colour ₹499 per sq. inch",
  },
  {
    src: offerBigDiscount,
    alt: "Big tattoo, bigger discount — flat 10% off above ₹10K, 20% off above ₹20K, 30% off above ₹30K",
  },
];

/** Small pieces that fit the "any tattoo up to 10 sq. inch" offer; style pre-fills booking. */
export const OFFER_IDEAS: { label: string; style: string; icon: FlashName }[] = [
  { label: "Fine-line rose", style: "Minimalist", icon: "rose" },
  { label: "Mini compass", style: "Geometric", icon: "compass" },
  { label: "Moon & stars", style: "Minimalist", icon: "moon" },
  { label: "Heart & name banner", style: "Minimalist", icon: "heart" },
  { label: "Name or date script", style: "Minimalist", icon: "sparkle" },
  { label: "Om or Trishul", style: "Traditional", icon: "sparkle" },
  { label: "Mini dagger", style: "Black & Grey", icon: "dagger" },
];

/** Whole days left until the offer ends (0 on the last day), or undefined once it's over. */
export function offerDaysLeft(now = new Date()) {
  if (now > OFFER_ENDS) return undefined;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last = new Date(OFFER_ENDS.getFullYear(), OFFER_ENDS.getMonth(), OFFER_ENDS.getDate());
  return Math.round((last.getTime() - today.getTime()) / 86_400_000);
}
