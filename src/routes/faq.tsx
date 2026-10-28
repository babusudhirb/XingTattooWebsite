import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, CornerDownRight, MessageCircle, Search, X } from "lucide-react";

import { pageTitle } from "@/data/business";
import { faqById, faqCategories, faqs, type Faq } from "@/data/faqs";
import { WHATSAPP_URL } from "@/data/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { openBookingModal } from "@/components/booking/BookingContext";
import { CreaseLines, SectionNav } from "@/components/sections/Origami";
import { faqNode, seoHead } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/blog";

const TITLE = pageTitle("Tattoo FAQs: Cost, Pain & Aftercare");
const DESCRIPTION =
  "Straight answers on tattoo cost factors, pain, hygiene, first tattoos and aftercare from Xing Premium Tattoo Studio, Brookefield, Bengaluru. Ask us anything.";

export const Route = createFileRoute("/faq")({
  head: () =>
    seoHead({
      path: "/faq",
      title: TITLE,
      description: DESCRIPTION,
      graph: [faqNode(faqs), breadcrumbSchema([{ label: "Home", href: "/" }, { label: "FAQ" }])],
    }),
  component: FaqPage,
});

const SECTIONS = faqCategories.map(({ id, label }) => ({ id, label }));

function matches(faq: Faq, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return `${faq.question} ${faq.answer}`.toLowerCase().includes(q);
}

function FaqPage() {
  const [open, setOpen] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  /** Open a question, scroll to it and put it in the URL so it can be shared. */
  const goTo = useCallback((id: string) => {
    if (!faqById.has(id)) return;
    setQuery("");
    setOpen((current) => (current.includes(id) ? current : [...current, id]));
    history.replaceState(null, "", `#${id}`);
    // Wait for the item to render/expand before scrolling to it.
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }, []);

  // Deep links: /faq#tattoo-cost opens and scrolls to that answer.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (faqById.has(id)) goTo(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [goTo]);

  const visibleCount = useMemo(() => faqs.filter((f) => matches(f, query)).length, [query]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />
      <SectionNav sections={SECTIONS} />

      <div className="mx-auto max-w-7xl px-5 pt-5">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            to="/"
            className="-my-3.5 inline-block min-w-11 py-3.5 transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">FAQ</span>
        </nav>
      </div>

      {/* Hero + search */}
      <section className="relative overflow-hidden">
        <CreaseLines />
        <div className="relative mx-auto max-w-3xl px-5 py-12 text-center lg:py-16">
          <p className="eyebrow">Good To Know</p>
          <h1 className="mt-4 font-display text-[2.1rem] leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Tattoo FAQs{" "}
            <span className="mt-2 block text-xl font-normal tracking-normal text-muted-foreground sm:text-2xl">
              Straight answers from Xing Premium Tattoo Studio, Brookefield
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Cost, pain, hygiene, first tattoos and aftercare — {faqs.length} questions answered.
            Each answer links to the questions people usually ask next.
          </p>

          <div className="relative mx-auto mt-8 max-w-lg">
            <label htmlFor="faq-search" className="sr-only">
              Search tattoo questions
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. pain, cost, healing, cover-up…"
              className="h-12 w-full rounded-full border border-border bg-card pr-11 pl-11 text-sm shadow-[var(--shadow-card)] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
            {query ? `${visibleCount} of ${faqs.length} questions match "${query}"` : " "}
          </p>
        </div>
      </section>

      {/* Categories — Radix renders each question header as an <h3> under the category <h2> */}
      <div className="mx-auto max-w-3xl px-5 pb-8">
        {faqCategories.map((category) => {
          const items = faqs.filter((f) => f.category === category.id && matches(f, query));
          if (items.length === 0) return null;
          return (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-title`}
              className="scroll-mt-36 pt-10"
            >
              <h2
                id={`${category.id}-title`}
                className="font-display text-xl font-semibold tracking-wide uppercase sm:text-2xl"
              >
                {category.label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{category.intro}</p>

              <Accordion
                type="multiple"
                value={open}
                onValueChange={setOpen}
                className="mt-4 border-t border-border"
              >
                {items.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    id={faq.id}
                    className="scroll-mt-36 border-border"
                  >
                    <AccordionTrigger className="py-5 font-display text-sm font-semibold hover:no-underline sm:text-base [&[data-state=open]]:text-amber-800">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent
                      forceMount
                      className="pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base"
                    >
                      <p>{faq.answer}</p>
                      {faq.link && (
                        <a
                          href={faq.link.to}
                          className="mt-3 inline-flex items-center gap-1.5 font-display text-xs font-semibold tracking-[0.12em] text-amber-700 uppercase underline-offset-4 hover:underline"
                        >
                          {faq.link.label} <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {faq.related.length > 0 && (
                        <div className="mt-5 rounded-sm border border-border bg-card p-4">
                          <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                            People also ask
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {faq.related.map((rid) => {
                              const related = faqById.get(rid);
                              if (!related) return null;
                              return (
                                <li key={rid}>
                                  <a
                                    href={`#${rid}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      goTo(rid);
                                    }}
                                    className="group inline-flex items-start gap-2 text-sm text-foreground transition-colors hover:text-amber-700"
                                  >
                                    <CornerDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                                    <span className="underline decoration-border underline-offset-4 group-hover:decoration-amber-700">
                                      {related.question}
                                    </span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          );
        })}

        {visibleCount === 0 && (
          <div className="mt-10 rounded-sm border border-dashed border-border p-8 text-center">
            <p className="font-display text-sm font-semibold">No matching questions</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask us directly on WhatsApp — happy to help.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 font-display text-xs font-bold tracking-[0.14em] uppercase hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4" /> Ask On WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Still have questions */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="relative overflow-hidden bg-primary px-8 py-10 text-primary-foreground [clip-path:polygon(0_0,calc(100%-40px)_0,100%_40px,100%_100%,0_100%)]">
          <CreaseLines className="text-amber-200/10" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-amber-500">Still Have Questions?</p>
              <p className="mt-2 font-display text-[1.35rem] leading-tight font-semibold tracking-wide text-balance uppercase sm:text-3xl">
                Ask Peace At A Free Consultation
              </p>
              <p className="mt-2 text-sm text-primary-foreground/80">
                In the studio or on WhatsApp — no pressure, no obligation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-3 rounded-full bg-amber-700 px-6 py-3.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 hover:-translate-y-0.5"
              >
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-primary-foreground/30 px-6 py-3.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-primary-foreground/10"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
