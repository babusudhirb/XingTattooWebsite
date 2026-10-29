/**
 * Tells Bing (and other IndexNow engines) about every sitemap URL. Run after each deploy:
 *   INDEXNOW_KEY=<key> node scripts/indexnow.mjs
 * The key file (public/<key>.txt) is written by scripts/generate-seo-files.mjs when the same
 * INDEXNOW_KEY is set at build time, so build and deploy with it set first.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");
const SITE = "https://www.xingtattoo.in";
const key = process.env["INDEXNOW_KEY"];
if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  console.error("Set INDEXNOW_KEY (8–128 letters, digits or dashes).");
  process.exit(1);
}

const live = await fetch(`${SITE}/${key}.txt`);
if (!live.ok || (await live.text()).trim() !== key) {
  console.error(
    `${SITE}/${key}.txt is not live yet — build with INDEXNOW_KEY set and deploy first.`,
  );
  process.exit(1);
}

const urlList = ["sitemap-pages.xml", "sitemap-blog.xml"].flatMap((f) =>
  [...fs.readFileSync(path.join(PUBLIC, f), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1],
  ),
);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "www.xingtattoo.in",
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
process.exit(res.ok ? 0 : 1);
