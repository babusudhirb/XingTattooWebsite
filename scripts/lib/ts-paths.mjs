/**
 * Lets Node scripts import the app's TypeScript data files directly (Node strips the types):
 * resolves the "@/…" alias to src/ and extensionless relative imports to .ts/.tsx.
 * Usage: import "./lib/ts-paths.mjs" before any dynamic import of src/ files.
 */
import fs from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src");

registerHooks({
  resolve(specifier, context, next) {
    let base = null;
    if (specifier.startsWith("@/")) base = path.join(SRC, specifier.slice(2));
    else if (
      /^\.\.?\//.test(specifier) &&
      context.parentURL?.startsWith("file:") &&
      !path.extname(specifier)
    )
      base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    if (base) {
      const file = [".ts", ".tsx", "/index.ts"]
        .map((ext) => base + ext)
        .find((f) => fs.existsSync(f));
      if (file) return next(pathToFileURL(file).href, context);
    }
    return next(specifier, context);
  },
});
