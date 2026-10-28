import { registerHooks } from "node:module";
registerHooks({
  load(url, context, next) {
    if (/\.(webp|png|jpg|jpeg|svg|avif|css|woff2)(\?.*)?$/.test(url))
      return { format: "module", source: `export default ${JSON.stringify(url.split("/").pop())};`, shortCircuit: true };
    return next(url, context);
  },
  resolve(spec, context, next) {
    if (/\?url$/.test(spec)) spec = spec.replace(/\?url$/, "");
    return next(spec, context);
  },
});
