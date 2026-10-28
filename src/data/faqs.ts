import { ADDRESS, COUNTS, HOURS_LONG, PHONE_DISPLAY } from "@/data/business";

/**
 * Studio FAQs. Each entry has a stable `id` (its URL anchor, e.g. /faq#tattoo-cost)
 * and `related` ids — the follow-up questions its answer naturally raises.
 * Facts only from the studio's own pages; no invented policies or prices.
 */

export type FaqCategoryId = "booking" | "safety" | "session" | "design" | "aftercare" | "studio";

export interface Faq {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
  related: string[];
  /** Optional in-site link that helps act on the answer. */
  link?: { label: string; to: string };
}

export const faqCategories: { id: FaqCategoryId; label: string; intro: string }[] = [
  {
    id: "booking",
    label: "Booking & Pricing",
    intro: "How to book, what it costs and what to bring to your consultation.",
  },
  {
    id: "safety",
    label: "Pain & Safety",
    intro: "What a tattoo feels like and how we keep every session safe.",
  },
  {
    id: "session",
    label: "First Tattoo & Session Day",
    intro: "Preparing for your appointment and choosing your first piece.",
  },
  {
    id: "design",
    label: "Designs & Styles",
    intro: "Custom artwork, changes, cover-ups and script.",
  },
  {
    id: "aftercare",
    label: "Aftercare & Healing",
    intro: "Looking after new ink so it heals clean and stays sharp.",
  },
  {
    id: "studio",
    label: "Studio & Visit",
    intro: "Where we are, when we're open and who does the work.",
  },
];

