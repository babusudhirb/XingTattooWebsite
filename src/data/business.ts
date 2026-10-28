/**
 * Single source of truth for the studio's business details (name, address, phone,
 * hours, rating, stats). Every page, the footer, the schema, meta tags, CTAs and the
 * blog (through {{tokens}}, see BLOG_TOKENS) read from here — never hard-code a copy.
 * Spelling rules: "Brookefield", "DMART Ready", "Bengaluru" in addresses and running
 * text, "Bangalore" only in the business name and keyword-led titles/H1s.
 */

/** Full name exactly as on the GBP — titles, footer, schema, og:site_name. */
export const BUSINESS_NAME = "Xing Premium Tattoo Studio - Brookefield, Bangalore";
/** Short brand name for body copy and buttons. */
export const BRAND_NAME = "Xing Premium Tattoo Studio";
export const SHORT_NAME = BRAND_NAME;
/** Home-screen / app name. */
export const APP_NAME = "Xing Tattoo";
export const GBP_CATEGORY = "Tattoo Shop";

export const SITE_URL = "https://www.xingtattoo.in";
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ADDRESS = {
  /** Display line, verbatim from the GBP. */
  /** Display line, character for character as on the GBP (which spells the locality "Brookfield"). */
  full: "SV Plaza, 267, 60 Feet Road, Above DMART Ready, AECS Layout, Brookfield, Bengaluru, Karnataka 560037, India",
  /** Schema streetAddress (the GBP street line). */
  street: "SV Plaza, 267, 60 Feet Road, Above DMART Ready, AECS Layout",
  sublocality: "Brookfield",
  locality: "Bengaluru",
  region: "Karnataka",
  postalCode: "560037",
  country: "IN",
  landmark: "above DMART Ready on 60 Feet Road, AECS Layout",
};
/** Short address for compact UI (eyebrows, trust points, booking notes). */
export const SHORT_ADDRESS = "Above DMART Ready, AECS Layout, Brookefield";

export const GEO = { lat: 12.9634586, lng: 77.7090884 };

export const PHONE_DISPLAY = "+91 89700 07818";
export const PHONE_E164 = "+918970007818";
export const PHONE_TEL = `tel:${PHONE_E164}`;
export const WHATSAPP_URL = "https://wa.me/918970007818";
/** Not on the GBP — kept from the existing site. */
export const EMAIL = "xingtattoo.aecs@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/xingtattoo_blr/";

