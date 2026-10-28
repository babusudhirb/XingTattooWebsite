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
    question: "Where is Xing Premium Tattoo Studio located?",
    answer:
      `${ADDRESS.full} — about 3 km from Marathahalli.`,
  },
  {
    question: "What are the studio's opening hours?",
    answer:
      `${HOURS_LONG}. Tuesday is the studio's cleaning and rest day.`,
  },
  {
    question: "Do I need an appointment, or can I walk in?",
    answer:
      "Appointments are preferred so your design can be prepared in advance, but walk-ins are welcome when the artist is free.",
  },
  {
    question: "Is the consultation free?",
    answer:
      `Yes. Consultations are free and there's no obligation — in the studio or over WhatsApp on ${PHONE_DISPLAY}.`,
  },
  {
    question: "What is the minimum age to get a tattoo at Xing Premium Tattoo Studio?",
    answer: "You must be 18 or older to get tattooed at the studio.",
  },
  {
    question: "How does Xing Premium Tattoo Studio keep tattoos safe and hygienic?",
    answer:
      "Single-use needles opened in front of you, sealed US-imported inks, medical-grade sterilisation and barrier protection on all equipment, with the workstation fully cleaned between every client.",
  },
];
