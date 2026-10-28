/**
 * Local stand-in for Hostinger: serves .output/public the way public/.htaccess does
 * (clean URLs, .html and trailing-slash 301s, the redirects in scripts/redirects.mjs,
 * 404.html with a real 404 status). Usage: node scripts/serve-static.mjs [port=4173]
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

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
const COMPRESSIBLE = new Set([
  ".html",
  ".xml",
  ".txt",
  ".js",
  ".css",
  ".json",
  ".webmanifest",
  ".svg",
]);

/** Brotli/gzip for text files, as LiteSpeed does on Hostinger, so local Lighthouse runs are fair. */
function send(req, res, status, file) {
  const headers = { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" };
  const accept = req.headers["accept-encoding"] ?? "";
  const stream = fs.createReadStream(file);
  if (COMPRESSIBLE.has(path.extname(file)) && /\bbr\b/.test(accept)) {
    res.writeHead(status, { ...headers, "Content-Encoding": "br", Vary: "Accept-Encoding" });
    // Quality 5, like a web server compressing on the fly (11, the default, is far slower)
    return stream
      .pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }))
      .pipe(res);
  }
  if (COMPRESSIBLE.has(path.extname(file)) && /\bgzip\b/.test(accept)) {
    res.writeHead(status, { ...headers, "Content-Encoding": "gzip", Vary: "Accept-Encoding" });
    return stream.pipe(zlib.createGzip()).pipe(res);
  }
  res.writeHead(status, headers);
  stream.pipe(res);
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
    if (!file.startsWith(ROOT)) return send(req, res, 404, path.join(ROOT, "404.html"));
    if (isFile(file)) return send(req, res, 200, file);
    if (isFile(`${file}.html`)) return send(req, res, 200, `${file}.html`);
    return send(req, res, 404, path.join(ROOT, "404.html"));
  })
  .listen(PORT, () => console.log(`Serving .output/public at http://localhost:${PORT}`));
