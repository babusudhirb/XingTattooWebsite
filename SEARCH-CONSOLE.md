# Search Console checklist (owner)

1. **Deploy this build first** (see DEPLOY.md) — the live site is an older version without canonicals, schema or a sitemap.
2. In Google Search Console add a **Domain property** `xingtattoo.in` and verify with the DNS TXT record at your domain registrar (covers http, https and www). Or add a URL-prefix property `https://www.xingtattoo.in` and build with `VITE_GSC_VERIFICATION=<code>` (Bing: `VITE_BING_VERIFICATION`).
3. **Sitemaps** → submit `https://www.xingtattoo.in/sitemap.xml`.
4. **URL Inspection** → "Test live URL" for `/` — check "Page is indexable" and that the rendered HTML has the H1 → **Request indexing**. Repeat for `/services`, the 6 service pages, `/tattoo-artist`, `/about`, `/faq` (about 10 a day).
5. After 3–7 days open **Pages**: fix "Discovered – currently not indexed" with more internal links; "Duplicate without user-selected canonical" means a canonical is wrong — tell the developer.
6. **Bing Webmaster Tools** → Import from Google Search Console → submit the same sitemap.
7. **Google Business Profile** → Website field = `https://www.xingtattoo.in` (exactly).