export const MAPS_PLACE_URL = "https://www.google.com/maps?cid=12620788765505602551";
export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Xing+Premium+Tattoo+Studio+Brookefield+Bangalore";
/** No embed snippet was supplied (the owner's location.html is empty), so this is the coordinate fallback. */
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${GEO.lat},${GEO.lng}&z=17&output=embed`;

export const GOOGLE_RATING = 4.9;
/** Update when the GBP count changes. */
export const REVIEW_COUNT = 211;
/** The one rating format used on every page. */
export const RATING_LABEL = `${GOOGLE_RATING}★ · ${REVIEW_COUNT} Google reviews`;

/** Site-wide counts. One value, used everywhere. */
export const COUNTS = { tattoos: "1800+", clients: "1200+", years: "15+", since: "2021" };
/** The one stats line: "1800+ tattoos · 1200+ happy clients · 15+ years experience · since 2021". */
export const STATS_LABEL = `${COUNTS.tattoos} tattoos · ${COUNTS.clients} happy clients · ${COUNTS.years} years experience · since ${COUNTS.since}`;

/** Full name on the first mention on a page, then just "Peace" (never "Artist Peace"). */
export const LEAD_ARTIST = {
  name: "Peace",
  fullName: "Peace (Chingri Awungshi)",
  role: "Lead Artist",
  years: COUNTS.years,
};

export const SERVICE_AREAS = [
  "Brookefield",
  "AECS Layout",
  "Marathahalli",
  "Whitefield",
  "Bengaluru",
];

/** Opening hours, Monday-first. Day numbers match Date.getDay(). */
export const OPEN_TIME = "10:00";
export const CLOSE_TIME = "21:00";
export const OPEN_LABEL = "10 AM – 9 PM";
/** Hours as text — the one format used on every page (and matched by the schema below). */
export const HOURS_TEXT = `Mon ${OPEN_LABEL} · Tue Closed · Wed–Sun ${OPEN_LABEL}`;
export const HOURS_SHORT = HOURS_TEXT;
export const HOURS_LONG = HOURS_TEXT;
export const HOURS_OPEN_DAYS = "Mon, Wed–Sun";
export const HOURS: {
  day: number;
  short: string;
  long: string;
  closed?: boolean;
}[] = [
  { day: 1, short: "Mon", long: "Monday" },
  { day: 2, short: "Tue", long: "Tuesday", closed: true },
  { day: 3, short: "Wed", long: "Wednesday" },
  { day: 4, short: "Thu", long: "Thursday" },
  { day: 5, short: "Fri", long: "Friday" },
  { day: 6, short: "Sat", long: "Saturday" },
  { day: 0, short: "Sun", long: "Sunday" },
];
export const CLOSED_DAY = 2;
/** Hours rows in the one site format — Mon · Tue Closed · Wed–Sun (same grouping as HOURS_TEXT). */
export const HOURS_ROWS: { label: string; days: number[]; closed?: boolean }[] = [
  { label: "Mon", days: [1] },
  { label: "Tue", days: [2], closed: true },
  { label: "Wed–Sun", days: [3, 4, 5, 6, 0] },
];

/** Current GBP offer post. Banners and CTAs hide after `validThrough` (India time). */
export const OFFER = {
  title: "Up to 50% off custom tattoos",
  validFrom: "2026-10-25",
  validThrough: "2026-11-30",
  /** Short end date for banners, e.g. "Valid till 30 Nov 2026". */
  endsLabel: "30 Nov 2026",
  validLabel: "Valid till 30 Nov 2026",
  url: "/offer",
};

/** Today's date in the studio's time zone, as YYYY-MM-DD. */
export const studioDate = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);

export const isOfferActive = (now = new Date()) => {
  const today = studioDate(now);
  return today >= OFFER.validFrom && today <= OFFER.validThrough;
};

/** The one attributes line shown on the site. */
export const ATTRIBUTES_LABEL =
  "Wheelchair accessible · Free Wi-Fi · Gender-neutral restroom · LGBTQ+ friendly · Cards & Google Pay";

/** GBP attributes (schema amenityFeature). */
export const ATTRIBUTES = {
  accessibility: ["Wheelchair-accessible seating", "Wheelchair-accessible restroom"],
  amenities: ["Gender-neutral restroom", "Free Wi-Fi"],
  crowd: ["LGBTQ+ friendly"],
  payments: ["Credit cards", "Debit cards", "Google Pay", "MasterCard", "VISA"],
};

/** GBP service names — names only, never prices. Anchors on /services use `serviceAnchor`. */
export const serviceAnchor = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const GBP_SERVICES = [
  "Custom Tattoo Design & Planning",
  "Tattoo Consultations",
  "Placement Consultations",
  "Realism / 3D Photo-Real",
  "3D-Style",
  "Portrait & Realism Art",
  "Memorial",
  "Black and Grey",
  "Colour / Colour Realism",
  "Geometric Patterns & Mandalas",
  "Geometric & Dotwork",
  "Fine Line",
  "Minimalist & Micro",
  "Script, Calligraphy & Lettering",
  "Indian Traditional",
  "Traditional / American Traditional",
  "Neo-Traditional",
  "Traditional Asian & Japanese",
  "Tribal",
  "Maori",
  "Chicano",
  "Solid Blackwork",
  "Abstract",
  "Figurative",
  "Watercolour",
  "Sleeve",
  "Large Scale & Full Body",
  "Female",
  "Male",
  "Intimate",
  "Flash & Freehand",
  "Cover-Ups & Reworks",
  "Rework & Restoration",
  "Touch-Ups",
  "Finishing",
  "Scar Camouflage",
  "Sensitive Skin Solutions",
  "Henna",
  "Aftercare Instruction",
  "Healing Monitoring",
];

/**
 * Page <title>: "… | Xing Premium Tattoo Studio" when that fits in 60 characters,
 * otherwise "… | Xing Premium". Pass the title without any suffix.
 */
export const TITLE_SUFFIX_LONG = " | Xing Premium Tattoo Studio";
export const TITLE_SUFFIX_SHORT = " | Xing Premium";
export const pageTitle = (base: string) => {
  const bare = base.replace(/\s*\|\s*Xing Premium( Tattoo Studio)?\s*$/, "");
  return (bare + TITLE_SUFFIX_LONG).length <= 60
    ? bare + TITLE_SUFFIX_LONG
    : bare + TITLE_SUFFIX_SHORT;
};

/** {{token}} values the blog pipeline substitutes into content/blog/*.md (frontmatter and body). */
export const BLOG_TOKENS: Record<string, string> = {
  address: ADDRESS.full,
  landmark: ADDRESS.landmark,
  phone: PHONE_DISPLAY,
  tel: PHONE_TEL,
  whatsapp: WHATSAPP_URL,
  email: EMAIL,
  hours: HOURS_TEXT,
  rating: RATING_LABEL,
  stars: `${GOOGLE_RATING}★`,
  reviews: String(REVIEW_COUNT),
  tattoos: COUNTS.tattoos,
  clients: COUNTS.clients,
  years: COUNTS.years,
  since: COUNTS.since,
};

/** Default social image (1200×630, made by scripts/blog_images.py). Services and the artist page have their own. */
export const OG_IMAGE = `${SITE_URL}/og/og-default.jpg`;
export const OG_IMAGE_ALT =
  "Tattoo work by Peace at Xing Premium Tattoo Studio, Brookefield, Bangalore";
/** Photos of the studio's work for the business schema (absolute URLs). */
export const BUSINESS_PHOTOS = [
  OG_IMAGE,
  `${SITE_URL}/blog/signature-realism.webp`,
  `${SITE_URL}/blog/signature-portrait.webp`,
];
export const LOGO_URL = `${SITE_URL}/xing-logo.webp`;

/** Geo meta tags for the site <head>. */
export const GEO_META = [
  { name: "geo.region", content: "IN-KA" },
  { name: "geo.placename", content: "Brookefield, Bengaluru" },
  { name: "geo.position", content: `${GEO.lat};${GEO.lng}` },
  { name: "ICBM", content: `${GEO.lat}, ${GEO.lng}` },
];

/** The one site-wide business block (no review/aggregateRating markup — Google disallows
 *  marking up third-party reviews on your own LocalBusiness page). */
export const businessSchema = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "@id": BUSINESS_ID,
  name: BUSINESS_NAME,
  alternateName: BRAND_NAME,
  description: `Custom tattoo studio in AECS Layout, Brookefield, Bengaluru (${ADDRESS.landmark}). Lead Artist ${LEAD_ARTIST.fullName} (${COUNTS.years} years) designs every tattoo from scratch — realism, portraits, Black & Grey, geometric, Indian traditional and minimalist fine-line. Sterile, single-use equipment. Free consultation.`,
  url: `${SITE_URL}/`,
  telephone: PHONE_E164,
  email: EMAIL,
  image: BUSINESS_PHOTOS,
  logo: LOGO_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.locality,
    addressRegion: ADDRESS.region,
    postalCode: ADDRESS.postalCode,
    addressCountry: ADDRESS.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
  hasMap: MAPS_PLACE_URL,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: HOURS.filter((h) => !h.closed).map((h) => h.long),
      opens: OPEN_TIME,
      closes: CLOSE_TIME,
    },
  ],
  areaServed: SERVICE_AREAS,
  paymentAccepted: "Credit Card, Debit Card, Google Pay",
  amenityFeature: [...ATTRIBUTES.accessibility, ...ATTRIBUTES.amenities, ...ATTRIBUTES.crowd].map(
    (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
  ),
  foundingDate: COUNTS.since,
  founder: { "@type": "Person", name: LEAD_ARTIST.fullName, jobTitle: LEAD_ARTIST.role },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Tattoo services",
    itemListElement: GBP_SERVICES.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
  sameAs: [MAPS_PLACE_URL, INSTAGRAM_URL],
};
