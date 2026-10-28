import type { ReactNode } from "react";

import { ADDRESS, BUSINESS_NAME, EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/data/business";
import { EMAIL_TO } from "@/data/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SocialDock } from "@/components/layout/SocialDock";

/** Shared layout for the Privacy Policy and Terms pages. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SocialDock />
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <p className="eyebrow">{BUSINESS_NAME}</p>
        <h1 className="mt-3 font-display text-[2rem] leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="blog-prose mt-8">
          <div>{children}</div>
          <div>
            <h2>Contact us</h2>
            <address className="not-italic">
              <strong>{BUSINESS_NAME}</strong>
              <br />
              {ADDRESS.full}
              <br />
              Phone / WhatsApp: <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
              <br />
              Email: <a href={EMAIL_TO}>{EMAIL}</a>
            </address>
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
