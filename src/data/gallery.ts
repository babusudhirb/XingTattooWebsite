import { SERVICE_SLUGS, services, type ServiceSlug } from "./services";
import { studioPhotos } from "./studio-photos";

export interface GalleryItem {
  img: string;
  tag: string;
  alt: string;
}

export const STUDIO_TAG = "Studio";

/** Style photos and their smaller copies (scripts/optimize-images.mjs), as built URLs. */
const STYLE_FILES = import.meta.glob<string>(
  ["/src/assets/services/*/*.webp", "/src/assets/style-blackgrey.webp"],
  { eager: true, query: "?url", import: "default" },
);
/** Built URL of a style photo → its `-480` / `-720` copies. */
const STYLE_COPIES = new Map(
  Object.entries(STYLE_FILES)
    .filter(([file]) => !/-(320|480|720)\.webp$/.test(file))
    .map(([file, url]) => [
      url,
      {
        w480: STYLE_FILES[file.replace(/\.webp$/, "-480.webp")],
        w720: STYLE_FILES[file.replace(/\.webp$/, "-720.webp")],
        w320: STYLE_FILES[file.replace(/\.webp$/, "-320.webp")],
      },
    ]),
);

/** srcset for gallery photos: studio photos and style photos both have a 480px copy. */
export const gallerySrcSet = (src: string) => {
  if (src.startsWith("/gallery/"))
    return `${src.replace(/\.webp$/, "-480.webp")} 480w, ${src} 800w`;
  const small = STYLE_COPIES.get(src)?.w480;
  return small ? `${small} 480w, ${src} 1120w` : undefined;
};
/** srcset + sizes for a style card (560px file, 320px copy for two-column phone grids). */
export const cardSrcSet = (src: string) => {
  const small = STYLE_COPIES.get(src)?.w320;
  return small ? `${small} 320w, ${src} 560w` : undefined;
};
export const CARD_SIZES = "(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw";
/** srcset for a style's hero photo: 720px for phones, the full 1120px file from tablets up. */
export const heroSrcSet = (src: string) => {
  const mid = STYLE_COPIES.get(src)?.w720;
  return mid ? `${mid} 720w, ${src} 1120w` : undefined;
};
/** Grid columns: 2 on phones, 3 from sm, 4 from lg, 5 from xl. */
export const GALLERY_SIZES =
  "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

export const galleryFilters = ["All", ...SERVICE_SLUGS.map((slug) => services[slug].shortName)];

/** One style's photos: its hero, then its gallery. */
export const styleGallery = (slug: ServiceSlug): GalleryItem[] => {
  const service = services[slug];
  return [
    { img: service.heroImage, tag: service.shortName, alt: service.heroImageAlt },
    ...service.galleryImages.map((g) => ({ img: g.src, tag: service.shortName, alt: g.alt })),
  ];
};
const styledGallery: GalleryItem[] = SERVICE_SLUGS.flatMap(styleGallery);

/** The studio photos aren't sorted by style or captioned yet, so their alt says what we know:
 *  whose work it is and where (studio-photos.ts holds "… portfolio photo N"). */
export const studioGallery: GalleryItem[] = studioPhotos.map((p) => ({
  img: p.src,
  tag: STUDIO_TAG,
  alt: p.alt.replace(
    /^Xing Premium Tattoo Studio portfolio photo (\d+)$/,
    "Tattoo by Peace at Xing Premium Tattoo Studio, Brookefield, Bangalore (portfolio photo $1)",
  ),
}));

export const gallery: GalleryItem[] = [...styledGallery, ...studioGallery];

/**
 * Per-visitor memory of which photos were on screen, so the next visit leads
 * with ones they haven't seen. Browser storage can be unavailable (private
 * mode, blocked cookies) — then every visit is simply a fresh random mix.
 */
const SEEN_KEY = "xing:gallery-seen";

export function loadGallerySeen(): { visit: number; seen: Map<string, number> } {
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    if (raw) {
      const data = JSON.parse(raw) as { visit: number; seen: Record<string, number> };
      return { visit: data.visit, seen: new Map(Object.entries(data.seen)) };
    }
  } catch {
    // fall through to a fresh start
  }
  return { visit: 0, seen: new Map() };
}

export function saveGallerySeen(visit: number, seen: Map<string, number>, shown: GalleryItem[]) {
  for (const item of shown) seen.set(item.img, visit);
  try {
    window.localStorage.setItem(
      SEEN_KEY,
      JSON.stringify({ visit, seen: Object.fromEntries(seen) }),
    );
  } catch {
    // storage full or blocked — rotation just won't persist
  }
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * A fresh gallery order for each visit: every style's photos are shuffled,
 * then dealt out in rounds — one photo per style, styles in a random order
 * each round — so the first screenful always mixes styles and never shows
 * two photos of the same style back to back while more than one style remains.
 */
export function mixGallery(
  items: GalleryItem[],
  random: () => number = Math.random,
  /** img → the visit number it was last shown on; unseen photos come first. */
  lastSeen: ReadonlyMap<string, number> = new Map(),
) {
  const groups = new Map<string, GalleryItem[]>();
  for (const item of items) {
    const group = groups.get(item.tag) ?? [];
    group.push(item);
    groups.set(item.tag, group);
  }
  // Piles are dealt from the end, so order each one most-recently-seen first:
  // never-seen photos sit at the end and come out first. Shuffling before the
  // (stable) sort keeps ties random.
  const seenAt = (item: GalleryItem) => lastSeen.get(item.img) ?? -1;
  const piles = [...groups.values()].map((g) =>
    shuffle(g, random).sort((a, b) => seenAt(b) - seenAt(a)),
  );

  const mixed: GalleryItem[] = [];
  let lastTag: string | undefined;
  while (piles.some((p) => p.length > 0)) {
    let round = shuffle(
      piles.filter((p) => p.length > 0),
      random,
    );
    // Don't let a round start with the style that ended the previous one.
    if (round.length > 1 && round[0]![0]!.tag === lastTag) {
      round = [...round.slice(1), round[0]!];
    }
    for (const pile of round) {
      const item = pile.pop()!;
      mixed.push(item);
      lastTag = item.tag;
    }
  }
  return mixed;
}
