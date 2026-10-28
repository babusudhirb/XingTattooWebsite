/** Content for the /about page. Facts only from the studio's own site and public listings. */
import { ADDRESS, HOURS_LONG, PHONE_DISPLAY } from "@/data/business";

export const aboutValues = [
  {
    title: "Design Before Ink",
    text: "Nothing goes on skin until the design is right. Every piece is sketched from scratch, sized to your body and reviewed with you first.",
  },
  {
    title: "Clinic-Level Hygiene",
    text: "Single-use needles opened in front of you, sealed skin-tested inks and a sterilised, barrier-wrapped workstation for every client.",
  },
  {
    title: "One Artist, Full Attention",
    text: "Every consultation, stencil and session is handled by Peace personally — no handoffs, no rotating chairs.",
  },
  {
    title: "Honest Advice",
    text: "Straight answers on size, placement and how a design will age, even when that means reworking the idea.",
  },
  {
    title: "Respect For Meaning",
    text: "Memorials, deities, names and scripts are treated with care — spelling checked, placement discussed, symbolism respected.",
  },
  {
    title: "Aftercare That Continues",
    text: "Clear aftercare guidance to take home, and a free touch-up if any part of your tattoo heals unevenly.",
  },
];

export const hygieneStandards = [
  "100% single-use, disposable needles — opened in front of you",
  "Sealed, skin-tested inks imported from the US",
  "Medical-grade sterilisation for every reusable tool",
  "Barrier film on the machine, cables, bottles and workstation",
  "Workstation fully cleaned and re-wrapped between every client",
  "Health-regulation hygiene guidelines followed at every session",
];

export const visitLandmarks = [
  ADDRESS.landmark,
  "In AECS Layout, Brookefield",
  "About 3 km from Marathahalli",
  "Easy reach from Whitefield and ITPL",
];

export const aboutFaqs = [
  {
    question: "What landmark helps me find Xing Premium Tattoo Studio?",
    answer:
      `Look for DMART Ready on 60 Feet Road in AECS Layout, Brookefield: the studio is right above it, in SV Plaza. The full address is ${ADDRESS.full}. Tap Get Directions on this page for a Google Maps route to the door.`,
  },
  {
    question: "When is Xing Premium Tattoo Studio open?",
    answer:
      `${HOURS_LONG}. Tuesday is the studio's cleaning and rest day, so on weekdays plan your visit for Monday or Wednesday to Friday. Saturdays and Sundays follow the same hours. The hours on this site match the studio's Google Business Profile.`,
  },
  {
    question: "Can I walk in without an appointment?",
    answer:
      `Yes, walk-ins are welcome when the artist is free, but appointments are preferred so your design can be drawn and prepared in advance. Small, simple pieces are the easiest to fit in on the day. Message ${PHONE_DISPLAY} on WhatsApp before you come to check availability and avoid a wait.`,
  },
  {
    question: "Which payment methods does the studio accept?",
    answer:
      "The studio accepts credit cards, debit cards and Google Pay, including MasterCard and VISA, as listed on its Google Business Profile. There's nothing to pay for the consultation, which is free with no obligation. You'll get a clear quote before your session is booked, so you know exactly what you're paying for.",
  },
];
