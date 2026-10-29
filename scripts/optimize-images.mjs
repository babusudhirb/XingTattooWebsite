/**
 * Image budget pass (sharp). Run from clonecraft-hero/:  node scripts/optimize-images.mjs
 *
 * - Studio gallery photos (public/images/gallery): adds a 480px copy next to each (name-480.webp) for srcset.
 * - Style photos (src/assets/services): a 480px copy each, plus a 720px copy of each hero, for srcset.
 * - Recompresses WebP over budget: heroes ≤ 180 KB, thumbnails ≤ 60 KB, anything else ≤ 250 KB,
 *   gallery photos ≤ 1200px wide, heroes ≤ 1600px. Per-file width overrides below.
 * - Every file it changes is first copied to _originals/<same path> (kept out of the deploy).
 * - Icons and social images (PNG/JPG in public/) stay in their formats on purpose.
 * Safe to re-run: files already within budget are left alone.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KB = 1024;

/** Displayed far smaller than stored: cap the width. */
const WIDTH_OVERRIDES = {
  // Shown at most ~200 CSS px wide (40rem tall, 1260×4156 drawing); 640px covers 3× screens
  "src/assets/home/fine-line-floral-face-tattoo-design.webp": 640,
  // Phone version: ~90 CSS px wide at 38vh tall; 240px covers 2.5× screens
  "src/assets/home/fine-line-floral-face-tattoo-design-mobile.webp": 240,
};

function budget(rel) {
  if (/-thumb\.webp$/.test(rel)) return { kb: 60, width: 600 };
  if (/(-bangalore|fine-line-floral-face-tattoo-design[^/]*)\.webp$/.test(rel))
    return { kb: 180, width: 1600 };
  if (rel.startsWith("public/images/gallery/") || /-brookefield-\d+\.webp$/.test(rel))
    return { kb: 250, width: 1200 };
  return { kb: 250, width: 1600 };
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

function backup(rel) {
  const dest = path.join(ROOT, "_originals", rel);
  if (fs.existsSync(dest)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(ROOT, rel), dest);
}

/** Encode at falling quality (down to 60), then narrower, until the file fits the budget. */
async function encode(input, width, maxKb, startQuality = 78) {
  let out;
  for (const w of [width, Math.round(width * 0.85), Math.round(width * 0.7)]) {
    for (let q = startQuality; q >= 60; q -= 4) {
      out = await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: q, effort: 6 })
        .toBuffer();
      if (out.length <= maxKb * KB) return out;
    }
  }
  return out;
}

let changed = 0;
let variants = 0;
const files = [...walk(path.join(ROOT, "public")), ...walk(path.join(ROOT, "src/assets"))]
  .map((f) => path.relative(ROOT, f).replace(/\\/g, "/"))
  .filter(
    (rel) => rel.endsWith(".webp") && !/-(320|480|720)\.webp$/.test(rel) && !rel.includes("/og/"),
  );

for (const rel of files) {
  const abs = path.join(ROOT, rel);
  const input = fs.readFileSync(abs);
  const { width = 0 } = await sharp(input).metadata();
  const { kb, width: maxWidth } = budget(rel);
  const targetWidth = Math.min(WIDTH_OVERRIDES[rel] ?? maxWidth, width);
  if (input.length > kb * KB || targetWidth < width) {
    backup(rel);
    const out = await encode(input, targetWidth, kb);
    if (out.length < input.length || targetWidth < width) {
      fs.writeFileSync(abs, out);
      changed++;
      console.log(
        `${rel}: ${Math.round(input.length / KB)} KB ${width}w → ${Math.round(out.length / KB)} KB ${targetWidth}w`,
      );
    }
  }
  // Style photos: a 480px copy for gallery grids, and a 720px copy of each hero for phones
  // (<style>-tattoo-brookefield-bangalore.webp is the hero, …-brookefield-N.webp the gallery)
  const stylePhoto =
    /^src\/assets\/services\/[^/]+\/[a-z-]+-tattoo-brookefield-(bangalore|\d+)\.webp$/.test(rel);
  if (stylePhoto) {
    for (const [w, kb] of [[480, 45], ...(/-bangalore\.webp$/.test(rel) ? [[720, 80]] : [])]) {
      const small = abs.replace(/\.webp$/, `-${w}.webp`);
      if (!fs.existsSync(small)) {
        fs.writeFileSync(small, await encode(fs.readFileSync(abs), w, kb, 74));
        variants++;
      }
    }
  }
  if (rel.startsWith("public/images/gallery/")) {
    const small = abs.replace(/\.webp$/, "-480.webp");
    if (!fs.existsSync(small)) {
      fs.writeFileSync(small, await encode(fs.readFileSync(abs), 480, 60, 74));
      variants++;
    }
  }
}
// Card-size copies of each style's hero photo (cards are ~280px wide; 560px covers 2× screens)
const CARD_SOURCES = {
  realism: "src/assets/services/realism/realism-tattoo-brookefield-bangalore.webp",
  portrait: "src/assets/services/portrait/portrait-tattoo-brookefield-bangalore.webp",
  "black-grey": "src/assets/services/black-grey/black-grey-tattoo-brookefield-bangalore.webp",
  geometric: "src/assets/services/geometric/geometric-tattoo-brookefield-bangalore.webp",
  traditional: "src/assets/services/traditional/traditional-tattoo-brookefield-bangalore.webp",
  minimalist: "src/assets/services/minimalist/minimalist-tattoo-brookefield-bangalore.webp",
};
let cards = 0;
for (const [slug, src] of Object.entries(CARD_SOURCES)) {
  const dest = path.join(ROOT, `src/assets/services/${slug}/${slug}-tattoo-card.webp`);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, await encode(fs.readFileSync(path.join(ROOT, src)), 560, 60, 76));
    cards++;
  }
  // Phones show cards ~170px wide (two columns): a 320px copy covers them
  const small = dest.replace(/\.webp$/, "-320.webp");
  if (!fs.existsSync(small)) {
    fs.writeFileSync(small, await encode(fs.readFileSync(dest), 320, 20, 72));
    cards++;
  }
}
console.log(
  `optimize-images: ${changed} recompressed, ${variants} new 480/720px copies, ${cards} style cards`,
);
