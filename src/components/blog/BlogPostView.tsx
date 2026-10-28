import { Fragment, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Link2, ListOrdered, MessageCircle } from "lucide-react";

import { categoryLabel, formatPostDate, relatedPosts } from "@/data/blog";
import { COUNTS, LEAD_ARTIST, SITE_URL, WHATSAPP_URL } from "@/data/business";
import { services, type ServiceSlug } from "@/data/services";
import { openBookingModal } from "@/components/booking/BookingContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";
import { Breadcrumbs } from "@/components/blog/BlogBits";
import { PostCard } from "@/components/blog/PostCard";
import { bodyElementId, cardImage, postBodyHtml, postCrumbs } from "@/lib/blog";
import { SignatureServices } from "@/components/blog/SignatureServices";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function InlineCta() {
  return (
    <aside className="not-prose my-10 rounded-2xl border border-amber-700/25 bg-card p-6 shadow-[var(--shadow-card)]">
      <p className="font-display text-lg font-semibold text-balance">
        Have an idea? Book a free consultation with Peace
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Share your idea, placement and rough size — we'll talk you through design, sizing and
        aftercare before anything goes on skin.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => openBookingModal()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-display text-xs font-bold tracking-[0.12em] text-primary-foreground uppercase hover:opacity-90"
        >
          Book Free Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary px-6 font-display text-xs font-bold tracking-[0.12em] uppercase hover:bg-accent"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp Us
        </a>
      </div>
    </aside>
  );
}

function Toc({ sections, active }: { sections: BlogPostData["sections"]; active: string }) {
  return (
    <ol className="space-y-1 text-sm">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
            className={`flex min-h-11 items-center border-l-2 py-1.5 pl-3 leading-snug transition-colors lg:min-h-0 ${
              active === s.id
                ? "border-amber-700 font-semibold text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function ShareButtons({ post }: { post: BlogPostData }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/blog/${post.slug}`;
  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
      <p className="eyebrow mr-2">Share this guide</p>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold hover:bg-accent"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
      </a>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(url).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          });
        }}
        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold hover:bg-accent"
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
    </div>
  );
}

function RelatedService({ href }: { href: string }) {
  const slug = href.startsWith("/services/") ? (href.slice(10) as ServiceSlug) : undefined;
  const service = slug ? services[slug] : undefined;
  return (
    <a
      href={href}
      className="group mt-10 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-amber-700/50 sm:p-5"
    >
      {service && (
        <img
          src={service.thumbImage}
          alt=""
          width={96}
          height={96}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
        />
      )}
      <span className="min-w-0">
        <span className="eyebrow block">Related service</span>
        <span className="mt-1 block font-display text-base font-semibold group-hover:text-amber-800">
          {service
            ? `${service.name} at Xing Premium Tattoo Studio`
            : "All tattoo services at Xing Premium Tattoo Studio"}
        </span>
        {service && (
          <span className="mt-0.5 block text-sm text-muted-foreground">{service.tagline}</span>
        )}
      </span>
      <ArrowRight
        className="ml-auto h-5 w-5 shrink-0 text-muted-foreground group-hover:text-amber-800"
        aria-hidden="true"
      />
    </a>
  );
}