export const faqs: Faq[] = [
  // ── Booking & Pricing ──────────────────────────────────────────────
  {
    id: "how-to-book",
    category: "booking",
    question: "How do I book a tattoo appointment at Xing Premium Tattoo Studio?",
    answer:
      `Tap Book Free Consultation on this site, message us on WhatsApp at ${PHONE_DISPLAY}, or visit the studio in AECS Layout, Brookefield. Share your idea, placement and rough size. We'll set up a free consultation first, then book your session once you're happy with the design and the date suits you.`,
    related: ["free-consultation", "what-to-bring", "walk-ins"],
  },
  {
    id: "free-consultation",
    category: "booking",
    question: "Is the tattoo consultation really free?",
    answer:
      "Yes. Consultations are free with no obligation — in the studio or over WhatsApp. We talk through your idea, placement, size and how the design will age, then give you a clear quote. There's nothing to pay until you decide to go ahead.",
    related: ["tattoo-cost", "custom-design", "what-to-bring"],
  },
  {
    id: "tattoo-cost",
    category: "booking",
    question: "How much does a tattoo cost in Brookefield, Bengaluru?",
    answer:
      "Price depends on size, detail, style and placement, so a small fine-line symbol costs far less than a realism sleeve. You'll get an exact quote at your free consultation, before anything is booked and with no obligation to go ahead. Any current studio offer is shown on our home page and on the offer page.",
    related: ["free-consultation", "session-length", "touch-ups"],
  },
  {
    id: "walk-ins",
    category: "booking",
    question: "Do you accept walk-in tattoos?",
    answer:
      "Walk-ins are welcome when the artist is free, but appointments are preferred so your design can be drawn and prepared properly in advance. Small, simple pieces are the most likely to fit in on the day. To avoid a wait, message us on WhatsApp before you come in. The studio is closed on Tuesdays.",
    related: ["opening-hours", "how-to-book"],
  },
  {
    id: "what-to-bring",
    category: "booking",
    question: "What should I bring to my tattoo consultation?",
    answer:
      "Bring reference images, an idea of the placement and rough size, and a budget if you have one. For names, dates or script, bring the exact spelling or the original source. You'll also need a photo ID showing you're 18 or older. A clear idea of size helps us give you an accurate quote.",
    related: ["custom-design", "script-accuracy", "minimum-age"],
  },

  // ── Pain & Safety ──────────────────────────────────────────────────
  {
    id: "does-it-hurt",
    category: "safety",
    question: "Does getting a tattoo hurt?",
    answer:
      "There is some discomfort — most people describe it as a scratching or stinging sensation. Pain tolerance varies, and bony or thin-skinned areas are more sensitive. We keep a steady, careful pace and you can take a break whenever you need one.",
    related: ["most-painful-spots", "prepare-for-session", "first-tattoo"],
  },
  {
    id: "most-painful-spots",
    category: "safety",
    question: "Which parts of the body hurt most to tattoo?",
    answer:
      "Ribs, spine, feet, hands, elbows and the inner bicep tend to be the most sensitive. The outer forearm, upper arm, calf and thigh are usually the most comfortable, which is why they're popular for first tattoos. If you're nervous about pain, start with a comfortable area and a smaller design, and take breaks whenever you need them.",
    related: ["does-it-hurt", "first-tattoo-placement"],
  },
  {
    id: "hygiene",
    category: "safety",
    question: "Is Xing Premium Tattoo Studio hygienic and safe?",
    answer:
      "Yes. We use 100% single-use needles opened in front of you, sealed skin-tested inks, medical-grade sterilisation and barrier film on all equipment. The workstation is fully cleaned and re-wrapped between every client. You're welcome to ask about any step of the process at your consultation or before your session starts.",
    related: ["inks", "medical-conditions"],
    link: { label: "Read our hygiene standards", to: "/about#hygiene" },
  },
  {
    id: "inks",
    category: "safety",
    question: "What tattoo inks do you use?",
    answer:
      "We use premium, skin-tested inks imported from the US, opened sealed for your session. Quality pigments hold deep blacks and smooth shading through healing and fade more slowly over the years. If you have a known skin allergy or sensitivity, tell us at your consultation so we can talk it through before you book.",
    related: ["hygiene", "tattoo-fading"],
  },
  {
    id: "medical-conditions",
    category: "safety",
    question: "Can I get a tattoo if I have a medical condition or I'm pregnant?",
    answer:
      "Tell us about any medical condition, allergy or medication (especially blood thinners) before your session, and check with your doctor first. If you're pregnant or breastfeeding, it's safest to wait until afterwards. Bring up anything relevant at your free consultation; it stays private, and it helps us plan a safe session for you.",
    related: ["hygiene", "prepare-for-session"],
  },
  {
    id: "minimum-age",
    category: "safety",
    question: "What is the minimum age to get a tattoo at Xing Premium Tattoo Studio?",
    answer:
      "You must be 18 or older to get tattooed at Xing Premium Tattoo Studio, and we may ask for a photo ID. This applies to every tattoo, however small. Please bring a valid photo ID showing your date of birth to your consultation and to your session, so there's no delay on the day.",
    related: ["what-to-bring", "first-tattoo"],
  },

  // ── First Tattoo & Session Day ─────────────────────────────────────
  {
    id: "prepare-for-session",
    category: "session",
    question: "How should I prepare for my tattoo session?",
    answer:
      "Sleep well, eat a proper meal beforehand and stay hydrated. Avoid alcohol for 24 hours before, wear loose clothing that gives easy access to the area, and bring a snack and water for longer sessions. Tell us about any medication in advance, and arrive on time so the stencil can be placed without rushing.",
    related: ["does-it-hurt", "session-length", "aftercare-basics"],
  },
  {
    id: "session-length",
    category: "session",
    question: "How long does a tattoo session take?",
    answer:
      "Small minimalist pieces take about 30 minutes to 1.5 hours. Geometric and traditional work usually takes 1.5–4 hours, and realism or portraits 3–7 hours per sitting. Sleeves and large pieces are split across several sessions with healing time in between.",
    related: ["tattoo-cost", "prepare-for-session"],
  },
  {
    id: "first-tattoo",
    category: "session",
    question: "I'm getting my first tattoo — what should I choose?",
    answer:
      "Many first-timers start with a small fine-line or minimalist piece: shorter session, lower discomfort and quick healing. Choose something meaningful, and use the free consultation to talk through size and placement — there are no silly questions. Peace will explain how the design will heal and age before anything starts.",
    related: ["first-tattoo-placement", "does-it-hurt", "custom-design"],
    link: { label: "Explore minimalist & fine-line tattoos", to: "/services/minimalist" },
  },
  {
    id: "first-tattoo-placement",
    category: "session",
    question: "Where is the best placement for a first tattoo?",
    answer:
      "The outer forearm, upper arm, calf, ankle and wrist are popular first placements: comfortable to tattoo, easy to care for and easy to show or cover. Think about whether you want it visible at work. If you're unsure, we place the stencil first so you can see the size and position before you commit.",
    related: ["most-painful-spots", "first-tattoo"],
  },

  // ── Designs & Styles ───────────────────────────────────────────────
  {
    id: "custom-design",
    category: "design",
    question: "Do you create custom tattoo designs?",
    answer:
      "Yes — every design at Xing Premium Tattoo Studio is drawn from scratch by our artist, Peace. Reference images are welcome as a starting point, and the final artwork is sized and shaped to fit your body and placement. You'll see the design and can ask for changes before your session.",
    related: ["design-changes", "styles-offered", "what-to-bring"],
    link: { label: "Meet the artist", to: "/tattoo-artist" },
  },
  {
    id: "design-changes",
    category: "design",
    question: "Can I see and change my design before I get tattooed?",
    answer:
      "Absolutely. You review the design before your session is booked and can request changes to size, detail or placement. We only start once you're completely happy with it. On the day, the stencil goes on first, so you can check the size and position on your skin before any tattooing begins.",
    related: ["custom-design", "how-to-book"],
  },
  {
    id: "styles-offered",
    category: "design",
    question: "What tattoo styles does Xing Premium Tattoo Studio specialise in?",
    answer:
      "Realism, portraits, black & grey, fine-line and minimalist work, geometric and mandala designs, and Indian traditional tattoos such as Shiva, Ganesha, Om and Sanskrit script. Peace also takes on cover-ups and reworks of older tattoos. Each style has its own page on this site with recent work, so you can see examples before you book.",
    related: ["custom-design", "cover-ups"],
    link: { label: "See all tattoo styles", to: "/services" },
  },
  {
    id: "cover-ups",
    category: "design",
    question: "Can you cover up or rework an old tattoo?",
    answer:
      "Often, yes. Faded or unwanted tattoos can usually be reworked or covered — black & grey shading is especially good at this. The new design generally needs to be a little larger and darker, and we'll assess your skin and ink at the consultation.",
    related: ["free-consultation", "styles-offered"],
  },
  {
    id: "script-accuracy",
    category: "design",
    question: "Can you tattoo names or Sanskrit, Hindi or Kannada script?",
    answer:
      "Yes. Bring the exact text or its source, and we'll confirm spelling and letterforms with you before stencilling so the script reads correctly. This matters most for Sanskrit, Hindi and Kannada, where a single stroke can change the meaning. Names, dates and handwritten notes are checked the same way before anything goes on skin.",
    related: ["design-changes", "what-to-bring"],
  },

  // ── Aftercare & Healing ────────────────────────────────────────────
  {
    id: "aftercare-basics",
    category: "aftercare",
    question: "How do I take care of a new tattoo?",
    answer:
      "Wash it gently twice a day with mild, unscented soap, pat it dry and apply a thin layer of aftercare ointment. Don't pick or scratch peeling skin, avoid soaking and direct sun while it heals, and follow the aftercare guidance we give you.",
    related: ["healing-time", "swimming-sun", "touch-ups"],
  },
  {
    id: "healing-time",
    category: "aftercare",
    question: "How long does a tattoo take to heal?",
    answer:
      "The surface heals in about 10 days to 3 weeks depending on the style — fine-line work is quickest, heavy shading takes longer. Deeper layers settle fully over 1–3 months, when true contrast shows. Follow the aftercare guidance we give you, and message us if anything looks unusual while it heals.",
    related: ["aftercare-basics", "swimming-sun", "touch-ups"],
  },
  {
    id: "swimming-sun",
    category: "aftercare",
    question: "When can I swim, work out or go in the sun after a tattoo?",
    answer:
      "Avoid swimming, saunas and long soaks for 2–3 weeks, and keep the tattoo out of direct sun while healing. Light exercise is fine if it doesn't rub or stretch the area. Once healed, use SPF on your tattoo to keep it sharp.",
    related: ["healing-time", "tattoo-fading"],
  },
  {
    id: "touch-ups",
    category: "aftercare",
    question: "Do you offer free tattoo touch-ups?",
    answer:
      "Yes. Each tattoo comes with one free touch-up within 45–60 days (depending on the style) if any part heals unevenly. Wait until the tattoo has settled, then message us on WhatsApp with a photo so we can book a short slot. Touch-ups needed years later because of sun or ageing are discussed at a consultation.",
    related: ["healing-time", "aftercare-basics"],
  },
  {
    id: "tattoo-fading",
    category: "aftercare",
    question: "Will my tattoo fade over time?",
    answer:
      "Every tattoo softens slowly, but bold lines, solid blacks and good aftercare hold up best. Daily SPF is the biggest factor — UV is what fades ink fastest. A touch-up years later can refresh older pieces. If you're unsure whether an older tattoo needs a refresh, bring it to a free consultation.",
    related: ["inks", "swimming-sun", "touch-ups"],
  },

  // ── Studio & Visit ─────────────────────────────────────────────────
  {
    id: "location",
    category: "studio",
    question: "Where is Xing Premium Tattoo Studio located?",
    answer:
      `${ADDRESS.full}. The studio is ${ADDRESS.landmark}, on 60 Feet Road, about 3 km from Marathahalli and easy to reach from Whitefield. Use Get Directions on this site for a Google Maps route.`,
    related: ["opening-hours", "how-to-book"],
    link: { label: "Map & directions", to: "/about#visit" },
  },
  {
    id: "opening-hours",
    category: "studio",
    question: "What are Xing Premium Tattoo Studio's opening hours?",
    answer:
      `${HOURS_LONG}. Tuesday is the studio's cleaning and rest day. Appointments are preferred, so message us on WhatsApp or use the booking form to pick a time that suits you. Walk-ins are welcome when the artist is free, and these hours match the studio's Google Business Profile.`,
    related: ["walk-ins", "location"],
  },
  {
    id: "who-is-artist",
    category: "studio",
    question: "Who will do my tattoo?",
    answer:
      `Every tattoo is designed and done by Peace (Chingri Awungshi), Xing Premium Tattoo Studio's lead artist, with ${COUNTS.years} years of experience and ${COUNTS.tattoos} tattoos completed. The person you consult with is the person who tattoos you. Consultations, design and aftercare advice all come from the same person.`,
    related: ["custom-design", "styles-offered"],
    link: { label: "View the artist profile", to: "/tattoo-artist" },
  },
];

export const faqById = new Map(faqs.map((f) => [f.id, f]));

/** The five questions shown on the home page. */
export const homeFaqIds = [
  "tattoo-cost",
  "does-it-hurt",
  "hygiene",
  "first-tattoo",
  "aftercare-basics",
];
