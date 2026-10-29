# Getting the site indexed — owner checklist

Do these in order. Each step takes a few minutes; step 3 runs over about two weeks.

## 1. Deploy and check the crawl files

Deploy the production build (see docs/DEPLOY.md). Then open these in a browser — each must show
plain text or XML, **not** the website:

- https://www.xingtattoo.in/sitemap.xml (a short list of three sitemaps)
- https://www.xingtattoo.in/robots.txt (ends with `Sitemap: https://www.xingtattoo.in/sitemap.xml`)

## 2. Google Search Console: property and sitemap

1. Go to https://search.google.com/search-console → **Add property** → **Domain** →
   `xingtattoo.in`. Verify with the DNS TXT record at your domain registrar (this covers
   http, https and www in one go).
2. **Sitemaps** (left menu) → enter `sitemap.xml` → **Submit**. Status should turn to
   "Success" within a day.

## 3. Request indexing for the key pages (about 10 a day)

**URL Inspection** (search bar at the top) → paste the URL → **Test live URL** → check it says
"URL is available to Google" → **Request indexing**. In this order:

| Day 1 | Day 2 |
|---|---|
| https://www.xingtattoo.in/ | https://www.xingtattoo.in/gallery |
| https://www.xingtattoo.in/services | https://www.xingtattoo.in/tattoo-artist |
| https://www.xingtattoo.in/services/realism | https://www.xingtattoo.in/contact |
| https://www.xingtattoo.in/services/portrait | https://www.xingtattoo.in/about |
| https://www.xingtattoo.in/services/black-grey | https://www.xingtattoo.in/faq |
| https://www.xingtattoo.in/services/geometric | https://www.xingtattoo.in/blog |
| https://www.xingtattoo.in/services/traditional | |
| https://www.xingtattoo.in/services/minimalist | |

The blog posts don't need requesting one by one: the sitemap covers them.

## 4. Bing

1. https://www.bing.com/webmasters → **Import from Google Search Console** (brings the site
   and the sitemap over).
2. Optional, for faster Bing/Yandex updates: pick a key (any 32 letters/digits), build and
   deploy with `INDEXNOW_KEY=<key>` set, then after each deploy run
   `INDEXNOW_KEY=<key> npm run indexnow`.

## 5. Google Business Profile

**Website** field = `https://www.xingtattoo.in/` exactly (the home page, not `/offer`).

## 6. After 7 days: Search Console → Pages

- **Crawled – currently not indexed**: usually a page Google finds thin. Add a few more
  helpful paragraphs or photos to it and link to it from a related page, then request
  indexing again.
- **Duplicate without user-selected canonical**: a canonical tag is wrong — send the URL to
  the developer.
- **Page with redirect** for old URLs (e.g. `/artist`) is expected and fine.

## A note on rankings

A clean, crawlable structure makes indexing reliable, but nobody can guarantee a #1
position. Rankings grow over time with new Google reviews, regular Business Profile posts
and photos, consistent listings (citations) on other sites, links from local sites, and new
helpful blog posts.
