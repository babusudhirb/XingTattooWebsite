# Deploying to Hostinger

The site is plain files: every page is prerendered to `.html`, and `public/.htaccess` (LiteSpeed/Apache) does the rest.

## Build and check

```sh
npm install
npm run build        # seo:files (sitemaps, robots.txt, llms.txt, rss → public/) + vite build + postbuild (checks, redirects)
npm run preview      # serves .output/public like Hostinger, on http://localhost:4173
npm run qa           # (with the preview running) SEO audit, NAP, links, mobile — each must report 0 failures
```

Optional, before `npm run build`: set `VITE_GSC_VERIFICATION` and/or `VITE_BING_VERIFICATION` to add the
Search Console / Bing ownership meta tags (not needed if you verify the domain by DNS).

## Upload

1. hPanel → **File Manager → public_html** → delete the old site files.
2. Upload everything **inside** `.output/public/`, including the hidden `.htaccess`.
3. Check in a browser:
   - `http://xingtattoo.in/about` → one redirect to `https://www.xingtattoo.in/about`
   - `https://www.xingtattoo.in/sitemap.xml` and `/robots.txt` load
   - `https://www.xingtattoo.in/artist` → `/tattoo-artist`, `/contact-us` → `/contact`, `/About` → `/about`
   - a made-up URL shows the branded 404 page

## What `.htaccess` does

- HTTP and the bare domain → `https://www.xingtattoo.in` in a single 301.
- Old URLs → new ones (list in `scripts/redirects.mjs`, written in at build time).
- `/page.html` and `/page/` → `/page`; `/page` serves `page.html`; unknown URLs get `404.html` with a 404 status.
- HSTS (2 years, subdomains; no `preload` until every subdomain is confirmed on HTTPS), `nosniff`,
  `strict-origin-when-cross-origin`, caching (hashed JS/CSS/fonts 1 year, images 30 days, pages and XML no-cache), compression.

## Owner checks on the hosting side

- hPanel → **SSL**: certificate active for both `xingtattoo.in` and `www.xingtattoo.in`.
- No password protection or "maintenance mode" on the site.
- If a CDN or firewall (e.g. Cloudflare, Hostinger CDN) sits in front, make sure it doesn't block Googlebot.
- A leftover Cloudflare Workers build config exists locally (`.wrangler/`); if a `*.workers.dev` copy of the site
  was ever published, take it down or it can compete with the real domain.
