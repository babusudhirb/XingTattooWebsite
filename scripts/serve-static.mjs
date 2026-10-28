/**
 * Local stand-in for Hostinger: serves .output/public the way public/.htaccess does
 * (clean URLs, .html and trailing-slash 301s, the redirects in scripts/redirects.mjs,
 * 404.html with a real 404 status). Usage: node scripts/serve-static.mjs [port=4173]
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { REDIRECTS } from "./redirects.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.output/public");
const PORT = Number(process.argv[2] ?? 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();

function send(res, status, file, headers = {}) {
  res.writeHead(status, {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
    ...headers,
  });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const p = decodeURIComponent(url.pathname);
    const redirect = (to) => {
      res.writeHead(301, { Location: to });
      res.end();
    };

    const bare = p.replace(/(\.html|\/)$/, "") || "/";
    const r = REDIRECTS.find((x) => x.from === bare);
    if (r) return redirect(r.to);
    if (p.endsWith(".html")) return redirect(p.slice(0, -5) || "/");
    if (p.length > 1 && p.endsWith("/") && !fs.existsSync(path.join(ROOT, p)))
      return redirect(p.slice(0, -1));

    const file = path.join(ROOT, p === "/" ? "index.html" : p);
    if (!file.startsWith(ROOT)) return send(res, 404, path.join(ROOT, "404.html"));
    if (isFile(file)) return send(res, 200, file);
    if (isFile(`${file}.html`)) return send(res, 200, `${file}.html`);
    return send(res, 404, path.join(ROOT, "404.html"));
  })
  .listen(PORT, () => console.log(`Serving .output/public at http://localhost:${PORT}`));
