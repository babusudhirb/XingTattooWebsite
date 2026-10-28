import { createJiti } from "jiti";
import path from "node:path";
const root = process.cwd();
const jiti = createJiti(import.meta.url, {
  alias: { "@": path.join(root, "src") },
  // stub asset imports
  moduleCache: false,
});
// Stub image imports by registering a loader hook isn't trivial; services.ts imports webp. Use transform hack:
const wc = (s) => s.split(/\s+/).filter(Boolean).length;
const show = (name, list) => {
  console.log(`\n== ${name} (${list.length})`);
  for (const f of list) {
    const n = wc(f.answer);
    const flag = n < 40 || n > 70 ? "  <-- " + n : "";
    console.log(`${String(n).padStart(3)} [${f.id ?? ""}] ${f.question}${flag}
      ${f.answer}${/₹|Rs\.?\s?\d|\d+\s?(rupees|INR)/i.test(f.answer) ? "  PRICE!" : ""}`);
  }
};
const faqs = await jiti.import(path.join(root, "src/data/faqs.ts"));
show("home", faqs.homeFaqIds.map((id) => faqs.faqById.get(id)));
show("faq all", faqs.faqs);
const about = await jiti.import(path.join(root, "src/data/about.ts"));
show("about", about.aboutFaqs);
const artist = await jiti.import(path.join(root, "src/data/artist.ts"));
show("artist", artist.artistFaqs);
const sv = await jiti.import(path.join(root, "src/data/services.ts"));
for (const slug of sv.SERVICE_SLUGS) show("service " + slug, sv.services[slug].faqs);
