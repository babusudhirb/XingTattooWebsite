import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { blogPlugin } from "./scripts/blog-plugin";

export default defineConfig({
  // No base64 images in the HTML: the six 96px menu thumbnails alone added 14 KB to every page.
  // As files they're fetched once and cached.
  build: { target: "es2020", assetsInlineLimit: 0 },
  // Builds write .output/ while dev runs; watching it crashes the dev server (EBUSY)
  server: { watch: { ignored: ["**/.output/**"] } },
  plugins: [
    // Blog Markdown → modules; also writes public/sitemap.xml and public/blog/rss.xml
    blogPlugin(),
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      // Every page is rendered to a static .html file at build time, named after
      // its URL (about.html, faq.html, offer.html, services/realism.html …), so
      // Hostinger serves plain files — no server work per visit.
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: false,
        failOnError: true,
        // "/services/" is the same page as "/services" — write it once, as services.html.
        // "/#gallery", "/faq#inks"… are the same files too: rendering them again races the
        // first write of index.html / faq.html and can leave a truncated page.
        filter: ({ path }) => !path.includes("#") && (path === "/" || !path.endsWith("/")),
      },
      // Not linked from anywhere, so list it: becomes 404.html (served by .htaccess)
      pages: [{ path: "/404" }],
    }),
    react(),
    nitro(),
  ],
});
