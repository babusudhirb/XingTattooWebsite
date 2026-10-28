import { createFileRoute } from "@tanstack/react-router";

import { BUSINESS_NAME, HOURS_LONG, pageTitle } from "@/data/business";
import { LegalPage } from "@/components/layout/LegalPage";
import { seoHead } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/blog";

const TITLE = pageTitle("Terms & Conditions");
const DESCRIPTION =
  "Terms for consultations, bookings, offers and aftercare at Xing Premium Tattoo Studio, Brookefield, Bengaluru. Please read before your free consultation.";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () =>
    seoHead({
      path: "/terms-and-conditions",
      title: TITLE,
      description: DESCRIPTION,
      graph: [breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Terms & Conditions" }])],
    }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms & Conditions" updated="26 October 2026">
      <p>
        These terms apply to consultations, bookings and tattoo sessions at {BUSINESS_NAME}. By
        booking, you agree to them.
      </p>
      <h2>Consultations and quotes</h2>
      <p>
        Consultations are free and there's no obligation to book. Your exact quote is confirmed at
        the consultation, after we've seen your design, size and placement. Offers shown on this
        website apply only within their stated dates.
      </p>
      <h2>Age and health</h2>
      <ul>
        <li>You must be 18 or older, and we may ask for photo ID.</li>
        <li>
          Please tell us about allergies, skin conditions, medication or medical conditions before
          your session. We may ask you to check with your doctor first.
        </li>
        <li>We won't tattoo anyone who appears to be under the influence of alcohol or drugs.</li>
      </ul>
      <h2>Your design</h2>
      <p>
        Every design is drawn for you and approved by you before tattooing begins. Please check
        spellings, dates and scripts carefully — once the stencil is approved, the tattoo is applied
        as shown.
      </p>
      <h2>Aftercare and touch-ups</h2>
      <p>
        Healing depends on following the aftercare guidance we give you. If any part of your tattoo
        heals unevenly, we offer a free touch-up once it has fully healed.
      </p>
      <h2>Studio hours</h2>
      <p>{HOURS_LONG}.</p>
    </LegalPage>
  );
}
