/**
 * Everything derived from the logo, from one source: public/xing-premium-tattoo-studio-logo.svg.
 * Run from clonecraft-hero/ after replacing the SVG:  node scripts/logo-assets.mjs
 *
 *   public/xing-premium-tattoo-studio-logo.png   1200px, white background — the schema `logo`
 *   public/xing-premium-tattoo-studio-logo.webp  800px, transparent — the mark on social images (scripts/blog-images.py)
 *   favicon.ico (16 + 32), favicon-16/32, apple-touch-icon, icon-192/512 — just the lettering (the tagline is
 *   unreadable at icon sizes), centred on white
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");
const svg = fs.readFileSync(path.join(PUBLIC, "xing-premium-tattoo-studio-logo.svg"), "utf8");
// The tagline is the one filled <path> (the lettering is stroked); drop it for icons
const lettering = svg.replace(/<path fill="[^"]+" d="[^"]*"\/>/, "");
if (lettering === svg) throw new Error("tagline path not found in xing-premium-tattoo-studio-logo.svg");

const render = (source, width) => sharp(Buffer.from(source), { density: 300 }).resize({ width });

await render(svg, 1200)
  .flatten({ background: "#ffffff" })
  .png()
  .toFile(path.join(PUBLIC, "xing-premium-tattoo-studio-logo.png"));
await render(svg, 800).webp({ quality: 90 }).toFile(path.join(PUBLIC, "xing-premium-tattoo-studio-logo.webp"));

async function icon(size, file, pad = 0.12) {
  const art = await render(lettering, Math.round(size * (1 - pad * 2)))
    .png()
    .toBuffer();
  const { width, height } = await sharp(art).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
    .composite([
      { input: art, left: Math.round((size - width) / 2), top: Math.round((size - height) / 2) },
    ])
    .png()
    .toFile(path.join(PUBLIC, file));
}
await icon(16, "favicon-16.png", 0.04);
await icon(32, "favicon-32.png", 0.06);
await icon(180, "apple-touch-icon.png");
await icon(192, "icon-192.png");
await icon(512, "icon-512.png");
// favicon.ico: an ICO directory holding the two PNGs as they are (supported by every browser)
const pngs = ["favicon-16.png", "favicon-32.png"].map((f) => fs.readFileSync(path.join(PUBLIC, f)));
const ico = Buffer.alloc(6 + 16 * pngs.length);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(pngs.length, 4);
let offset = ico.length;
pngs.forEach((png, i) => {
  const size = [16, 32][i];
  const e = 6 + 16 * i;
  ico.writeUInt8(size, e);
  ico.writeUInt8(size, e + 1);
  ico.writeUInt16LE(1, e + 4);
  ico.writeUInt16LE(32, e + 6);
  ico.writeUInt32LE(png.length, e + 8);
  ico.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), Buffer.concat([ico, ...pngs]));
console.log("logo-assets: png, webp, favicon.ico and 5 icons written from public/xing-premium-tattoo-studio-logo.svg");
