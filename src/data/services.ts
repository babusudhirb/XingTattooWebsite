import { COUNTS, GOOGLE_RATING, PHONE_DISPLAY, RATING_LABEL, SHORT_ADDRESS } from "@/data/business";
import styleBlackGrey from "@/assets/style-blackgrey.webp";

import realismHero from "@/assets/services/realism/hero.webp";
import realismGallery1 from "@/assets/services/realism/gallery-1.webp";
import realismGallery2 from "@/assets/services/realism/gallery-2.webp";
import realismGallery3 from "@/assets/services/realism/gallery-3.webp";
import realismGallery4 from "@/assets/services/realism/gallery-4.webp";
import realismGallery5 from "@/assets/services/realism/gallery-5.webp";

import portraitHero from "@/assets/services/portrait/hero.webp";
import portraitGallery1 from "@/assets/services/portrait/gallery-1.webp";
import portraitGallery2 from "@/assets/services/portrait/gallery-2.webp";
import portraitGallery3 from "@/assets/services/portrait/gallery-3.webp";
import portraitGallery4 from "@/assets/services/portrait/gallery-4.webp";
import portraitGallery5 from "@/assets/services/portrait/gallery-5.webp";
import portraitGallery6 from "@/assets/services/portrait/gallery-6.webp";

import geometricHero from "@/assets/services/geometric/hero.webp";
import geometricGallery1 from "@/assets/services/geometric/gallery-1.webp";
import geometricGallery2 from "@/assets/services/geometric/gallery-2.webp";
import geometricGallery3 from "@/assets/services/geometric/gallery-3.webp";
import geometricGallery4 from "@/assets/services/geometric/gallery-4.webp";
import geometricGallery5 from "@/assets/services/geometric/gallery-5.webp";
import geometricGallery6 from "@/assets/services/geometric/gallery-6.webp";
import geometricGallery7 from "@/assets/services/geometric/gallery-7.webp";

import traditionalHero from "@/assets/services/traditional/hero.webp";
import traditionalGallery1 from "@/assets/services/traditional/gallery-1.webp";
import traditionalGallery2 from "@/assets/services/traditional/gallery-2.webp";
import traditionalGallery3 from "@/assets/services/traditional/gallery-3.webp";

import minimalistHero from "@/assets/services/minimalist/hero.webp";
import minimalistGallery1 from "@/assets/services/minimalist/gallery-1.webp";
import minimalistGallery2 from "@/assets/services/minimalist/gallery-2.webp";
import minimalistGallery3 from "@/assets/services/minimalist/gallery-3.webp";
import minimalistGallery4 from "@/assets/services/minimalist/gallery-4.webp";
import minimalistGallery5 from "@/assets/services/minimalist/gallery-5.webp";
import minimalistGallery6 from "@/assets/services/minimalist/gallery-6.webp";
import minimalistGallery7 from "@/assets/services/minimalist/gallery-7.webp";
import minimalistGallery8 from "@/assets/services/minimalist/gallery-8.webp";
import minimalistGallery9 from "@/assets/services/minimalist/gallery-9.webp";
import minimalistGallery10 from "@/assets/services/minimalist/gallery-10.webp";
import minimalistGallery11 from "@/assets/services/minimalist/gallery-11.webp";
import minimalistGallery12 from "@/assets/services/minimalist/gallery-12.webp";
import minimalistGallery13 from "@/assets/services/minimalist/gallery-13.webp";
import minimalistGallery14 from "@/assets/services/minimalist/gallery-14.webp";
import minimalistGallery15 from "@/assets/services/minimalist/gallery-15.webp";
import minimalistGallery16 from "@/assets/services/minimalist/gallery-16.webp";
import minimalistGallery17 from "@/assets/services/minimalist/gallery-17.webp";
import minimalistGallery18 from "@/assets/services/minimalist/gallery-18.webp";
import minimalistGallery19 from "@/assets/services/minimalist/gallery-19.webp";
import minimalistGallery20 from "@/assets/services/minimalist/gallery-20.webp";
import minimalistGallery21 from "@/assets/services/minimalist/gallery-21.webp";

import realismThumb from "@/assets/services/realism/thumb.webp";
import portraitThumb from "@/assets/services/portrait/thumb.webp";
import blackGreyThumb from "@/assets/services/black-grey/thumb.webp";
import geometricThumb from "@/assets/services/geometric/thumb.webp";
import traditionalThumb from "@/assets/services/traditional/thumb.webp";
import minimalistThumb from "@/assets/services/minimalist/thumb.webp";
import realismCard from "@/assets/services/realism/card.webp";
import portraitCard from "@/assets/services/portrait/card.webp";
import blackGreyCard from "@/assets/services/black-grey/card.webp";
import geometricCard from "@/assets/services/geometric/card.webp";
import traditionalCard from "@/assets/services/traditional/card.webp";
import minimalistCard from "@/assets/services/minimalist/card.webp";

