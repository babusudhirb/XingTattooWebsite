import offer50OffEveryTattoo from "@/assets/offers/page/offer-50-off-every-tattoo.webp";
import offerGoBigSaveBigger from "@/assets/offers/page/offer-go-big-save-bigger.webp";
import offerMoreArtMoreYou from "@/assets/offers/page/offer-more-art-more-you.webp";

import type { FlashName } from "@/components/decor/TattooFlash";
import { OFFER, studioDate } from "@/data/business";

/** Current offer — shared by the home page popup and the /offer page. */
export const OFFER_LABEL = "Limited Time Offer";

/** Offer posters (800×800, from the studio's "offer photos"), in the studio's own order. */
export const OFFER_IMAGE_SIZE = 800;
export const offerImages = [
  {
    src: offer50OffEveryTattoo,
    alt: "50% off every tattoo — offer poster with black & grey and colour prices at Xing Premium Tattoo Studio, Brookefield",
  },
  {
    src: offerGoBigSaveBigger,
    alt: "Go big, save bigger — offer poster: bigger savings on sleeves and large tattoos at Xing Premium Tattoo Studio, Brookefield",
  },
  {
    src: offerMoreArtMoreYou,
    alt: "More art, more you — offer poster with first-tattoo, 10 sq. inch and couple tattoo prices at Xing Premium Tattoo Studio",
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
