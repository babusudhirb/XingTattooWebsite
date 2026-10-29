/**
 * Old or alternative URLs → their one canonical page (301, one hop). The single list used by
 * scripts/postbuild.mjs (writes the .htaccess rules) and scripts/serve-static.mjs (local preview).
 * `from` is an exact path; `prefix` moves everything below it (the rest of the path is kept).
 * Also handled for every page, in both: uppercase → lowercase, /page.html and /page/ → /page.
 * The old live site only linked to URLs that still exist (checked 29 Oct 2026).
 */
export const REDIRECTS = [
  { from: "/index", to: "/" },
  { from: "/artist", to: "/tattoo-artist" },
  { from: "/contact-us", to: "/contact" },
  { from: "/service", to: "/services" },
  { prefix: "/service/", to: "/services/" },
];

/** Where `p` (no .html, no trailing slash) redirects to, or undefined. */
export function redirectFor(p) {
  for (const r of REDIRECTS) {
    if (r.from && r.from === p) return r.to;
    if (r.prefix && p.startsWith(r.prefix)) return r.to + p.slice(r.prefix.length);
  }
  return undefined;
}
