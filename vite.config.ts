import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Set SITE_URL (e.g. https://example.com) when building to also emit sitemap.xml.
const siteUrl = process.env["SITE_URL"];

export default defineConfig({
  plugins: [
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
      ...(siteUrl ? { sitemap: { enabled: true, host: siteUrl } } : {}),
    }),
    react(),
    nitro(),
  ],
});
