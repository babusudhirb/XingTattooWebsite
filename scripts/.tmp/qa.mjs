import { createJiti } from "jiti";
import path from "node:path";
const root = process.cwd();
const jiti = createJiti(import.meta.url, { alias: { "@": path.join(root, "src") } });
const pc = await jiti.import(path.join(root, "src/data/page-copy.ts"));
const wc = (s) => s.split(/\s+/).filter(Boolean).length;
const qa = { home: pc.homeQuickAnswer, artist: pc.artistQuickAnswer, about: pc.aboutQuickAnswer };
for (const s of ["realism", "portrait", "black-grey", "geometric", "traditional", "minimalist"]) qa[s] = pc.serviceQuickAnswer(s);
for (const [k, v] of Object.entries(qa)) console.log(k, wc(v.paragraphs.join(" ")), v.question);
for (const [k, list] of Object.entries({ services: pc.servicesFaqs, offer: pc.offerFaqs }))
  for (const f of list) console.log(k, wc(f.answer), f.question);
