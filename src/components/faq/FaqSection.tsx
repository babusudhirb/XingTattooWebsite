import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/sections/SectionHeading";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * The page FAQ: an H2 "Frequently asked questions", each question an H3 accordion
 * trigger, every answer in the server HTML (forceMount) and the first one open.
 * Pass the same array to faqNode() so the FAQPage JSON-LD matches the visible text.
 */
export function FaqSection({
  items,
  id = "faq",
  eyebrow = "Good To Know",
  className = "mx-auto max-w-7xl scroll-mt-36 px-5 py-14",
}: {
  items: readonly FaqItem[];
  id?: string;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      <SectionHeading eyebrow={eyebrow} title="Frequently asked questions" id={`${id}-title`} />
      <div className="mx-auto mt-8 max-w-2xl">
        <Accordion type="single" collapsible defaultValue="faq-0">
          {items.map((faq, i) => (
            <AccordionItem key={faq.question} value={`faq-${i}`}>
              <AccordionTrigger data-faq-q className="min-h-12 text-left font-display text-sm">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                forceMount
                data-faq-a
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-6 text-center">
          <Link
            to="/faq"
            className="inline-flex min-h-11 items-center gap-2 font-display text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase underline-offset-4 hover:underline"
          >
            More tattoo FAQs <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
