import { useEffect, useState } from "react";
import { format, isToday, isTomorrow } from "date-fns";
import { ArrowRight, CalendarClock } from "lucide-react";

import ctaMachine from "@/assets/cta-machine.webp";
import { firstOpenDate, getSlotsForDate } from "@/lib/booking-slots";
import { openBookingModal } from "@/components/booking/BookingContext";
import { BookCTA, CallCTA, WhatsAppCTA } from "@/components/cta";
import { TattooFlash } from "@/components/sections/TattooFlash";

const STEPS = ["Share your idea", "Get your custom design", "Book your session"];
import { COUNTS, GOOGLE_RATING } from "@/data/business";
const TRUST = [`${GOOGLE_RATING}★ on Google`, `${COUNTS.tattoos} tattoos`, "Single-use needles", "No payment upfront"];

/** Same schedule the booking form uses, so the promised slot is really bookable. */
function nextOpenSlot() {
  const date = firstOpenDate();
  if (!date) return undefined;
  const slot = getSlotsForDate(date).find((s) => s.status === "available");
  if (!slot) return undefined;
  const day = isToday(date) ? "Today" : isTomorrow(date) ? "Tomorrow" : format(date, "EEE, d MMM");
  return `${day} · ${slot.label.split(" – ")[0]}`;
}

export function BookingCTA() {
  // Depends on the visitor's clock, so it's computed after mount — the server
  // can't know it, and rendering it there would mismatch on hydration.
  const [nextSlot, setNextSlot] = useState<string>();
  useEffect(() => setNextSlot(nextOpenSlot()), []);

  return (
    <section
      id="book"
      aria-labelledby="book-cta-title"
      className="cv-auto mx-auto max-w-7xl px-5 pb-12 sm:pb-16"
    >
      <div className="relative isolate overflow-hidden rounded-sm border border-amber-400/25 bg-[#0b0a08] text-stone-100 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
        {/* Photo on the right, fading into the dark panel */}
        <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[55%]" aria-hidden="true">
          <img
            src={ctaMachine}
            alt=""
            width={768}
            height={640}
            loading="lazy"
            // Mirrored so the gold machine (left in the original) sits clear of the fade
            className="h-full w-full -scale-x-100 object-cover object-[35%_30%] opacity-40 lg:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a08] via-[#0b0a08]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a08]/80 via-transparent to-transparent" />
        </div>

        {/* Gold glow + drifting flash art */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.16),transparent_55%)]" />
          <TattooFlash
            name="compass"
            className="flash-drift absolute -top-8 -left-8 h-36 w-36 text-amber-300/15"
            style={{ "--r": "-12deg" } as React.CSSProperties}
          />
          <TattooFlash
            name="rose"
            className="flash-drift absolute bottom-4 left-[44%] hidden h-20 w-20 text-amber-300/15 lg:block"
            style={{ "--r": "10deg", animationDelay: "2s" } as React.CSSProperties}
          />
        </div>

        <div className="max-w-2xl p-5 sm:p-10 lg:p-12">
          <p className="font-display text-xs font-semibold tracking-[0.18em] text-amber-400 uppercase">
            Ready To Get Inked?
          </p>
          <h2
            id="book-cta-title"
            className="mt-3 font-display text-[1.6rem] leading-[1.1] font-semibold tracking-tight uppercase sm:text-4xl"
          >
            Book Your{" "}
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Free Consultation
            </span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-300 sm:text-base">
            Tell us your idea — Peace will sketch it, size it for your body and give you a clear
            quote. No pressure, and nothing to pay until you're sure.
          </p>

          {/* What happens next */}
          <ol className="mt-6 flex flex-col items-start gap-2 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="flex items-center gap-2 rounded-full border border-amber-400/25 bg-white/[0.04] py-1.5 pr-3 pl-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 font-display text-xs font-bold text-black">
                    {i + 1}
                  </span>
                  {step}
                </span>
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    className="hidden h-3.5 w-3.5 text-amber-400/60 sm:block"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>

          {/* Next open slot — live from the booking schedule */}
          <button
            type="button"
            data-track="click_book_consultation"
            data-location="next_slot"
            onClick={() => openBookingModal()}
            className="group mt-7 flex w-full max-w-md items-center gap-3 rounded-sm border border-emerald-400/30 bg-emerald-400/[0.07] px-4 py-3 text-left transition-colors hover:border-emerald-400/60 hover:bg-emerald-400/[0.12]"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <CalendarClock className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-[0.8rem] sm:text-sm">
              <span className="text-stone-400">Next open slot: </span>
              <span className="font-semibold text-emerald-200">
                {nextSlot ?? "Checking the schedule…"}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-emerald-300 transition-transform group-hover:translate-x-1" />
          </button>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <BookCTA
              location="booking_section"
              className="col-span-2 bg-yellow-400 px-7 text-black [@media(hover:hover)]:hover:bg-yellow-300 [@media(hover:hover)]:hover:opacity-100"
            />
            <WhatsAppCTA
              location="booking_section"
              className="border-amber-400/50 px-4 text-amber-100 sm:px-6 [@media(hover:hover)]:hover:bg-amber-400/10"
            />
            <CallCTA
              location="booking_section"
              className="col-span-2 border-white/15 px-4 text-stone-200 sm:col-span-1 [@media(hover:hover)]:hover:bg-white/5"
            />
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs tracking-wide text-stone-400 uppercase">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1 w-1 rotate-45 bg-amber-400" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
