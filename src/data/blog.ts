import { posts, POSTS_PER_PAGE } from "virtual:blog";

import { BUSINESS_ID, SERVICE_AREAS, SITE_URL } from "@/data/business";

export { posts, POSTS_PER_PAGE };

export const BLOG_CATEGORIES = [
  { slug: "tattoo-guides", label: "Tattoo Guides" },
  { slug: "aftercare-safety", label: "Aftercare & Safety" },
  { slug: "styles-ideas", label: "Styles & Ideas" },
  { slug: "meanings-culture", label: "Meanings & Culture" },
  { slug: "placement", label: "Placement" },
  { slug: "cover-ups-touch-ups", label: "Cover-Ups & Touch-Ups" },
  { slug: "local-bangalore", label: "Local: Bangalore" },
  { slug: "studio-stories", label: "Studio Stories" },
] as const;

export const categoryLabel = (slug: string) =>
  BLOG_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

/** Categories that have at least one live post. */
export const activeCategories = BLOG_CATEGORIES.filter((c) =>
  posts.some((p) => p.category === c.slug),
);

export const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
export const postsForPage = (page: number) =>
  posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
/** Live post by its outline number (#01–#50), or undefined if not live yet. */
export const postByNumber = (n: number) => posts.find((p) => p.number === n);

/** 3 related posts: same category first, then shared tags, then newest. */
export function relatedPosts(post: Pick<BlogPostMeta, "slug" | "category" | "tags">, count = 3) {
  const score = (p: BlogPostMeta) =>
    (p.category === post.category ? 10 : 0) + p.tags.filter((t) => post.tags.includes(t)).length;
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, count)
    .map(({ p }) => p);
}

/** Topic sections on /blog, between Featured Guides and Signature Services. Each links
 *  "View all" to an existing category; posts that aren't live yet are skipped. */
export const BLOG_SECTIONS: {
  id: string;
  title: string;
  intro: string;
  category: (typeof BLOG_CATEGORIES)[number]["slug"];
  slugs: string[];
}[] = [
  {
    id: "local-guides",
    title: "Local Guides: Brookefield, Whitefield & ITPL",
    intro:
      "For anyone living or working around AECS Layout, Kundalahalli, ITPL, Whitefield or Marathahalli.",
    category: "local-bangalore",
    slugs: [
      "tattoo-studio-aecs-layout-brookefield",
      "tattoo-studio-near-kundalahalli-gate",
      "tattoo-artists-east-bangalore-it-professionals",
      "tattoo-studio-near-itpl-main-road",
    ],
  },
  {
    id: "cost-safety-aftercare",
    title: "Cost, Safety & Aftercare Answers",
    intro: "For anyone asking what it costs, whether it's safe and how to heal it well.",
    category: "aftercare-safety",
    slugs: [
      "small-fine-line-tattoo-cost-bangalore",
      "safe-tattoo-needle-cartridges-sterilisation",
      "tattoo-consultation-what-happens",
      "workout-after-tattoo",
      "post-tattoo-adrenaline-crash",
      "vegan-vs-traditional-tattoo-inks",
    ],
  },
  {
    id: "plan-your-tattoo",
    title: "Plan Your Tattoo",
    intro: "For first-timers and collectors deciding size, style, lettering and the final sketch.",
    category: "tattoo-guides",
    slugs: [
      "custom-sleeve-tattoo-sessions-timeline",
      "approve-tattoo-sketch-stencil",
      "script-calligraphy-tattoo-fonts",
      "micro-realism-tattoos",
      "white-ink-tattoos-indian-skin",
    ],
  },
  {
    id: "styles-life-moments",
    title: "Styles & Life Moments",
    intro: "For ideas: new styles, family pieces, milestones and travel memories.",
    category: "styles-ideas",
    slugs: [
      "cyberpunk-neo-tribal-tattoos-bangalore",
      "japanese-irezumi-vs-realism-sleeve",
      "sibling-family-tattoo-ideas",
      "birthday-milestone-tattoos",
      "travel-tattoo-ideas",
    ],
  },
];

/** Guides featured on the home page: the questions people ask before booking (cost, pain,
 *  skin tone, aftercare, first tattoo) plus the local guide. Live posts only are shown. */
export const HOME_GUIDES = [
  "tattoo-studio-aecs-layout-brookefield",
  "tattoo-cost-in-bangalore",
  "tattoo-pain-chart",
  "tattoo-aftercare-guide",
  "tattoos-on-indian-skin",
  "first-tattoo-guide-bangalore",
];

/** Guides linked from each service page (live posts only are shown). */
export const SERVICE_GUIDES: Record<string, string[]> = {
  realism: ["realism-tattoos-guide", "micro-realism-tattoos", "japanese-irezumi-vs-realism-sleeve"],
  portrait: ["portrait-tattoo-reference-photo", "memorial-tattoo-ideas", "pet-portrait-tattoos"],
  "black-grey": [
    "black-grey-vs-colour-tattoos",
    "custom-sleeve-tattoo-sessions-timeline",
    "tattoos-on-indian-skin",
  ],
  geometric: [
    "geometric-mandala-tattoos",
    "cyberpunk-neo-tribal-tattoos-bangalore",
    "travel-tattoo-ideas",
  ],
  traditional: [
    "indian-traditional-tattoos",
    "lord-shiva-tattoo-designs",
    "om-trishul-spiritual-tattoos",
  ],
  minimalist: [
    "fine-line-tattoos",
    "minimalist-tattoo-ideas",
    "small-fine-line-tattoo-cost-bangalore",
  ],
};

