# Xing Premium Tattoo Studio

Website for **Xing Premium Tattoo Studio**, Brookefield, Bengaluru. Built with TanStack Start, React,
TypeScript and Tailwind CSS. Every page is rendered to a static `.html` file at build time.

## Commands

```sh
npm install      # once
npm run dev      # local preview at http://localhost:3000
npm run build    # production build into .output/
```

## Where things are

```
src/
  routes/                 one file per page — the file name is the URL
    index.tsx             /                 (home)
    about.tsx             /about
    faq.tsx               /faq
    offer.tsx             /offer
    tattoo-artist.tsx     /tattoo-artist
    services/index.tsx    /services         (all tattoo designs)
    services/$slug.tsx    /services/realism, /services/portrait, …
    __root.tsx            the shell around every page (head tags, fonts)
  components/
    layout/               header, footer, mobile menu, logo, social dock
    booking/              booking popup and its buttons
    sections/             blocks reused across pages (reviews, gallery lightbox, …)
    services/             the template every tattoo-style page uses
    ui/                   basic controls (button, select, calendar, accordion)
  data/                   all text and lists: services, FAQs, reviews, offers, contact details
  styles/
    global.css            theme and site-wide styles
    offer-page.css        styles for /offer only
    fonts.css             self-hosted fonts
  assets/                 photos and fonts that go through the build (hashed, cached for a year)
  lib/                    booking slots and the booking email sender
public/                   copied as-is: gallery photos, icons, robots.txt, .htaccess, 404.html
```

`src/routes/index.tsx` has to keep that name: the router maps `index` to `/`.

## Blog

Posts live in `content/blog/<slug>.md` (YAML frontmatter + Markdown). `scripts/blog-plugin.ts`
turns them into pages at build time, checks every internal link and writes `sitemap.xml` and
`blog/rss.xml` with live posts only.

- **Scheduling:** posts with `draft: true` and a `publishAt` date go live on the first build on or
  after that date (India time). Rebuild and re-upload on publish days (Mondays and Thursdays).
  Preview the schedule with `BLOG_BUILD_DATE=2027-12-31 npm run build`.
- **Images:** `python scripts/blog_images.py <slug>` makes the hero, card, OG image and body images
  in `public/blog/` from the studio's photos (map in the script).
- **Checks:** `python scripts/check_blog.py` validates titles, descriptions, keywords, links,
  FAQs, word counts and bans price figures.

## Hosting on Hostinger

`npm run build` writes the finished site to `.output/public/`:

```
index.html  about.html  faq.html  offer.html  tattoo-artist.html  services.html
services/realism.html  services/portrait.html  …
404.html  .htaccess  robots.txt  assets/  gallery/
```

1. Run `npm run build`.
2. In hPanel open **File Manager → public_html** and delete the default files.
3. Upload everything **inside** `.output/public/` (including the hidden `.htaccess`).

`.htaccess` gives clean URLs (`/about` serves `about.html`), forces HTTPS, compresses text files
and sets long cache times for photos, fonts, CSS and JS.

`sitemap.xml` and `blog/rss.xml` are generated on every build (from `content/blog/` and the
domain in `src/data/business.ts`) and only list blog posts that are live.

### Booking emails

The booking and offer forms email the studio through a small server function
(`src/lib/booking-request.ts`). Plain file hosting cannot run it, so there the forms fall back to
their "send on WhatsApp" step. To get the emails as well, use a Hostinger plan with Node.js apps
(or a VPS), deploy the whole `.output/` folder, start it with `node .output/server/index.mjs`, and
set the variables listed in `.env.example`.
