import { COUNTS, GOOGLE_RATING, HOURS_LONG, PHONE_DISPLAY } from "@/data/business";
import { services, type ServiceSlug } from "./services";

/** Facts about the studio's artist. Only confirmed details — no invented biography. */
export const ARTIST = {
  name: "Peace",
  fullName: "Chingri Awungshi",
  role: "Lead Tattoo Artist",
  yearsExperience: COUNTS.years,
  tattoosCompleted: COUNTS.tattoos,
  happyClients: COUNTS.clients,
  studioSince: COUNTS.since,
  googleRating: String(GOOGLE_RATING),
};

/** Tattoos and clients shown together everywhere: "1800+ tattoos for 1200+ happy clients". */
export const tattoosForClients = {
  value: ARTIST.tattoosCompleted,
  label: `Tattoos for ${ARTIST.happyClients} happy clients`,
  wide: true,
};

export const artistMilestones = [
  { value: `${ARTIST.yearsExperience} yrs`, label: "Behind the machine" },
  tattoosForClients,
  { value: `${ARTIST.googleRating}★`, label: "Google rating" },
  { value: ARTIST.studioSince, label: "Opened Xing" },
];

/** What Peace brings to each style — links to the matching service page. */
export const artistStyles: { slug: ServiceSlug; title: string; text: string }[] = [
  {
    slug: "realism",
    title: "Realism",
    text: "Layered shading and contrast that reads like a photograph — statues, wildlife and deities with real depth.",
  },
  {
    slug: "portrait",
    title: "Portraits",
    text: "Faces of people and pets built from your reference photo, with the eyes and expression treated as the priority.",
  },
  {
    slug: "black-grey",
    title: "Black & Grey",
    text: "Smooth grey washes and deep blacks for sleeves, back pieces and cover-ups that age evenly.",
  },
  {
    slug: "minimalist",
    title: "Fine-Line & Minimal",
    text: "Single-needle linework, script and small symbols — clean, precise and perfect for first tattoos.",
  },
  {
    slug: "geometric",
    title: "Geometric & Mandala",
    text: "Stencils mapped to your body's curve so symmetry holds, from mandalas to sacred geometry.",
  },
  {
    slug: "traditional",
    title: "Indian Traditional",
    text: "Shiva, Ganesha, Om, Trishul and Sanskrit script — drawn with respect for the meaning and placement.",
  },
];

/** A cross-section of work from the service galleries, all done at Xing. */
const pick = (slug: ServiceSlug, i: number) => {
  const image = services[slug].galleryImages[i];
  if (!image) throw new Error(`Missing gallery image ${slug}[${i}]`);
  return { img: image.src, alt: image.alt, tag: services[slug].shortName };
};

export const artistSignatureWork = [
  pick("realism", 4),
  pick("portrait", 1),
  pick("geometric", 2),
  pick("minimalist", 7),
  pick("realism", 2),
  pick("portrait", 0),
  pick("traditional", 1),
  pick("minimalist", 9),
];

export const artistBookingSteps = [
  {
    title: "Send Your Idea",
    text: "Use the booking form or WhatsApp. A reference photo, the placement you have in mind and a rough size is plenty to start.",
  },
  {
    title: "Consult & Quote",
    text: "Free, no obligation. Peace talks through placement, size and how the design will age, then gives you a clear quote.",
  },
  {
    title: "Design Review",
    text: "Your design is drawn from scratch. You see it and request changes before anything is booked in.",
  },
  {
    title: "Session Day",
    text: "Eat well, stay hydrated and wear clothes that give easy access to the area. Breaks whenever you need them.",
  },
];

export const artistFaqs = [
  {
    question: "Who is the tattoo artist at Xing Premium Tattoo Studio, Brookefield?",
    answer:
      `Xing Premium Tattoo Studio's lead tattoo artist is Peace (Chingri Awungshi), with ${COUNTS.years} years of experience and ${COUNTS.tattoos} tattoos completed. Every tattoo at the studio is designed and done by Peace personally.`,
  },
  {
    question: "Can I choose Peace to do my tattoo?",
    answer:
      "Yes — you don't need to request it. Every consultation, design and session at Xing Premium Tattoo Studio is handled by Peace, so there are no handoffs between artists.",
  },
  {
    question: "What tattoo styles does Peace specialise in?",
    answer:
      "Realism, portraits, black & grey, fine-line and minimalist work, geometric and mandala designs, and Indian traditional tattoos such as Shiva, Ganesha, Om and Sanskrit script.",
  },
  {
    question: "Does Peace design custom tattoos or use flash designs?",
    answer:
      "Every design is drawn from scratch for you. You can bring reference images — they're used as a starting point, and the final design is made to fit your body and placement.",
  },
  {
    question: "Is Peace a good choice for a first tattoo?",
    answer:
      "Many of Peace's Google reviews come from first-timers who mention feeling comfortable throughout the session and getting clear aftercare advice. Small fine-line pieces are a popular first choice.",
  },
  {
    question: "How do I book an appointment with Peace?",
    answer:
      `Use the Book Consultation form on this site, message ${PHONE_DISPLAY} on WhatsApp, or visit the studio in AECS Layout, Brookefield. Hours: ${HOURS_LONG}.`,
  },
];
