# Deploying

The site is plain files: `npm run build` prerenders every page into `.output/public/`. Any static
host works. Recommended: **Cloudflare Pages connected to the GitHub repo** — it rebuilds and
deploys on every push to `main`, makes preview links for pull requests, serves the 301s and
headers from `public/_redirects` and `public/_headers`, has edge servers in India and is free.

## A. Cloudflare Pages (recommended)

1. https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** →
   pick `altafs45/XING-TATTOO-STUDIO`.
2. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `.output/public`
   - Environment variable: `NODE_VERSION` = `24` (matches `.nvmrc`)
   - Optional variables (Production): `VITE_GTM_ID` or `VITE_GA_ID`, `INDEXNOW_KEY` (see `.env.example`)
3. **Save and Deploy.** Every push to `main` deploys; every pull request gets a preview URL.
4. **Custom domains** → add `www.xingtattoo.in` (and `xingtattoo.in`).
5. **DNS** (easiest with the domain on Cloudflare DNS):
   - `www` → CNAME → `<project>.pages.dev` (proxied)
   - `@` (apex) → CNAME → `<project>.pages.dev` (proxied; Cloudflare flattens it)
6. **Rules → Redirect Rules** → one rule: when hostname equals `xingtattoo.in`, dynamic redirect to
   `concat("https://www.xingtattoo.in", http.request.uri.path)`, status 301, preserve query string.
   (Pages ignores domain lines in `_redirects`; the path redirects there work as they are.)
7. **SSL/TLS** → "Always Use HTTPS" on.
8. Scheduled posts: **Settings → Builds → Deploy hooks** → create one → add its URL as the GitHub
   repository secret `DEPLOY_HOOK_URL` (GitHub → Settings → Secrets and variables → Actions).

**Netlify instead:** same build command and output directory; Node from `.nvmrc`. Netlify reads
the domain lines in `_redirects` too, so no extra redirect rule is needed.

**Roll back:** Cloudflare Pages → the project → **Deployments** → pick an earlier deployment →
**Rollback to this deployment**. Or `git revert` the bad commit and push.

## B. Hostinger (upload by hand)

1. `npm run build`
2. hPanel → **File Manager → public_html** → delete the old site files.
3. Upload everything **inside** `.output/public/`, including the hidden `.htaccess`.

`.htaccess` does the clean URLs, the one-hop 301s (http → https, bare domain → www, old URLs,
`.html`, trailing slash, capitals), the 404 status, compression, caching and security headers.

## Check after any deploy

- `https://www.xingtattoo.in/sitemap.xml` and `/robots.txt` open as XML/text, not the site
- `http://xingtattoo.in/about` → one 301 to `https://www.xingtattoo.in/about`
- `/artist` → `/tattoo-artist`, `/contact-us` → `/contact`
- a made-up URL shows the branded 404 page

## Before every deploy

`npm run build`, `npm run preview`, then `npm run qa` — all checks must report 0 failures. On
GitHub the CI workflow (`.github/workflows/ci.yml`) runs the type check, build, SEO audit, NAP
check and link check on every push and pull request.
