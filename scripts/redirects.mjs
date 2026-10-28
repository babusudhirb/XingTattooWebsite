/**
 * Old or alternative URLs → their one canonical page (301). The single list used by
 * scripts/postbuild.mjs (writes the .htaccess rules) and scripts/serve-static.mjs (local preview).
 * `from` is an exact path; `to` may include a #fragment.
 */
export const REDIRECTS = [
  { from: "/index", to: "/" },
  { from: "/gallery", to: "/#gallery" },
  { from: "/artist", to: "/tattoo-artist" },
];
