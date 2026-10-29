import { lazy, Suspense, type ComponentProps } from "react";

import type { GalleryLightbox as GalleryLightboxType } from "@/components/gallery/GalleryLightbox";

const GalleryLightbox = lazy(() =>
  import("@/components/gallery/GalleryLightbox").then((m) => ({ default: m.GalleryLightbox })),
);

/** The photo lightbox, downloaded only when someone first opens a photo. */
export function LazyGalleryLightbox(props: ComponentProps<typeof GalleryLightboxType>) {
  if (props.index === null) return null;
  return (
    <Suspense fallback={null}>
      <GalleryLightbox {...props} />
    </Suspense>
  );
}
