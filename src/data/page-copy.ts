import {
  ADDRESS,
  COUNTS,
  GOOGLE_RATING,
  HOURS_LONG,
  OFFER,
  PHONE_DISPLAY,
} from "@/data/business";
import type { FaqItem } from "@/components/faq/FaqSection";

/**
 * Page copy for local search and voice answers: each page's FAQ set (shown in the
 * accordion AND emitted as FAQPage JSON-LD from the same array) and one question-led
 * "quick answer" section per page. Facts only from the data files — no prices, no
 * distances or claims that aren't already on the site.
 */

/** /services — 4 questions not asked on any other page. */
export const servicesFaqs: FaqItem[] = [
  {
    question: "Which tattoo style is right for me?",
    answer:
      "Start with what the tattoo should say and where it will go. Realism and portraits suit larger areas with room for detail, fine-line and minimalist work suits small, subtle pieces, and geometric or Indian traditional designs suit symbols and patterns. At a free consultation, Peace helps you choose the style, size and placement.",
  },
  {
    question: "Can I combine two tattoo styles in one design?",
    answer:
      "Yes. Styles are often combined: Indian traditional pieces are frequently paired with mandala or lotus motifs, and black & grey shading is used in realism and portrait work. Bring your references to the consultation and Peace will sketch a single custom design that blends them, then adjust it with you before your session.",
  },
  {
    question: "Is every design custom-made, whatever the style?",
    answer:
      "Yes. Every tattoo at Xing Premium Tattoo Studio is drawn from scratch by Peace, whichever style you choose. Reference images are welcome as a starting point, and the final artwork is sized to your body and placement. You review the design and can request changes before anything is booked or stencilled.",
  },
  {
    question: "Do you do cover-ups and touch-ups for every style?",
    answer:
      "Cover-ups and reworks are assessed one by one at the consultation; black & grey shading is especially good at covering faded ink, and the new design usually needs to be a little larger and darker. Every new tattoo also comes with one free touch-up within 45–60 days if any part heals unevenly.",
  },
];

/** /offer — shown (with FAQPage schema) only while the offer is valid. */
export const offerFaqs: FaqItem[] = [
  {
    question: "How long is the tattoo offer valid?",
    answer: `The studio's current offer, up to 50% off custom tattoos, is valid from ${OFFER.startsLabel} until ${OFFER.endsLabel}, India time. Claim it within that window to use it. After it ends, consultations stay free, and any new offer is announced on the home page and on the studio's Google Business Profile.`,
  },
  {
    question: "How do I claim the tattoo offer?",
    answer:
      "Tap Claim offer on this page, choose the offer that fits your idea and leave your name and phone or WhatsApp number, or send the claim straight to the studio on WhatsApp. The studio gets back to you to set up a free consultation, where Peace confirms which offer applies to your design.",
  },
  {
    question: "Do I need to book in advance to use the offer?",
    answer: `Booking ahead is the best way to use it. Appointments are preferred so your design can be drawn before the session, although walk-ins are welcome when the artist is free. Book a free consultation online or message ${PHONE_DISPLAY} on WhatsApp to pick a time that suits you before the offer ends.`,
  },
];

export interface QuickAnswer {
  question: string;
  /** Short paragraphs; the first answers the question directly (speakable). */
  paragraphs: string[];
}

/** Home: the local "near me" question. */
export const homeQuickAnswer: QuickAnswer = {
  question: "Looking for a tattoo studio near Whitefield or Marathahalli?",
  paragraphs: [
    `Xing Premium Tattoo Studio is ${ADDRESS.landmark}, on 60 Feet Road, Bengaluru, Karnataka. Look for the DMART Ready store: the studio is on the floor above it.`,
    `Every tattoo is designed and done by Peace (Chingri Awungshi), who has ${COUNTS.years} years of experience, and the studio is rated ${GOOGLE_RATING}★ on Google. It's open ${HOURS_LONG}.`,
    `Consultations are free, so you can talk through your idea, size and placement before booking anything.`,
  ],
};

/** Artist page. */
export const artistQuickAnswer: QuickAnswer = {
  question: "Who will design and do my tattoo?",
  paragraphs: [
    `Peace (Chingri Awungshi) designs and does every tattoo at Xing Premium Tattoo Studio. He is the person you meet at the free consultation, the person who draws your design from scratch and the person who tattoos it, so there are no handoffs between artists.`,
    `He has ${COUNTS.years} years of experience and ${COUNTS.tattoos} tattoos completed, and the studio in AECS Layout, Brookefield, is rated ${GOOGLE_RATING}★ on Google.`,
    `Bring your references and placement ideas, and Peace will talk you through size, healing and aftercare before anything is booked.`,
  ],
};

/** About page — with a Directions CTA. */
export const aboutQuickAnswer: QuickAnswer = {
  question: "Where exactly is Xing Premium Tattoo Studio?",
  paragraphs: [
    `Xing Premium Tattoo Studio is at ${ADDRESS.full}.`,
    `The studio is ${ADDRESS.landmark}, on 60 Feet Road; the DMART Ready store front is the easiest landmark to spot. It's about 3 km from Marathahalli and an easy trip from Whitefield.`,
    `The studio is open ${HOURS_LONG}. Tap Get Directions for a Google Maps route, or message us on WhatsApp if you need help finding the entrance.`,
  ],
};

const SESSION: Record<string, { style: string; time: string; detail: string }> = {
  realism: {
    style: "realism",
    time: "usually takes 3–7 hours per sitting",
    detail:
      "A small piece can be finished in one sitting, while a forearm or larger design is often split across two or more sessions, with healing time in between.",
  },
  portrait: {
    style: "portrait",
    time: "usually takes 3–7 hours per sitting",
    detail:
      "A single small face can often be finished in one sitting; larger or multi-person portraits are split across sessions, with healing time in between.",
  },
  "black-grey": {
    style: "black & grey",
    time: "takes anywhere from one short sitting to several sessions",
    detail:
      "Smaller shaded pieces often fit in a single sitting, while detailed black & grey realism runs 3–7 hours per sitting and larger work is split across sessions.",
  },
  geometric: {
    style: "geometric or mandala",
    time: "usually takes 1.5–4 hours",
    detail:
      "Exact symmetry needs careful stencil placement before tattooing starts, so allow extra time for that. Sleeves and large patterns are split across several sessions.",
  },
  traditional: {
    style: "Indian traditional",
    time: "usually takes 1.5–4 hours",
    detail:
      "A small Om or Trishul is at the shorter end; a detailed deity piece with mandala or lotus work takes longer and may be split into two sessions.",
  },
  minimalist: {
    style: "minimalist or fine-line",
    time: "usually takes about 30 minutes to 1.5 hours",
    detail:
      "Most small symbols, dates and script pieces are finished in one sitting, which is why they're a popular first tattoo.",
  },
};

/** Service pages: "How long does a <style> tattoo take?" */
export function serviceQuickAnswer(slug: string): QuickAnswer | undefined {
  const s = SESSION[slug];
  if (!s) return undefined;
  const a = /^[aeiouAEIOU]/.test(s.style) ? "an" : "a";
  return {
    question: `How long does ${a} ${s.style} tattoo take?`,
    paragraphs: [
      `${a === "an" ? "An" : "A"} ${s.style} tattoo at Xing Premium Tattoo Studio in Brookefield, Bengaluru, ${s.time}, depending on size, detail and placement.`,
      s.detail,
      `Peace (Chingri Awungshi) gives you a time estimate at your free consultation. Breaks are built in, and you can pause whenever you need to. Eat a proper meal beforehand and keep the day free so nothing feels rushed.`,
    ],
  };
}
