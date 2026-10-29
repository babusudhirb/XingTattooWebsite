import { SERVICE_SLUGS, services, type ServiceSlug } from "./services";
import { studioPhotos } from "./studio-photos";

export interface GalleryItem {
  img: string;
  tag: string;
  alt: string;
}

export const STUDIO_TAG = "Studio";

/** Style photos and their smaller copies (scripts/optimize-images.mjs), as built URLs. */
const STYLE_FILES = import.meta.glob<string>("/src/assets/services/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});
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
  if (src.startsWith("/images/gallery/"))
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
