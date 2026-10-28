import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { blogPlugin } from "./scripts/blog-plugin";

export default defineConfig({
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
        // "/services/" is the same page as "/services" — write it once, as services.html
        filter: ({ path }) => path === "/" || !path.endsWith("/"),
      },
      // Not linked from anywhere, so list it: becomes 404.html (served by .htaccess)
      pages: [{ path: "/404" }],
    }),
    react(),
    nitro(),
  ],
});
