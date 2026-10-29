# Route inventory (before Phase 2)

Taken 2026-10-29 from the production preview (`npm run build && npm run preview`).

| Route file                               | URL                           | Status          | Title                                        | H1                         | Nav                                                               | Footer | Sitemap |
| ---------------------------------------- | ----------------------------- | --------------- | -------------------------------------------- | -------------------------- | ----------------------------------------------------------------- | ------ | ------- |
| `src/routes/index.tsx`                   | /                             | 200             | Tattoo Studio in Brookefield, Bangalore      | Xing Premium               | Premium Tattoo Studio in Brookefield, Bangalore                   | yes    | yes     | yes |
| `src/routes/services/index.tsx`          | /services                     | 200             | Tattoo Services in Brookefield, Bangalore    | Xing Premium               | Tattoo Services in Brookefield, Bangalore                         | yes    | yes     | yes |
| `src/routes/services/$slug.tsx`          | /services/realism             | 200             | Realism Tattoos in Bangalore                 | Xing Premium Tattoo Studio | Realism Tattoos in Brookefield, Bangalore                         | yes    | yes     | yes |
| `src/routes/services/$slug.tsx`          | /services/portrait            | 200             | Portrait Tattoos in Bangalore                | Xing Premium Tattoo Studio | Portrait Tattoos in Brookefield, Bangalore                        | yes    | yes     | yes |
| `src/routes/services/$slug.tsx`          | /services/black-grey          | 200             | Black & Grey Tattoos in Bangalore            | Xing Premium               | Black & Grey Tattoos in Brookefield, Bangalore                    | yes    | yes     | yes |
| `src/routes/services/$slug.tsx`          | /services/geometric           | 200             | Geometric & Mandala Tattoos in Bangalore     | Xing Premium               | Geometric & Mandala Tattoos in Brookefield, Bangalore             | yes    | yes     | yes |
| `src/routes/services/$slug.tsx`          | /services/traditional         | 200             | Indian Traditional Tattoos in Bangalore      | Xing Premium               | Indian Traditional Tattoos in Brookefield, Bangalore              | yes    | yes     | yes |
| `src/routes/services/$slug.tsx`          | /services/minimalist          | 200             | Fine Line & Minimalist Tattoos in Bangalore  | Xing Premium               | Minimalist & Fine-Line Tattoos in Brookefield, Bangalore          | yes    | yes     | yes |
| `src/routes/tattoo-artist.tsx`           | /tattoo-artist                | 200             | Peace, Tattoo Artist, Brookefield, Bangalore | Xing Premium               | Peace (Chingri Awungshi), Tattoo Artist in Brookefield, Bangalore | yes    | yes     | yes |
| `src/routes/faq.tsx`                     | /faq                          | 200             | Tattoo FAQs: Cost, Pain & Aftercare          | Xing Premium               | Tattoo FAQs: Xing Premium Tattoo Studio, Brookefield              | yes    | yes     | yes |
| `src/routes/about.tsx`                   | /about                        | 200             | About Us: Tattoo Studio in AECS Layout       | Xing Premium               | About Xing Premium Tattoo Studio, Brookefield, Bangalore          | yes    | yes     | yes |
| `src/routes/offer.tsx`                   | /offer                        | 200             | Tattoo Offer in Brookefield, Bangalore       | Xing Premium               | Tattoo Offer in Brookefield, Bangalore: Up to 50% Off             | yes    | no      | yes |
| `src/routes/privacy-policy.tsx`          | /privacy-policy               | 200             | Privacy Policy                               | Xing Premium Tattoo Studio | Privacy Policy                                                    | no     | yes     | yes |
| `src/routes/terms-and-conditions.tsx`    | /terms-and-conditions         | 200             | Terms & Conditions                           | Xing Premium Tattoo Studio | Terms & Conditions                                                | no     | yes     | yes |
| `src/routes/blog/index.tsx`              | /blog                         | 200             | Tattoo Blog: Guides & Aftercare              | Xing Premium Tattoo Studio | Tattoo Guides & Ideas from Brookefield, Bangalore                 | yes    | yes     | yes |
| `src/routes/blog/category/$category.tsx` | /blog/category/<8 categories> | 200             | per item                                     | per item                   | —                                                                 | —      | yes     |
| `src/routes/blog/$slug.tsx`              | /blog/<40 live posts>         | 200             | per item                                     | per item                   | —                                                                 | —      | yes     |
| `src/routes/blog/page/$page.tsx`         | /blog/page/2                  | 200             | Tattoo Blog – Page 2                         | Xing Premium Tattoo Studio | Tattoo Guides & Ideas — Page 2                                    | no     | no      | no  |
| `src/routes/404.tsx`                     | /404                          | 200             | Page Not Found                               | Xing Premium Tattoo Studio | Page not found                                                    | no     | no      | no  |
| `(none)`                                 | /gallery                      | 301 → /#gallery |                                              |                            | no                                                                | no     | no      |
| `(none)`                                 | /contact                      | 404             | Page Not Found                               | Xing Premium Tattoo Studio | Page not found                                                    | no     | no      | no  |

## Crawl files

Before this branch, `/sitemap.xml`, `/robots.txt` and `/llms.txt` existed only in `.output/public` (written by `scripts/postbuild.mjs` after the build), so the dev server answered them with the router's HTML 404. There were no server routes for them. They are now written into `public/` by `scripts/generate-seo-files.mjs`.

## public/

- `.htaccess`
- `apple-touch-icon.png`
- `favicon-16.png`
- `favicon-32.png`
- `favicon.ico`
- `icon-192.png`
- `icon-512.png`
- `llms-full.txt`
- `llms.txt`
- `og-image.jpg`
- `robots.txt`
- `site.webmanifest`
- `sitemap-blog.xml`
- `sitemap-images.xml`
- `sitemap-pages.xml`
- `sitemap.xml`
- `xing-logo.png`
- `xing-logo.svg`
- `xing-logo.webp`
- folders: `blog/`, `gallery/`, `og/`
