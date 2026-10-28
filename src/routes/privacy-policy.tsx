import { createFileRoute } from "@tanstack/react-router";

import { BUSINESS_NAME, pageTitle } from "@/data/business";
import { LegalPage } from "@/components/layout/LegalPage";
import { seoHead } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/blog";

const TITLE = pageTitle("Privacy Policy");
const DESCRIPTION =
  "How Xing Premium Tattoo Studio, Brookefield, Bengaluru uses the details you share through our booking and offer forms, WhatsApp and phone. We never sell it.";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    seoHead({
      path: "/privacy-policy",
      title: TITLE,
      description: DESCRIPTION,
      graph: [breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Privacy Policy" }])],
    }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" updated="26 October 2026">
      <p>
        This policy explains what information {BUSINESS_NAME} (“we”, “the studio”) collects through
        this website and how we use it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Booking and offer forms:</strong> the name, phone number, age, tattoo style,
          preferred date and time, and any idea you choose to share.
        </li>
        <li>
          <strong>WhatsApp and phone:</strong> the messages, photos and details you send us when you
          contact the studio directly.
        </li>
      </ul>
      <h2>How we use it</h2>
      <p>
        We use your details only to reply to your enquiry, plan your design, confirm your
        appointment and give you aftercare support. We don't sell or rent your information.
      </p>
      <h2>Third-party services</h2>
      <p>
        When you use WhatsApp, Google Maps or other linked services, their own privacy policies
        apply to the information you share there.
      </p>
      <h2>Keeping and deleting your details</h2>
      <p>
        We keep enquiry and booking details only as long as we need them for your appointment and
        aftercare. To see, correct or delete the details we hold about you, contact us using the
        details below.
      </p>
      <h2>Age</h2>
      <p>
        You must be 18 or older to be tattooed at the studio. We may ask for photo ID before your
        session.
      </p>
    </LegalPage>
  );
}
