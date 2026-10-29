# Rename map

Planned before any file moved (restructure branch). Paths are relative to the project root.
URLs don't change: route files keep their names.

## Files

| Old                                                                  | New                                              |
| -------------------------------------------------------------------- | ------------------------------------------------ |
| `src/components/cta/BookCTA.tsx`                                     | `src/components/cta/BookingCta.tsx`              |
| `src/components/cta/CallCTA.tsx`                                     | `src/components/cta/CallCta.tsx`                 |
| `src/components/cta/DirectionsCTA.tsx`                               | `src/components/cta/DirectionsCta.tsx`           |
| `src/components/cta/WhatsAppCTA.tsx`                                 | `src/components/cta/WhatsAppCta.tsx`             |
| `src/components/cta/styles.ts`                                       | `src/components/cta/ctaStyles.ts`                |
| `src/components/booking/BookingCTA.tsx`                              | `src/components/booking/BookingSection.tsx`      |
| `src/components/faq/FaqSection.tsx`                                  | `src/components/faq/FaqAccordion.tsx`            |
| `src/components/sections/ReviewsSection.tsx`                         | `src/components/home/GoogleReviews.tsx`          |
| `src/components/sections/StudioHighlights.tsx`                       | `src/components/home/StudioHighlights.tsx`       |
| `src/components/sections/GalleryLightbox.tsx`                        | `src/components/gallery/GalleryLightbox.tsx`     |
| `src/components/sections/LazyGalleryLightbox.tsx`                    | `src/components/gallery/LazyGalleryLightbox.tsx` |
| `src/components/sections/ReadMore.tsx`                               | `src/components/ui/ReadMore.tsx`                 |
| `src/components/sections/SectionHeading.tsx`                         | `src/components/ui/SectionHeading.tsx`           |
| `src/components/sections/TattooFlash.tsx`                            | `src/components/decor/TattooFlash.tsx`           |
| `src/components/sections/Origami.tsx`                                | `src/components/decor/Origami.tsx`               |
| `src/components/blog/PostCard.tsx`                                   | `src/components/blog/BlogCard.tsx`               |
| `src/components/blog/BlogPostView.tsx`                               | `src/components/blog/BlogPostLayout.tsx`         |
| `src/components/blog/RelatedGuides.tsx`                              | `src/components/blog/RelatedPosts.tsx`           |
| `src/components/blog/BlogBits.tsx`                                   | `src/components/layout/Breadcrumbs.tsx`          |
| `src/components/services/ServiceTemplate.tsx`                        | `src/components/services/ServicePage.tsx`        |
| `src/components/services/ServiceInteractive.tsx`                     | `src/components/services/ServiceDetailCards.tsx` |
| `src/components/layout/MobileNav.tsx`                                | `src/components/layout/MobileNavDrawer.tsx`      |
| `src/components/layout/StudioBits.tsx`                               | `src/components/layout/StudioMap.tsx`            |
| `src/data/site.ts`                                                   | `src/data/navigation.ts`                         |
| `src/data/page-copy.ts`                                              | `src/data/page-content.ts`                       |
| `src/lib/routes.ts`                                                  | `src/data/routes.ts`                             |
| `src/lib/seo.ts`                                                     | `src/lib/seoHead.ts`                             |
| `src/lib/track.ts`                                                   | `src/lib/trackEvent.ts`                          |
| `src/lib/hours.ts`                                                   | `src/lib/openingHours.ts`                        |
| `src/lib/offer.ts`                                                   | `src/hooks/useOfferActive.ts`                    |
| `scripts/seo-audit.mjs`                                              | `scripts/qa/seo-audit.mjs`                       |
| `scripts/nap-check.mjs`                                              | `scripts/qa/nap-check.mjs`                       |
| `scripts/link-check.mjs`                                             | `scripts/qa/link-check.mjs`                      |
| `scripts/mobile-check.mjs`                                           | `scripts/qa/mobile-check.mjs`                    |
| `scripts/lighthouse.mjs`                                             | `scripts/qa/lighthouse.mjs`                      |
| `scripts/copy-budget.mjs`                                            | `scripts/qa/text-budget.mjs`                     |
| `scripts/check_blog.py`                                              | `scripts/qa/check-blog.py`                       |
| `scripts/blog_images.py`                                             | `scripts/blog-images.py`                         |
| `DEPLOY.md`                                                          | `docs/DEPLOY.md`                                 |
| `SEARCH-CONSOLE.md`                                                  | `docs/SEARCH-CONSOLE.md`                         |
| `BACKLINKS.md`                                                       | `docs/BACKLINKS.md`                              |
| `src/components/layout/MobileNavDrawer.tsx` (part: StickyContactBar) | `src/components/layout/StickyContactBar.tsx`     |
| `src/components/layout/StudioMap.tsx` (part: StudioAttributes)       | `src/components/layout/StudioAttributes.tsx`     |
| `src/components/layout/Breadcrumbs.tsx` (part: BlogVisitStrip)       | `src/components/blog/BlogVisitStrip.tsx`         |

## Components and functions

| Old               | New                |
| ----------------- | ------------------ |
| `BookingCTA`      | `BookingSection`   |
| `BookCTA`         | `BookingCta`       |
| `CallCTA`         | `CallCta`          |
| `DirectionsCTA`   | `DirectionsCta`    |
| `WhatsAppCTA`     | `WhatsAppCta`      |
| `FaqSection`      | `FaqAccordion`     |
| `ReviewsSection`  | `GoogleReviews`    |
| `PostCard`        | `BlogCard`         |
| `BlogPostView`    | `BlogPostLayout`   |
| `RelatedGuides`   | `RelatedPosts`     |
| `ServiceTemplate` | `ServicePage`      |
| `MobileMenu`      | `MobileNavDrawer`  |
| `MobileActionBar` | `StickyContactBar` |
| `AttributeChips`  | `StudioAttributes` |
| `LazyMap`         | `StudioMap`        |
| `VisitStrip`      | `BlogVisitStrip`   |

## Assets

See the "Assets" section appended by the asset pass.

## Deleted

- `.lovable/project.json`
- `scripts/audit_site.py`
- `scripts/__pycache__/blog_images.cpython-314.pyc`
- `public/og-image.jpg`
- `src/assets/gallery-1.webp`
- `src/assets/gallery-5.webp`
- `docs/inventory.md`
- `bun.lock`
- `bunfig.toml`
