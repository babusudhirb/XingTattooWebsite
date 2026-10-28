import offer1499 from "@/assets/offers/page/offer-1499.webp";
import offer50Off from "@/assets/offers/page/offer-50-off.webp";
import offerBigDiscount from "@/assets/offers/page/offer-big-discount.webp";

import type { FlashName } from "@/components/sections/TattooFlash";
import { OFFER, studioDate } from "@/data/business";

/** Current offer — shared by the home page popup and the /offer page. */
export const OFFER_LABEL = "Limited Time Offer";
export const OFFER_ENDS_LABEL = OFFER.endsLabel;

export const offerImages = [
  {
    src: offer1499,
    alt: "More art, more you — tattoo offer poster from Xing Premium Tattoo Studio, Brookefield",
  },
  {
    src: offer50Off,
    alt: "Limited time offer poster — up to 50% off custom tattoos at Xing Premium Tattoo Studio, Brookefield",
  },
  {
    src: offerBigDiscount,
    alt: "Big tattoo, bigger discount — offer poster for larger pieces at Xing Premium Tattoo Studio, Brookefield",
  },
];

/** Small pieces that fit the "any tattoo up to 10 sq. inch" offer; style pre-fills booking. */
export const OFFER_IDEAS: { label: string; style: string; icon: FlashName }[] = [
  { label: "Fine-line rose", style: "Minimalist", icon: "rose" },
  { label: "Mini compass", style: "Geometric", icon: "compass" },
  { label: "Moon & stars", style: "Minimalist", icon: "moon" },
  { label: "Heart & name banner", style: "Minimalist", icon: "heart" },
  { label: "Name or date script", style: "Minimalist", icon: "sparkle" },
  { label: "Om or Trishul", style: "Indian Traditional", icon: "sparkle" },
  { label: "Mini dagger", style: "Black & Grey", icon: "dagger" },
];

/** Whole days left until the offer ends (0 on the last day, India time), or undefined once it's over. */
export function offerDaysLeft(now = new Date()) {
  const today = studioDate(now);
  if (today > OFFER.validThrough) return undefined;
  const ms = Date.parse(`${OFFER.validThrough}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}
