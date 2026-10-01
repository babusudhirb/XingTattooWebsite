# XING Tattoo Studio

Website for **XING Tattoo Studio**, Brookefield, Bengaluru. Built with TanStack Start, React,
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

To also generate `sitemap.xml`, build with your domain:
`SITE_URL=https://your-domain.com npm run build`.

### Booking emails

The booking and offer forms email the studio through a small server function
(`src/lib/booking-request.ts`). Plain file hosting cannot run it, so there the forms fall back to
their "send on WhatsApp" step. To get the emails as well, use a Hostinger plan with Node.js apps
(or a VPS), deploy the whole `.output/` folder, start it with `node .output/server/index.mjs`, and
set the variables listed in `.env.example`.
