import { SERVICE_SLUGS, services } from "./services";
import { studioPhotos } from "./studio-photos";

export interface GalleryItem {
  img: string;
  tag: string;
  alt: string;
}

export const STUDIO_TAG = "Studio";

/** srcset for studio photos, which have a 480px copy alongside (scripts/optimize-images.mjs). */
export const gallerySrcSet = (src: string) =>
  src.startsWith("/gallery/")
    ? `${src.replace(/\.webp$/, "-480.webp")} 480w, ${src} 800w`
    : undefined;
/** Grid columns: 2 on phones, 3 from sm, 4 from lg, 5 from xl. */
export const GALLERY_SIZES =
  "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

export const galleryFilters = ["All", ...SERVICE_SLUGS.map((slug) => services[slug].shortName)];

const styledGallery: GalleryItem[] = SERVICE_SLUGS.flatMap((slug) => {
  const service = services[slug];
  return [
    { img: service.heroImage, tag: service.shortName, alt: service.heroImageAlt },
    ...service.galleryImages.map((g) => ({ img: g.src, tag: service.shortName, alt: g.alt })),
  ];
});

const studioGallery: GalleryItem[] = studioPhotos.map((p) => ({
  img: p.src,
  tag: STUDIO_TAG,
  alt: p.alt,
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