export const SERVICE_SLUGS = [
  "realism",
  "portrait",
  "black-grey",
  "geometric",
  "traditional",
  "minimalist",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export interface AftercareStage {
  period: string;
  title: string;
  advice: string[];
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  text: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface FeatureBlock {
  title: string;
  text: string;
}

/** Icon keys rather than components — loader data must stay serializable. */
export type BenefitIcon = "heal" | "placement" | "precision";

export interface BenefitCard {
  title: string;
  text: string;
  icon: BenefitIcon;
  detailTitle: string;
  detail: string[];
}

export interface ServiceExplainer {
  title: string;
  paragraphs: string[];
  idealStylesTitle: string;
  idealStyles: string[];
}

export interface ServiceContent {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  /** 96px square crop of the hero, for menus — keeps the full photo off every page. */
  thumbImage: string;
  /** 560px copy of the hero for style cards (scripts/optimize-images.mjs). */
  cardImage: string;
  heroImageAlt: string;
  galleryImages: GalleryImage[];
  galleryTag?: string;
  introParagraphs: string[];
  characteristics: string[];
  bestFor: string[];
  quickFacts: {
    sessionTime: string;
    painScore: 1 | 2 | 3 | 4 | 5;
    painLabel: string;
    healingTime: string;
    touchUp: string;
  };
  process: ProcessStep[];
  aftercare: AftercareStage[];
  faqs: ServiceFaq[];
  relatedSlugs: ServiceSlug[];
  /** SEO-optimized page overrides — optional; when present, ServiceTemplate
   *  renders these in place of the generic Overview section. Used first on
   *  the Realism page; safe to leave undefined for every other style. */
  heroHeadline?: string;
  heroSummary?: string;
  whyChooseTitle?: string;
  whyChooseIntro?: string;
  whyChoosePoints?: FeatureBlock[];
  specialtiesTitle?: string;
  specialties?: FeatureBlock[];
  studioDifferenceEyebrow?: string;
  studioDifferenceTitle?: string;
  studioDifference?: FeatureBlock[];
  ctaHeadline?: string;
  ctaSubcopy?: string;
  /** Short proof points shown under the hero buttons. */
  heroTrustPoints?: string[];
  /** Interactive "is this right for you?" cards; replace whyChoosePoints when set. */
  benefitCards?: BenefitCard[];
  explainer?: ServiceExplainer;
  /** Interactive step-by-step aftercare guide; replaces the timeline when set. */
  aftercareTitle?: string;
  aftercareIntro?: string;
  aftercareSteps?: ProcessStep[];
}

export const services: Record<ServiceSlug, ServiceContent> = {
  realism: {
    slug: "realism",
    name: "Realism Tattoos",
    shortName: "Realism",
    tagline: "Photographs that happen to be skin-deep.",
    metaTitle: "Realism Tattoos in Bangalore",
    metaDescription:
      "Photo-real and 3D realism tattoos drawn from scratch by Peace at Xing Premium Tattoo Studio, Brookefield. Built to heal clean. Book a free consultation.",
    heroHeadline: "Realism Tattoos in Bangalore | Custom Micro & Photo-Realistic Ink",
    heroSummary:
      "Transform memories, portraits, and bold concepts into lifelike skin art at Xing Premium Tattoo Studio (Brookefield, Bengaluru). Realism requires master-level shading, precise contrast, and technical depth. Whether you want a hyper-realistic pet portrait, a classic Roman statue, or custom bio-mechanical art, our studio crafts high-detail realism tattoos designed to heal cleanly and last a lifetime.",
    heroImage: realismHero,
    thumbImage: realismThumb,
    cardImage: realismCard,
    heroImageAlt: "Realistic angel wings tattoo on forearm with fine feather detailing",
    galleryImages: [
      {
        src: realismGallery1,
        alt: "Hyper-realistic barber tools tattoo on forearm showing photographic shading",
      },
      {
        src: realismGallery2,
        alt: "Realistic eagle wing sleeve tattoo with sunburst crown on forearm",
      },
      { src: realismGallery3, alt: "Realistic greyscale elephant head tattoo on chest" },
      { src: realismGallery4, alt: "Realistic statue-style Hanuman idol tattoo on forearm" },
      { src: realismGallery5, alt: "Realistic Lord Shiva portrait tattoo on forearm" },
    ],
    introParagraphs: [
      'Realism is the style people point at and ask "wait, is that a photo?" It\'s built from layered greyscale (or full-colour) shading rather than hard outlines, so light, shadow and texture do all the work — the way they would in a photograph.',
      "It's also the most technically demanding style in the studio. Every gradient has to survive the skin's own healing process, which is why realism pieces are planned in stages rather than rushed in one sitting.",
    ],
    characteristics: [
      "Photographic depth built from layered shading, not outlines",
      "Smooth, blended gradients with no harsh line breaks",
      "Composed from high-resolution reference photos",
      "Best suited to larger, flatter canvases — forearm, thigh, calf, back",
    ],
    bestFor: [
      "Portraits of people or pets",
      "Wildlife and nature scenes",
      "Memorial and tribute pieces",
      "Large-scale statement work",
    ],
    whyChooseIntro:
      "Realism bridges fine art and tattooing. Unlike bold-line styles, realism uses subtle gradients, light play, and rich contrast for 3D skin depth.",
    whyChoosePoints: [
      {
        title: "3D Depth & Texture",
        text: "Intricate detail — from soft skin tones to metallic shines and stone textures.",
      },
      {
        title: "100% Custom Art",
        text: "Ideal for honoring loved ones, family heritage, or majestic wildlife.",
      },
      {
        title: "Timeless Aesthetic",
        text: "High-contrast realism creates an elegant, high-end gallery look.",
      },
    ],
    specialties: [
      {
        title: "Photo-Realistic Portraits",
        text: "High-accuracy facial features, expressions, and pet portraits from high-res reference photos.",
      },
      {
        title: "Black & Grey Realism",
        text: "Smooth charcoal shading, sharp highlights, and sculpture-inspired designs that age gracefully.",
      },
      {
        title: "Micro-Realism",
        text: "High-precision miniature art optimized for inner wrists, forearms, or ankles.",
      },
      {
        title: "Colour Realism & Surrealism",
        text: "Vibrant saturation paired with true-to-life realistic textures.",
      },
    ],
    studioDifference: [
      {
        title: "Custom Design Consult",
        text: "Personal stencil fitting aligned with your muscle structure.",
      },
      {
        title: "USA Imported Inks",
        text: "Premium pigments holding deep darks and mid-tones through healing.",
      },
      {
        title: "Medical-Grade Sterility",
        text: "100% single-use needles opened live before every session.",
      },
    ],
    ctaHeadline: "Ready to Bring Your Vision to Life?",
    ctaSubcopy: "Book a free consultation or chat with us on WhatsApp.",
    quickFacts: {
      sessionTime: "3–6 hrs per sitting · 2–4 sessions for large pieces",
      painScore: 4,
      painLabel: "High — dense shading",
      healingTime: "2–3 weeks surface, ~3 months full",
      touchUp: "1 free touch-up within 60 days",
    },
    process: [
      {
        title: "Reference Curation",
        text: "We review your photos together and flag what will and won't translate to skin.",
      },
      {
        title: "Custom Composition",
        text: "A hand-built sketch maps light, shadow and placement before any ink touches skin.",
      },
      {
        title: "Skin Test Pass",
        text: "Greyscale or colour values are proofed so gradients read correctly once healed.",
      },
      {
        title: "Multi-Session Tattooing",
        text: "Layers are built up over sessions with healing gaps so shading doesn't blow out.",
      },
      {
        title: "Final Detail Pass",
        text: "A closing session sharpens highlights and blends the last transitions.",
      },
    ],
    aftercare: [
      {
        period: "Day 1–3",
        title: "Fresh & Fragile",
        advice: [
          "Keep the wrap on for the time your artist specifies",
          "Wash gently, twice a day, with fragrance-free soap",
          "Pat dry — never rub — then apply a thin layer of aftercare ointment",
          "No soaking, swimming or long showers",
        ],
      },
      {
        period: "Day 4–14",
        title: "The Peel",
        advice: [
          "Light flaking and scabbing over shaded areas is normal",
          "Do not pick — this is exactly where saturation is lost if handled roughly",
          "Switch to a fragrance-free lotion once the ointment stage is done",
          "Wear loose clothing over the tattoo",
        ],
      },
      {
        period: "Week 2–4",
        title: "The Itch",
        advice: [
          "Shading can look dull or cloudy as new skin forms — this is temporary",
          "Resist scratching, even when it itches",
          "Avoid direct sun, pools and saunas until fully healed",
          "Stay hydrated — well-hydrated skin heals more evenly",
        ],
      },
      {
        period: "Month 2–3",
        title: "Settle & Shine",
        advice: [
          "True depth and contrast emerge once skin fully regenerates",
          "Book your free touch-up if any patch looks uneven",
          "Start using SPF 50 on the tattoo every time it's in the sun, permanently",
        ],
      },
    ],
    faqs: [
      {
        question: "How long does a realism tattoo take?",
        answer:
          "Due to microscopic detail, sessions range from 4 to 8 hours for mid-size pieces (e.g., forearm).",
      },
      {
        question: "Do realism tattoos fade faster than line art?",
        answer:
          "No. With correct needle depth and proper sunscreen aftercare, high-contrast realism ages exceptionally well.",
      },
      {
        question: "What makes a good reference photo for portraits?",
        answer:
          "High-resolution, well-lit photos with clear shadows and sharp focus produce the best realism tattoos.",
      },
    ],
    relatedSlugs: ["black-grey", "portrait"],
  },

  portrait: {
    slug: "portrait",
    name: "Portrait Tattoos",
    shortName: "Portrait",
    tagline: "Faces you'll never forget, inked to last a lifetime.",
    metaTitle: "Portrait Tattoos in Bangalore",
    metaDescription:
      `Lifelike human, pet and memorial portrait tattoos in Brookefield, Bengaluru. Expert shading by Peace (${COUNTS.years} yrs). Book your free consultation today.`,
    heroHeadline: "Custom Portrait Tattoos in Bangalore | Lifelike Human & Pet Ink",
    heroSummary:
      `Capture emotion, memory, and personal identity with custom portrait tattoos at Xing Premium Tattoo Studio (Brookefield, Bengaluru). Led by Peace (Chingri Awungshi) (${COUNTS.years} years mastery), our studio specializes in ultra-realistic facial proportions, hair textures, and lifelike expressions. Whether honoring a loved one, a child, or a cherished pet, we turn high-resolution photographs into permanent skin art.`,
    heroImage: portraitHero,
    thumbImage: portraitThumb,
    cardImage: portraitCard,
    heroImageAlt: '"Queen" eyes portrait tattoo on chest with fine realistic shading',
    galleryImages: [
      {
        src: portraitGallery1,
        alt: "Portrait tattoo of a smiling woman with wings and florals on chest",
      },
      { src: portraitGallery2, alt: "Pet portrait tattoo of a dog named Charlie on forearm" },
      {
        src: portraitGallery3,
        alt: "Memorial portrait tattoo tribute reading Miss You on forearm",
      },
      {
        src: portraitGallery4,
        alt: "Realistic portrait tattoo of a woman on chest with fine shading detail",
      },
      { src: portraitGallery5, alt: "Realistic smiling portrait tattoo of a man on chest" },
      {
        src: portraitGallery6,
        alt: "Memorial portrait tattoo of a grandmother with a keepsake date",
      },
    ],
    introParagraphs: [
      "Portrait work is realism's most unforgiving branch — the human eye is wired to notice the smallest error in a face it recognises. Every transition around the eyes, skin tone and hairline has to be exactly right, not just close.",
      "That's why portrait sessions are slower and more deliberate than most other styles. We'd rather split a face across two sessions than rush a likeness that matters to you.",
    ],
    characteristics: [
      "Hyper-focus on likeness — eyes, skin-tone transitions, hair texture",
      "Usually worked in greyscale for timeless contrast, or full colour for vibrancy",
      "Needs a strong reference photo — sharp focus, even lighting, front-facing where possible",
      "Composition planned around proportion, not just copied 1:1",
    ],
    bestFor: [
      "Memorial tributes to loved ones",
      "Family portraits",
      "Tributes to pets",
      "Tributes to icons and public figures",
    ],
    whyChooseIntro:
      "Portrait tattoos demand precise technical shading and flawless proportion mapping — there is zero room for error.",
    whyChoosePoints: [
      {
        title: "High-Precision Accuracy",
        text: "Recreates subtle expressions, eye reflections, and true-to-life facial features.",
      },
      {
        title: "Timeless Emotional Value",
        text: "Immortalize loved ones, iconic figures, or beloved pets with deeply personal custom art.",
      },
      {
        title: "Smooth Depth & Contrast",
        text: "Masterful black & grey or colour shading ensures smooth skin-tone gradients that age cleanly.",
      },
    ],
    specialtiesTitle: "Our Portrait Tattoo Specialties",
    specialties: [
      {
        title: "Human Facial Portraits",
        text: "Hyper-detailed portraits of children, family members, or historical icons mapped precisely to your body contours.",
      },
      {
        title: "Pet & Animal Portraits",
        text: "Detailed dogs, cats, and wildlife pieces capturing true fur textures, eye detail, and character.",
      },
      {
        title: "Memorial & Legacy Tattoos",
        text: "Respectful, high-detail tributes designed to keep cherished memories alive forever.",
      },
      {
        title: "Colour and Black & Grey Portraits",
        text: "Vibrant colour depth or classic smooth charcoal shading tailored to your style.",
      },
    ],
    studioDifferenceEyebrow: "Safety & Mastery",
    studioDifferenceTitle: "The Xing Premium Standards",
    studioDifference: [
      {
        title: "Stencil & Photo Consultation",
        text: "We evaluate lighting, contrast, and high-res reference photos during your free consult.",
      },
      {
        title: "USA Imported Inks",
        text: "Premium fade-resistant pigments ensuring smooth mid-tones and crisp detail after healing.",
      },
      {
        title: "100% Sterile Setup",
        text: "Brand-new single-use needles opened in front of you, following strict studio hygiene protocols.",
      },
    ],
    ctaHeadline: "Bring Your Memories to Life with Ink.",
    ctaSubcopy: "Book your free consultation or message us on WhatsApp.",
    quickFacts: {
      sessionTime: "4–7 hrs · complex portraits split across 2 sessions",
      painScore: 4,
      painLabel: "High — sustained detail work",
      healingTime: "~3 weeks surface",
      touchUp: "1 free precision touch-up within 60 days",
    },
    process: [
      {
        title: "Photo Consultation",
        text: "We review references together and flag anything that needs restoring or enhancing.",
      },
      {
        title: "Proportion Stencil",
        text: "A custom stencil is built on a proportion grid so the likeness holds up at tattoo scale.",
      },
      {
        title: "Line & Block-In",
        text: "Core structure and greyscale values are laid down first.",
      },
      {
        title: "Fine Detail Session",
        text: "Eyes, hairline and highlights are refined in a focused, unhurried pass.",
      },
      {
        title: "Likeness Review",
        text: "We check the healed result against the reference before calling it finished.",
      },
    ],
    aftercare: [
      {
        period: "Day 1–3",
        title: "Fresh & Fragile",
        advice: [
          "Wash gently twice a day with fragrance-free soap",
          "Pat dry and apply a thin layer of aftercare ointment",
          "Avoid touching the face/detail zones of the tattoo unnecessarily",
        ],
      },
      {
        period: "Day 4–14",
        title: "The Peel",
        advice: [
          "Avoid rubbing near fine-detail areas like eyes and hair strands — they're the most fragile part",
          "No direct sun on the healing tattoo",
          "Keep moisturising lightly, but don't over-saturate — it can blur fine lines",
        ],
      },
      {
        period: "Week 2–4",
        title: "The Itch",
        advice: [
          "Do not pick, especially around fine linework — this is where likeness is lost",
          "Continue gentle, fragrance-free moisturising",
          "Avoid pools, saunas and prolonged sun exposure",
        ],
      },
      {
        period: "Month 2–3",
        title: "Settle & Shine",
        advice: [
          "Book a touch-up if any softening appears around the eyes or lips",
          "Start daily SPF over the piece — detail areas fade first without it",
        ],
      },
    ],
    faqs: [
      {
        question: "What type of photo works best for a portrait tattoo?",
        answer:
          "High-resolution, unedited photos with clear lighting and distinct shadows work best. Avoid blurry, dark, or heavily filtered images.",
      },
      {
        question: "How much does a custom portrait tattoo cost in Bengaluru?",
        answer:
          "Pricing depends on detail level, size, and placement. We provide exact estimates during your free initial consultation.",
      },
      {
        question: "How do portrait tattoos age over time?",
        answer:
          "Executed with proper contrast and correct needle depth, portrait tattoos heal smoothly and age exceptionally well with proper sunscreen aftercare.",
      },
    ],
    relatedSlugs: ["realism", "black-grey"],
  },

  "black-grey": {
    slug: "black-grey",
    name: "Black & Grey Tattoos",
    shortName: "Black & Grey",
    tagline: "All the depth of realism, none of the colour commitment.",
    metaTitle: "Black & Grey Tattoos in Bangalore",
    metaDescription:
      `Smooth Black & Grey shading, sleeves and blackwork at Xing Premium Tattoo Studio, AECS Layout, Brookefield. ${GOOGLE_RATING}★ on Google. Book a free consultation.`,
    heroHeadline: "Custom Black & Grey Tattoos in Bangalore | Timeless Shading & Depth",
    heroSummary:
      `Experience the power of classic monochrome ink at Xing Premium Tattoo Studio (Brookefield, Bengaluru). Led by Peace (Chingri Awungshi) (${COUNTS.years} years experience), our studio specializes in rich charcoal gradients, bold blackwork, and soft value-shading. From fine-line script and intricate mandalas to full-sleeve darkside realism, we design custom black & grey tattoos built to heal crisply and hold their depth for decades.`,
    heroImage: styleBlackGrey,
    thumbImage: blackGreyThumb,
    cardImage: blackGreyCard,
    heroImageAlt:
      "Black and grey warrior sleeve tattoo with smooth charcoal shading at Xing Premium Tattoo Studio, Bengaluru",
    galleryImages: [],
    galleryTag: "Black & Grey",
    introParagraphs: [
      "Black & grey builds all its depth from diluted black ink — no colour, just controlled greys that create contrast, mood and dimension. It reads as timeless because it's not tied to a colour trend that ages out.",
      "It pairs naturally with almost any skin tone and holds up beautifully on large canvases like sleeves and back pieces, where the shading has room to breathe.",
    ],
    characteristics: [
      "Monochrome shading built from diluted black ink",
      "Smooth gradients for moody, high-contrast depth",
      "Works for realism, religious, abstract or illustrative themes",
      "Scales well from small accents to full sleeves and back pieces",
    ],
    bestFor: [
      "Timeless pieces that pair with any skin tone",
      "Sleeves and back pieces with room for shading",
      "Anyone who wants depth without a colour commitment",
      "Cover-ups over older tattoos",
    ],
    whyChooseIntro:
      "Black & grey ink is timeless, versatile, and ages with exceptional stability on all skin tones.",
    whyChoosePoints: [
      {
        title: "High Contrast & Longevity",
        text: "Premium black carbon inks hold sharp edges and deep values without colour drift over time.",
      },
      {
        title: "Flattering on All Skin Tones",
        text: "Multi-pass wash techniques create soft mid-tones that complement natural skin tones beautifully.",
      },
      {
        title: "Unmatched Versatility",
        text: "Blends seamlessly across realism, geometric, gothic, Japanese, and minimalist styles.",
      },
    ],
    specialties: [
      {
        title: "Smooth Shading & Realism",
        text: "Subtle grey-wash transitions for portraits, statues, wildlife, and surrealism.",
      },
      {
        title: "Fine Line & Minimalist Blackwork",
        text: "Delicate, clean linework for geometry, botanical art, micro tattoos, and script.",
      },
      {
        title: "Darkside, Chicano & Gothic Art",
        text: "Bold, high-contrast designs featuring dark themes, lettering, and sharp imagery.",
      },
      {
        title: "Full Black & Grey Sleeves",
        text: "Cohesive, large-scale body art custom-fitted to your arm, leg, or chest flow.",
      },
    ],
    studioDifferenceEyebrow: "Precision & Safety",
    studioDifferenceTitle: "The Xing Premium Standard",
    studioDifference: [
      {
        title: "Custom Wash & Dilution Control",
        text: "Custom-mixed ink washes designed for smooth heals with zero patchy spots.",
      },
      {
        title: "USA Imported Inks",
        text: "Highest-purity black pigments that resist fading and hold deep darks long-term.",
      },
      {
        title: "100% Sterile Setup",
        text: "Single-use needles opened live, backed by strict medical-grade hygiene protocols.",
      },
    ],
    ctaHeadline: "Ready for Classic, High-Contrast Ink?",
    ctaSubcopy: "Book your free consultation or message us on WhatsApp.",
    quickFacts: {
      sessionTime: "3–5 hrs per sitting · sleeves need multiple sessions",
      painScore: 4,
      painLabel: "Moderate–High",
      healingTime: "2–3 weeks surface, 4–6 weeks full",
      touchUp: "1 free shading touch-up within 60 days",
    },
    process: [
      {
        title: "Shading Consultation",
        text: "We talk through references and where contrast should sit heaviest.",
      },
      {
        title: "Greyscale Composition",
        text: "A full sketch maps light, mid-tone and shadow before tattooing begins.",
      },
      {
        title: "Outline & Base Shading",
        text: "Structure goes down first, then the first layer of depth.",
      },
      {
        title: "Layered Contrast Session",
        text: "Additional passes build the gradient once the base has healed.",
      },
      {
        title: "Final Blend & Highlights",
        text: "The last session smooths transitions and sharpens contrast.",
      },
    ],
    aftercare: [
      {
        period: "Day 1–3",
        title: "Fresh & Fragile",
        advice: [
          "Wash gently twice a day with fragrance-free soap",
          "Pat dry, then apply a thin layer of aftercare ointment",
          "No soaking or long showers",
        ],
      },
      {
        period: "Day 4–14",
        title: "The Peel",
        advice: [
          "Scabbing over shaded zones is normal — pat, never pick",
          "Patchy grey is the single most avoidable touch-up request, and it comes from picking",
          "Switch to a fragrance-free lotion once ointment stage ends",
        ],
      },
      {
        period: "Week 2–4",
        title: "The Itch",
        advice: [
          'Skin can look "foggy" while healing — true depth returns after full regeneration',
          "Avoid direct sun, pools and saunas",
          "Keep the area moisturised without over-saturating",
        ],
      },
      {
        period: "Month 2–3",
        title: "Settle & Shine",
        advice: [
          "SPF is critical — black & grey shows sun-fading as blotchy grey patches faster than solid black",
          "Book a touch-up for any uneven shading",
        ],
      },
    ],
    faqs: [
      {
        question: "Why do black and grey tattoos age better than colour tattoos?",
        answer:
          "Black ink pigments have higher density and stability, making them more resistant to UV fading over time.",
      },
      {
        question: "How much does a black and grey tattoo cost in Brookefield, Bengaluru?",
        answer:
          "Pricing depends on design complexity, scale, and placement. We provide exact estimates during your free consultation.",
      },
      {
        question: "How long does black and grey ink take to heal?",
        answer:
          "Surface healing takes 2 to 3 weeks, while deep skin layers settle fully within 4 to 6 weeks with proper aftercare.",
      },
      {
        question: "Is black & grey better for cover-ups?",
        answer:
          "Often, yes. Its shading blends well over older tattoos and can disguise faded lines more naturally than flat colour.",
      },
      {
        question: "How is this different from realism?",
        answer:
          "Black & grey is the technique; realism is one of the things you can do with it. Not every black & grey piece aims for photographic accuracy — some lean illustrative or abstract instead.",
      },
    ],
    relatedSlugs: ["realism", "portrait", "minimalist"],
  },

  geometric: {
    slug: "geometric",
    name: "Geometric Tattoos",
    shortName: "Geometric",
    tagline: "Symmetry so sharp it could cut glass.",
    metaTitle: "Geometric & Mandala Tattoos in Bangalore",
    metaDescription:
      "Sacred geometry, mandala and dotwork tattoos mapped to your body in Brookefield, Bengaluru. Custom designs by Peace. Book a free consultation today.",
    heroHeadline: "Custom Geometric & Sacred Geometry Tattoos in Bangalore",
    heroSummary:
      `Experience mathematical symmetry and spiritual balance at Xing Premium Tattoo Studio (Brookefield, Bengaluru). Led by Peace (Chingri Awungshi) (${COUNTS.years} years mastery), our studio specializes in razor-sharp linework, intricate mandalas, optical illusions, and sacred geometric patterns. Whether you want a minimalist armband, dotwork shading, or a full geometric sleeve, we craft custom designs engineered to align with your body’s natural contours.`,
    heroImage: geometricHero,
    thumbImage: geometricThumb,
    cardImage: geometricCard,
    heroImageAlt:
      "Geometric compass and wave tattoo on forearm with precise fine-line symmetry at Xing Premium Tattoo Studio, Bengaluru",
    galleryImages: [
      { src: geometricGallery1, alt: "Chakra symbols geometric tattoo along the spine" },
      {
        src: geometricGallery2,
        alt: "Geometric arm sleeve tattoo with rhino, tree and sacred geometry shapes",
      },
      { src: geometricGallery3, alt: "Geometric mandala tattoo on the back of the hand" },
      { src: geometricGallery4, alt: "Geometric zodiac face tattoo on forearm" },
      { src: geometricGallery5, alt: "Eye of providence triangle geometric tattoo on forearm" },
      { src: geometricGallery6, alt: "Colourful geometric compass tattoo on forearm" },
      { src: geometricGallery7, alt: "Tesseract cube geometric line tattoo on forearm" },
    ],
    introParagraphs: [
      "Geometric tattoos trade shading for precision — clean linework, dot work and symmetrical patterns that rely on exact spacing rather than gradients. Every millimetre is planned before the machine touches skin.",
      "Because the impact comes from symmetry, these pieces are mapped digitally to your body's actual curvature before tattooing, not just drawn flat and hoped for.",
    ],
    characteristics: [
      "Clean linework and stippling (dot work) over shading",
      "Sacred-geometry patterns, mandalas and structured blackwork shapes",
      "Precision-first — symmetry matters more than colour or gradient",
      "Reads strikingly on any skin tone",
    ],
    bestFor: [
      "Bold visual impact without heavy colour",
      "Wrap-around limb pieces and sleeves",
      "Symmetrical chest or back pieces",
      "Anyone drawn to structure and pattern over realism",
    ],
    whyChooseIntro:
      "Geometric tattoos blend fine art with mathematical precision—demanding absolute line-work control with zero room for distortion.",
    whyChoosePoints: [
      {
        title: "Flawless Symmetry & Flow",
        text: "Designed to complement your muscle structure for natural movement and balance.",
      },
      {
        title: "Deep Symbolism & Sacred Geometry",
        text: "Incorporates spiritual motifs like the Flower of Life, Metatron's Cube, and Fibonacci spirals.",
      },
      {
        title: "High Technical Precision",
        text: "Crisp needle work ensures lines remain sharp, clean, and well-defined as the tattoo heals.",
      },
    ],
    specialties: [
      {
        title: "Sacred Geometry & Mandalas",
        text: "Intricate circular patterns representing unity, cosmos, and personal balance.",
      },
      {
        title: "Dotwork & Stippling (Pointillism)",
        text: "Multi-density dot shading creating smooth 3D gradients and optical depth.",
      },
      {
        title: "Geometric Animal & Abstract Art",
        text: "Modern fusion combining realistic animal portraits with sharp geometric frames.",
      },
      {
        title: "Armbands, Sleeves & Fine Line Patterns",
        text: "Clean, continuous geometric bands and full-body structural pieces.",
      },
    ],
    studioDifferenceEyebrow: "Precision & Safety",
    studioDifferenceTitle: "The Xing Premium Standard",
    studioDifference: [
      {
        title: "Stencil Mapping & Alignment",
        text: "Custom digital stenciling ensures flawless symmetry before any ink touches skin.",
      },
      {
        title: "USA Imported High-Contrast Inks",
        text: "Deep black pigments engineered to maintain line clarity for decades.",
      },
      {
        title: "100% Sterile Setup",
        text: "Single-use precision needles opened live, backed by strict medical-grade hygiene protocols.",
      },
    ],
    ctaHeadline: "Ready for Perfect Symmetry and Custom Art?",
    ctaSubcopy: "Book your free consultation or chat via WhatsApp.",
    quickFacts: {
      sessionTime: "1.5–4 hrs depending on complexity",
      painScore: 3,
      painLabel: "Moderate — line-heavy over bone areas",
      healingTime: "10–14 days surface",
      touchUp: "1 free line touch-up within 45 days",
    },
    process: [
      {
        title: "Pattern Consultation",
        text: "We talk symmetry, placement and how the pattern should wrap the body.",
      },
      {
        title: "Digital Stencil Mapping",
        text: "The design is mapped to your body's curvature for true symmetry, not guesswork.",
      },
      { title: "Precision Linework", text: "Lines go down first, steady and unbroken." },
      {
        title: "Dot Work / Fill",
        text: "Stippling or fill is added where the design calls for it.",
      },
      {
        title: "Symmetry Check",
        text: "We check the pattern under stretched skin before finishing.",
      },
    ],
    aftercare: [
      {
        period: "Day 1–3",
        title: "Fresh & Fragile",
        advice: [
          "Clean gently with fragrance-free soap, twice a day",
          "Avoid stretching the skin excessively — lines can distort while healing",
          "Apply a thin layer of aftercare ointment",
        ],
      },
      {
        period: "Day 4–10",
        title: "The Peel",
        advice: [
          "Light flaking along thin lines is normal",
          "Don't pick — line breaks and gaps are the #1 geometric touch-up request",
          "Keep the area clean and lightly moisturised",
        ],
      },
      {
        period: "Week 2–3",
        title: "The Itch",
        advice: [
          "Keep skin moisturised so lines don't crack from over-drying",
          "Avoid direct sun, pools and saunas until fully healed",
        ],
      },
      {
        period: "Month 1+",
        title: "Settle & Shine",
        advice: [
          "SPF keeps crisp black lines from turning grey or blue over the years",
          "Book a touch-up if any line looks broken or faded",
        ],
      },
    ],
    faqs: [
      {
        question: "Do geometric tattoos take longer than other styles?",
        answer:
          "Yes. Because geometric art requires exact symmetry and razor-straight linework, stencil placement and execution require extra time and precision.",
      },
      {
        question: "Where is the best placement for a geometric or mandala tattoo?",
        answer:
          "Forearms, upper arms, chest, back, and calves are ideal because skin stays stable, minimizing pattern distortion.",
      },
      {
        question: "Do dotwork and fine line geometric tattoos age well?",
        answer:
          "When executed at correct needle depth using quality ink, geometric dotwork and linework age crisply and hold their structure remarkably well.",
      },
      {
        question: "Can geometric patterns wrap around joints?",
        answer:
          "Yes, but expect a slightly higher chance of needing a touch-up, since skin over joints stretches more during healing.",
      },
      {
        question: "Is geometric a good choice for a first tattoo?",
        answer:
          "Smaller geometric pieces are a great first tattoo — shorter sessions, moderate pain, and a bold, clean look.",
      },
    ],
    relatedSlugs: ["minimalist", "black-grey", "traditional"],
  },

  traditional: {
    slug: "traditional",
    name: "Indian Traditional Tattoos",
    shortName: "Indian Traditional",
    tagline: "Faith, heritage and story — inked to carry for a lifetime.",
    metaTitle: "Indian Traditional Tattoos in Bangalore",
    metaDescription:
      "Shiva, Hanuman, Om, Trishul and Sanskrit script tattoos drawn respectfully by Peace in Brookefield, Bengaluru. Book your free consultation today.",
    heroHeadline: "Custom Indian Traditional Tattoos in Bangalore | Spiritual & Cultural Ink",
    heroSummary:
      `Carry your faith, heritage and family story in ink at Xing Premium Tattoo Studio (Brookefield, Bengaluru). Led by Peace (Chingri Awungshi) (${COUNTS.years} years mastery), our studio specializes in Indian traditional tattoos — from Lord Shiva, Mahadev and Trishul designs to Ganesha, Krishna, Hanuman, Om and Sanskrit mantra script. Every piece is custom-drawn with respect for its symbolism, true-to-tradition detailing and placement, and built to heal cleanly and stay meaningful for a lifetime.`,
    heroImage: traditionalHero,
    thumbImage: traditionalThumb,
    cardImage: traditionalCard,
    heroImageAlt:
      "Bold ornamental face tattoo on the back of the hand at Xing Premium Tattoo Studio, Bengaluru",
    galleryImages: [
      { src: realismGallery5, alt: "Lord Shiva Indian traditional tattoo on forearm" },
      { src: realismGallery4, alt: "Lord Hanuman idol Indian traditional tattoo on forearm" },
      { src: geometricGallery1, alt: "Chakra symbols spiritual tattoo along the spine" },
      { src: minimalistGallery9, alt: "Om symbol tattoo on forearm" },
      {
        src: minimalistGallery19,
        alt: "Lotus and unalome spiritual tattoo running down the forearm",
      },
      { src: traditionalGallery1, alt: "Bold linework demon mask tattoo in progress on forearm" },
      {
        src: traditionalGallery2,
        alt: "Bold mask tattoo with shading on upper arm",
      },
      {
        src: traditionalGallery3,
        alt: "Bold linework all-seeing eye tattoo with red accents on hand",
      },
    ],
    introParagraphs: [
      "India has one of the oldest tattoo cultures in the world — from the godna markings of central India to the tribal traditions of the North-East, tattoos have long carried identity, protection and devotion.",
      "Today's Indian traditional tattoos carry that forward: deities, sacred symbols and scripts, drawn with care for what they mean and where they sit on the body.",
    ],
    characteristics: [
      "Deities, sacred symbols and scripts drawn true to their iconography",
      "Bold linework with black & grey or colour shading",
      "Placement chosen with respect for the symbol's meaning",
      "Fully custom — never a copied internet design",
    ],
    bestFor: [
      "Devotional and religious tattoos",
      "Sanskrit, Hindi or Kannada mantras and names",
      "Family, heritage and protection symbols",
      "Forearm, upper arm, chest and back pieces",
    ],
    whyChooseTitle: "Why Choose Indian Traditional Tattoos?",
    whyChooseIntro:
      "Indian traditional tattoos are more than decoration — they carry devotion, protection and identity. That demands accurate iconography, correct script, and a respectful approach to design and placement.",
    whyChoosePoints: [
      {
        title: "Deep Personal Meaning",
        text: "Honor your faith, family deity, or heritage with a symbol that means something every time you see it.",
      },
      {
        title: "True-to-Tradition Detailing",
        text: "Correct iconography — Shiva's third eye and crescent moon, Ganesha's form, Krishna's flute and peacock feather — drawn with care.",
      },
      {
        title: "Timeless Cultural Heritage",
        text: "Rooted in India's centuries-old tattoo traditions, so the design never goes out of style.",
      },
    ],
    specialtiesTitle: "Our Indian Traditional Tattoo Specialties",
    specialties: [
      {
        title: "Lord Shiva & Mahadev Tattoos",
        text: "Shiva portraits, Mahakal, Trishul, Damru, Rudraksha and third-eye designs in bold black & grey.",
      },
      {
        title: "Ganesha, Krishna & Hanuman",
        text: "Devotional deity tattoos — from minimal outlines to detailed, statue-inspired realism.",
      },
      {
        title: "Om, Trishul & Sacred Symbols",
        text: "Om, Swastik, lotus, chakras, mandalas and yantras as standalone pieces or accents.",
      },
      {
        title: "Sanskrit & Indian Script",
        text: "Mantras, shlokas and names in Sanskrit, Hindi or Kannada — spelling checked with you before stenciling.",
      },
    ],
    studioDifferenceEyebrow: "Precision & Safety",
    studioDifferenceTitle: "The Xing Premium Standard",
    studioDifference: [
      {
        title: "Respectful Custom Design",
        text: "We discuss meaning, iconography and placement with you before a single line is drawn.",
      },
      {
        title: "USA Imported Inks",
        text: "Premium pigments that hold deep blacks, smooth shading and clean script for decades.",
      },
      {
        title: "100% Sterile Setup",
        text: "Single-use needles opened live, backed by strict medical-grade studio hygiene protocols.",
      },
    ],
    ctaHeadline: "Ready to Wear Your Faith & Heritage?",
    ctaSubcopy: "Book your free consultation or chat via WhatsApp.",
    quickFacts: {
      sessionTime: "1–5 hrs depending on size and detail",
      painScore: 3,
      painLabel: "Moderate — varies with placement",
      healingTime: "2–3 weeks surface",
      touchUp: "1 free touch-up within 60 days",
    },
    process: [
      {
        title: "Meaning Consultation",
        text: "We talk through the deity, symbol or script and what it means to you.",
      },
      {
        title: "Custom Sketch",
        text: "A hand-drawn design with accurate iconography — never a copied internet image.",
      },
      {
        title: "Script & Placement Check",
        text: "Spelling is verified with you and placement is chosen with respect for the symbol.",
      },
      {
        title: "Linework & Shading",
        text: "Clean outlines first, then black & grey or colour shading for depth.",
      },
      {
        title: "Final Detail Pass",
        text: "Faces, eyes and ornaments get a last refining pass before you leave.",
      },
    ],
    aftercare: [
      {
        period: "Day 1–3",
        title: "Fresh & Fragile",
        advice: [
          "Keep the wrap on for the time your artist specifies",
          "Wash gently twice a day with fragrance-free soap — pat, don't wipe",
          "Apply a thin layer of aftercare ointment as directed",
        ],
      },
      {
        period: "Day 4–14",
        title: "The Peel",
        advice: [
          "Light flaking and scabbing are normal — do not pick",
          "Picking over script or fine detail is the #1 cause of gaps and touch-ups",
          "Wear loose clothing over the area",
        ],
      },
      {
        period: "Week 2–4",
        title: "The Itch",
        advice: [
          "The tattoo can look dull while new skin forms — true contrast returns after the peel",
          "Avoid direct sun, pools and saunas",
          "Keep the area lightly moisturised",
        ],
      },
      {
        period: "Long Term",
        title: "Settle & Shine",
        advice: [
          "Daily SPF keeps linework and script crisp for decades",
          "Book your free touch-up if any line or letter looks uneven",
        ],
      },
    ],
    faqs: [
      {
        question: "What are the most popular Indian traditional tattoo designs?",
        answer:
          "Lord Shiva and Mahadev, Trishul, Om, Ganesha, Krishna's flute and peacock feather, Hanuman, and Sanskrit mantras are among the most requested — often combined with mandalas or lotus motifs.",
      },
      {
        question: "Can you tattoo Sanskrit, Hindi or Kannada script accurately?",
        answer:
          "Yes. Bring the exact text or its source, and we confirm the spelling and letterforms with you before stenciling so the script reads correctly.",
      },
      {
        question: "Where should I place a religious or deity tattoo?",
        answer:
          "Many clients prefer the forearm, upper arm, chest or back for deity tattoos out of respect. We'll guide you on placement during your consultation.",
      },
      {
        question: "How much does an Indian traditional tattoo cost in Brookefield, Bengaluru?",
        answer:
          "Pricing depends on design complexity, size, and placement. We provide exact estimates during your free consultation.",
      },
      {
        question: "Can you rework or cover an old traditional tattoo?",
        answer:
          "Often, yes. Faded or blurred older tattoos can usually be refreshed or reworked into a new design — we assess the skin and ink during your consultation.",
      },
    ],
    relatedSlugs: ["realism", "black-grey", "geometric"],
  },

  minimalist: {
    slug: "minimalist",
    name: "Minimalist Tattoos",
    shortName: "Minimalist",
    tagline: "Subtle. Elegant. Engineered with extreme precision.",
    metaTitle: "Fine Line & Minimalist Tattoos in Bangalore",
    metaDescription:
      "Delicate fine-line, micro and minimalist tattoos that heal crisp, at Xing Premium Tattoo Studio, Brookefield. Ideal first tattoos. Free consultation.",
    heroHeadline: "Custom Minimalist & Fine-Line Tattoos in Bangalore",
    heroSummary:
      "Minimalist tattoos prove that simplicity speaks loudest. At Xing Premium Tattoo Studio in Brookefield, we specialize in needle-thin linework, single-needle micro tattoos, botanical art, delicate typography, and subtle geometric symbols. Guided by lead artist Peace, every fine-line piece is crafted to look clean, elegant, and perfectly balanced on your skin.",
    heroTrustPoints: [
      RATING_LABEL,
      "100% single-use sterile gear",
      "Lead artist Peace — fine-line & precision specialist",
      SHORT_ADDRESS,
    ],
    heroImage: minimalistHero,
    thumbImage: minimalistThumb,
    cardImage: minimalistCard,
    heroImageAlt:
      "Fine-line sun, moon and script minimalist tattoo along the spine at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    galleryImages: [
      { src: minimalistGallery1, alt: "Fine-line butterfly and heart tattoo on arm" },
      { src: minimalistGallery2, alt: "Fine-line floral face line-art tattoo on arm" },
      { src: minimalistGallery3, alt: "Minimalist lightning bolt tattoo on wrist" },
      { src: minimalistGallery4, alt: "Minimalist line-art panda tattoo on arm" },
      { src: minimalistGallery5, alt: "Fine-line moon and star tattoo on chest" },
      { src: minimalistGallery6, alt: "Fine-line heart and birds tattoo on collarbone" },
      { src: minimalistGallery7, alt: "Fine-line heart of flowers tattoo on wrist" },
      { src: minimalistGallery8, alt: "Single-line rose tattoo on arm" },
      { src: minimalistGallery9, alt: "Fine-line Om symbol tattoo on forearm" },
      { src: minimalistGallery10, alt: "Fine-line crescent moon and lotus tattoo on shoulder" },
      { src: minimalistGallery11, alt: "Fine-line orchid flowers tattoo on ribs" },
      { src: minimalistGallery12, alt: "Minimalist finger-heart line tattoo on wrist" },
      { src: minimalistGallery13, alt: "Single-line daisy flower tattoo on forearm" },
      {
        src: minimalistGallery14,
        alt: "Fine-line open book with moon and stars tattoo on forearm",
      },
      { src: minimalistGallery15, alt: "Fine-line sword and circle emblem tattoo on ankle" },
      { src: minimalistGallery16, alt: "Fine-line sparkling butterfly tattoo on arm" },
      { src: minimalistGallery17, alt: "Fine-line lily flower tattoo on ribs" },
      { src: minimalistGallery18, alt: "Fine-line open book and stars tattoo on wrist" },
      {
        src: minimalistGallery19,
        alt: "Fine-line lotus and unalome tattoo running down the forearm",
      },
      { src: minimalistGallery20, alt: "Fine-line dreamcatcher mandala tattoo on ankle" },
      { src: minimalistGallery21, alt: "Minimalist sun and rune symbols tattoo on wrist" },
    ],
    introParagraphs: [
      "Minimalist tattoos say less and mean just as much. Fine single-needle lines, small-scale symbols and negative space do the work that shading and colour do in bigger pieces.",
      "It's also the friendliest entry point into tattoos — short sessions, lower pain, and a scale that's easy to place discreetly.",
    ],
    characteristics: [
      "Fine, single-needle linework",
      "Small-scale symbols, script or delicate icons",
      "Deliberate use of negative space",
      "Usually monochrome, occasionally a single accent colour",
    ],
    bestFor: [
      "First-time tattoo clients",
      "Dainty placements — wrist, ankle, behind the ear, ribs",
      "Meaningful small symbols or initials",
      "Starter pieces for a future collection or sleeve",
    ],
    whyChooseTitle: "Is a Minimalist Tattoo Right for You?",
    whyChooseIntro: "Tap a card to see if fine-line ink fits what you're looking for.",
    benefitCards: [
      {
        icon: "heal",
        title: "Low Discomfort & Fast Healing",
        text: "Ideal for first-timers; minimal skin trauma means lightning-fast 10–14 day healing.",
        detailTitle: "Good for you if…",
        detail: [
          "This is your first tattoo and you want an easy start",
          "You'd like a short sitting — most pieces take 30 minutes to 1.5 hours",
          "You want to be back to normal routine within two weeks",
        ],
      },
      {
        icon: "placement",
        title: "Subtle Personal Expression",
        text: "Elegantly placed on inner wrists, collarbones, behind ears, or ankles for discreet charm.",
        detailTitle: "Popular placements",
        detail: ["Inner wrist", "Collarbone", "Behind the ear", "Ankle", "Ribs", "Fingers"],
      },
      {
        icon: "precision",
        title: "Maximum Precision",
        text: "Single-needle technology ensures clean lines with zero blowouts or heavy ink-bleeding.",
        detailTitle: "How we keep lines crisp",
        detail: [
          "1RL and 3RL micro-needles for razor-thin strokes",
          "Stencil sized exactly for your chosen placement",
          "Every line checked before you leave the chair",
        ],
      },
    ],
    explainer: {
      title: "What Is Fine-Line & Minimalist Tattooing?",
      paragraphs: [
        "Fine-line tattooing uses single micro-needles (1RL or 3RL) to create razor-thin, delicate strokes instead of thick traditional outlines.",
        "Minimalist art keeps only the lines that matter — clean shapes and open negative space, so a small design still reads clearly on the skin.",
      ],
      idealStylesTitle: "Ideal Styles",
      idealStyles: [
        "Small symbols",
        "Single-word scripts",
        "Birth-year numerals",
        "Mini pets",
        "Fine-line florals",
        "Subtle finger art",
      ],
    },
    aftercareTitle: "Minimalist Tattoo Aftercare Guide",
    aftercareIntro:
      "Fine lines heal differently from bold or colour work. Follow these four steps to keep every line sharp.",
    aftercareSteps: [
      {
        title: "Gentle Cleaning",
        text: "Wash gently with mild unscented soap; avoid rubbing the delicate line work.",
      },
      {
        title: "Micro-Moisturizing",
        text: "Apply a micro-thin layer of tattoo butter; fine lines require far less ointment than heavy colour tattoos.",
      },
      {
        title: "Sun & Water Shield",
        text: "Avoid swimming, saunas, and direct sunlight for 14 days to prevent premature fading of thin lines.",
      },
      {
        title: "No Picking",
        text: "Allow fine skin flakes to shed naturally to preserve line sharpness.",
      },
    ],
    ctaHeadline: "Ready for Your First or Next Subtle Piece?",
    ctaSubcopy: "Tell us your idea — we'll size it, stencil it and quote it, no pressure.",
    quickFacts: {
      sessionTime: "30 min – 1.5 hrs",
      painScore: 2,
      painLabel: "Low–Moderate",
      healingTime: "10–14 days",
      touchUp: "1 free line touch-up within 60 days",
    },
    process: [
      {
        title: "Concept & Placement",
        text: "We refine the idea down to its simplest, strongest version.",
      },
      {
        title: "Simplify to Core Lines",
        text: "Only the linework that earns its place makes it into the final design.",
      },
      {
        title: "Fine-Line Stencil Sizing",
        text: "Sized precisely for the placement you've chosen.",
      },
      {
        title: "Single-Pass Tattooing",
        text: "Most minimalist pieces are completed in one clean pass.",
      },
      {
        title: "Line Integrity Check",
        text: "We check every line is crisp and unbroken before you leave.",
      },
    ],
    aftercare: [
      {
        period: "Day 1–3",
        title: "Fresh & Fragile",
        advice: [
          "Use a minimal amount of ointment — over-moisturising can blow out fine lines",
          "Keep any bandage on for the time your artist specifies",
          "Wash gently with fragrance-free soap",
        ],
      },
      {
        period: "Day 4–7",
        title: "The Peel",
        advice: [
          "Light peeling is normal — absolutely no picking",
          "Fine lines are the most prone to gaps or blowouts if scratched",
          "Avoid tight clothing rubbing against the area",
        ],
      },
      {
        period: "Week 1–2",
        title: "The Itch",
        advice: [
          "Keep the area clean and lightly moisturised",
          "Avoid direct sun, pools and saunas until fully healed",
        ],
      },
      {
        period: "Long Term",
        title: "Settle & Shine",
        advice: [
          "Fine lines fade fastest of all styles — daily SPF makes a real difference",
          "A touch-up every few years keeps the linework crisp",
        ],
      },
    ],
    faqs: [
      {
        question: "Do fine-line and minimalist tattoos fade faster?",
        answer:
          "Fine-line tattoos require precise needle depth. When done by experienced artists using high-density carbon ink, they hold crisp details for years. Free touch-ups are offered within 60 days if needed.",
      },
      {
        question: "How much does a small minimalist tattoo cost at Xing Premium Tattoo Studio Brookefield?",
        answer:
          "Small, simple minimalist pieces start at our base shop minimum. Pricing varies based on placement and linework complexity.",
      },
      {
        question: "Can I bring my own handwritten note or reference for a minimalist tattoo?",
        answer:
          "Absolutely! We frequently convert handwritten family notes, signatures, and custom doodles into exact fine-line stencils.",
      },
      {
        question: "Is minimalist less painful than other styles?",
        answer:
          "Generally, yes. Shorter sessions and lighter needle saturation make it one of the more comfortable styles to sit for.",
      },
      {
        question: "Can a minimalist tattoo be added to later?",
        answer:
          "Absolutely — it's a great starting point for a future collection of small pieces, or the seed of a larger design down the line.",
      },
      {
        question: "What placements work best for minimalist designs?",
        answer:
          "Wrists, ankles, behind the ear and ribs are popular — anywhere the design can stay clean and undistorted by movement.",
      },
    ],
    relatedSlugs: ["geometric", "traditional"],
  },
};

export function getService(slug: string): ServiceContent | undefined {
  return services[slug as ServiceSlug];
}