export function BlogPostView({ post }: { post: BlogPostData }) {
  const ids = post.sections.map((s) => s.id);
  const active = useActiveSection(ids);
  const ctaAfter = Math.max(0, Math.ceil(post.sections.length * 0.4) - 1);
  const related = relatedPosts(post);
  const modified = post.dateModified !== post.datePublished;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-5 pt-6 pb-16 sm:pt-8">
        <Breadcrumbs items={[...postCrumbs(post), { label: post.title }]} />

        <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
          <article className="min-w-0">
            <header className="max-w-[68ch]">
              <a
                href={`/blog/category/${post.category}`}
                className="inline-flex min-h-11 items-center font-display text-xs font-semibold tracking-[0.16em] text-amber-800 uppercase hover:underline"
              >
                {categoryLabel(post.category)}
              </a>
              <h1 className="font-display text-[1.9rem] leading-[1.1] font-semibold tracking-tight text-balance sm:text-[2.6rem]">
                {post.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <Link
                  to="/tattoo-artist"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-foreground hover:underline"
                >
                  <img
                    src="/blog/peace-avatar.webp"
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-border bg-card object-cover object-top"
                  />
                  {LEAD_ARTIST.fullName}
                </Link>
                <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
                {modified && (
                  <span>
                    Updated{" "}
                    <time dateTime={post.dateModified}>{formatPostDate(post.dateModified)}</time>
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" /> {post.readingTime} min read
                </span>
              </div>
              {/* Answer first: the short, direct reply to the title's question */}
              {post.answer && (
                <p className="mt-5 border-l-4 border-amber-700 pl-4 text-[1.0625rem] leading-relaxed text-foreground/90 lg:text-lg">
                  {post.answer}
                </p>
              )}
            </header>

            <img
              src={post.heroImage}
              srcSet={`${cardImage(post.heroImage)} 800w, ${post.heroImage} 1600w`}
              alt={post.heroAlt}
              width={post.heroWidth}
              height={post.heroHeight}
              fetchPriority="high"
              decoding="async"
              sizes="(min-width: 1280px) 900px, (min-width: 1024px) 70vw, 100vw"
              className="mt-6 aspect-video w-full rounded-2xl bg-muted object-cover"
            />

            {post.takeaways.length > 0 && (
              <section
                aria-labelledby="takeaways-title"
                className="mt-8 max-w-[68ch] rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <h2 id="takeaways-title" className="font-display text-base font-semibold">
                  Key takeaways
                </h2>
                <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed">
                  {post.takeaways.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Phones & tablets: collapsible table of contents */}
            <details className="mt-6 max-w-[68ch] rounded-2xl border border-border lg:hidden">
              <summary className="flex min-h-12 cursor-pointer items-center gap-2 px-5 font-display text-sm font-semibold">
                <ListOrdered className="h-4 w-4" aria-hidden="true" /> On this page
              </summary>
              <nav aria-label="On this page" className="px-5 pb-4">
                <Toc sections={post.sections} active={active} />
              </nav>
            </details>

            <div className="blog-prose mt-8 max-w-[68ch]">
              <div
                id={bodyElementId(post.slug, "intro")}
                dangerouslySetInnerHTML={{ __html: postBodyHtml(post.slug, "intro") }}
              />
              {post.sections.map((s, i) => (
                <Fragment key={s.id}>
                  <div
                    id={bodyElementId(post.slug, s.id)}
                    dangerouslySetInnerHTML={{ __html: postBodyHtml(post.slug, s.id) }}
                  />
                  {i === ctaAfter && <InlineCta />}
                </Fragment>
              ))}
            </div>

            <div className="max-w-[68ch]">
              {post.faqs.length > 0 && (
                <section aria-labelledby="post-faq-title" className="mt-12">
                  <h2
                    id="post-faq-title"
                    className="font-display text-2xl font-semibold tracking-tight"
                  >
                    Frequently asked questions
                  </h2>
                  <Accordion type="single" collapsible className="mt-5 space-y-3">
                    {post.faqs.map((f, i) => (
                      <AccordionItem
                        key={f.q}
                        value={`faq-${i}`}
                        className="rounded-xl border border-border bg-card px-4 sm:px-5"
                      >
                        <AccordionTrigger className="py-4 text-left font-display text-[0.95rem] font-semibold hover:no-underline">
                          {f.q}
                        </AccordionTrigger>
                        <AccordionContent
                          forceMount
                          className="pb-4 text-[0.95rem] leading-relaxed text-muted-foreground"
                        >
                          {f.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              <section
                aria-label="About the author"
                className="mt-12 flex gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <img
                  src="/blog/peace-avatar.webp"
                  alt="Peace, Lead Artist at Xing"
                  width={80}
                  height={80}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-full border border-border object-cover object-top sm:h-20 sm:w-20"
                />
                <div>
                  <p className="eyebrow">Written by</p>
                  <p className="mt-1 font-display text-lg font-semibold">Peace</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {LEAD_ARTIST.role} at Xing, Brookefield, with {COUNTS.years} years of experience.
                    Every consultation, design and session at the studio is handled by Peace
                    personally.
                  </p>
                  <Link
                    to="/tattoo-artist"
                    className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-amber-800 hover:underline"
                  >
                    Meet Peace <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </section>

              <RelatedService href={post.relatedService} />
              <ShareButtons post={post} />
            </div>

            {related.length > 0 && (
              <section
                aria-labelledby="related-title"
                className="mt-14 border-t border-border pt-10"
              >
                <h2 id="related-title" className="font-display text-xl font-semibold">
                  Keep reading
                </h2>
                <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <PostCard post={p} size="compact" />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <SignatureServices variant="compact" leadHref={post.relatedService} />
          </article>

          {/* Desktop: sticky table of contents */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Table of contents"
              className="sticky top-[calc(var(--header-h,5rem)+1.5rem)] max-h-[calc(100vh-var(--header-h,5rem)-3rem)] overflow-y-auto"
            >
              <p className="eyebrow mb-3">On this page</p>
              <Toc sections={post.sections} active={active} />
            </nav>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