export const sectionPosts = (slugs: string[]) =>
  slugs
    .map(postBySlug)
    .filter((p): p is BlogPostMeta => !!p)
    .slice(0, 6);

export const featuredPosts = posts.filter((p) => p.featured).slice(0, 3);

/** Every post shown on /blog (featured, topic sections, first page), once each — for the ItemList. */
export const blogIndexPosts = () => {
  const seen = new Set<string>();
  return [
    ...featuredPosts,
    ...BLOG_SECTIONS.flatMap((s) => sectionPosts(s.slugs)),
    ...postsForPage(1),
  ].filter((p) => !seen.has(p.slug) && !!seen.add(p.slug));
};

export const formatPostDate = (iso: string) =>
  new Date(`${iso}T12:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

export const absoluteUrl = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);

/** Signature services — local SEO blocks on /blog and (compact) on every post. */
export const SIGNATURE_SERVICES: {
  title: string;
  blurb: string;
  image: string;
  imageAlt: string;
  serviceHref: string;
  guides: number[];
}[] = [
  {
    title: "Realism & 3D Tattoos in Brookefield",
    blurb:
      "Photo-real depth, shadow and texture — drawn from scratch and inked by Peace in AECS Layout, for clients across Whitefield and Marathahalli.",
    image: "/blog/signature-realism.webp",
    imageAlt:
      "Realistic angel wings tattoo on forearm by Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    serviceHref: "/services/realism",
    guides: [7],
  },
  {
    title: "Portrait & Memorial Tattoos, Bangalore",
    blurb:
      "Faces, pets and tributes captured with fine shading. Bring a clear reference photo — we'll guide the size and placement.",
    image: "/blog/signature-portrait.webp",
    imageAlt:
      "Memorial portrait tattoo of a grandmother with a date by Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    serviceHref: "/services/portrait",
    guides: [8, 9],
  },
  {
    title: "Fine Line & Minimalist Tattoos, AECS Layout",
    blurb:
      "Delicate linework, tiny symbols and scripts with precise needle depth so they heal crisp — ideal first tattoos.",
    image: "/blog/signature-fine-line.webp",
    imageAlt:
      "Fine-line floral face line-art tattoo on arm by Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    serviceHref: "/services/minimalist",
    guides: [13],
  },
  {
    title: "Black & Grey Tattoos near Whitefield",
    blurb:
      "Smooth charcoal shading and contrast that ages beautifully on Indian skin tones — from forearm pieces to full back panels.",
    image: "/blog/signature-black-grey.webp",
    imageAlt:
      "Black and grey samurai tattoo on forearm by Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    serviceHref: "/services/black-grey",
    guides: [11],
  },
  {
    title: "Indian Traditional & Spiritual Tattoos",
    blurb:
      "Shiva, Hanuman, Om and Trishul designs drawn respectfully with meaning, detail and balance, with every symbol and script checked before ink.",
    image: "/blog/signature-traditional.webp",
    imageAlt:
      "Lord Shiva realism tattoo on forearm by Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    serviceHref: "/services/traditional",
    guides: [16],
  },
  {
    title: "Geometric & Mandala Tattoos near Marathahalli",
    blurb:
      "Sacred geometry, dotwork and symmetry mapped to your body's shape, so every line sits straight and the pattern flows with you.",
    image: "/blog/signature-geometric.webp",
    imageAlt:
      "Geometric mandala tattoo on the back of the hand by Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    serviceHref: "/services/geometric",
    guides: [15],
  },
  {
    title: "Sleeve & Large-Scale Tattoos",
    blurb:
      "Half and full sleeves, chest and back pieces planned in sessions for seamless flow — one story, mapped across your arm or back.",
    image: "/blog/signature-sleeve.webp",
    imageAlt:
      "Geometric arm sleeve tattoo with rhino and tree by Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    serviceHref: "/services#sleeve",
    guides: [19],
  },
  {
    title: "Cover-Ups, Rework & Touch-Ups",
    blurb:
      "Old or faded tattoo? Peace assesses your ink and designs a fresh piece or restores what you have — honest advice on what will work.",
    image: "/blog/signature-cover-up.webp",
    imageAlt:
      "Before and after cover-up tattoo on forearm by Peace at Xing Premium Tattoo Studio, Brookefield, Bengaluru",
    serviceHref: "/services#cover-ups-reworks",
    guides: [20, 21],
  },
];

/** ItemList of Service items for the Signature Services block. */
export function signatureServicesSchema() {
  return {
    "@type": "ItemList",
    name: "Signature Tattoo Services in Brookefield, Bangalore",
    itemListElement: SIGNATURE_SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.blurb,
        url: absoluteUrl(s.serviceHref),
        provider: { "@id": BUSINESS_ID },
        areaServed: SERVICE_AREAS,
      },
    })),
  };
}
