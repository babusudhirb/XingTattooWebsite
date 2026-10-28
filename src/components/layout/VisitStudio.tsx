import { useEffect, useState } from "react";

import { CallCTA, DirectionsCTA, WhatsAppCTA } from "@/components/cta";
import { AttributeChips, LazyMap } from "@/components/layout/StudioBits";

import {
  ADDRESS,
  BUSINESS_NAME,
  CLOSE_TIME,
  HOURS,
  MAPS_PLACE_URL,
  OPEN_LABEL,
  OPEN_TIME,
  RATING_LABEL,
  HOURS_ROWS,
} from "@/data/business";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h! * 60 + m!;
};

/** Day of week and minutes past midnight in the studio's time zone. */
function studioNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

/** Client-only (the page is prerendered, so "now" is only known in the browser). */
function useStudioStatus() {
  const [status, setStatus] = useState<{ day: number; open: boolean } | null>(null);
  useEffect(() => {
    const update = () => {
      const { day, minutes } = studioNow();
      const closedDay = HOURS.find((h) => h.day === day)?.closed;
      const open = !closedDay && minutes >= toMinutes(OPEN_TIME) && minutes < toMinutes(CLOSE_TIME);
      setStatus({ day, open });
    };
    update();
    const t = window.setInterval(update, 60_000);
    return () => window.clearInterval(t);
  }, []);
  return status;
}


/** Homepage footer block: address, hours, directions and the live map. */
export function VisitStudio() {
  const status = useStudioStatus();

  return (
    <section
      id="visit-us"
      aria-labelledby="visit-us-title"
      className="mx-auto grid max-w-7xl gap-6 border-b border-border px-5 py-12 md:grid-cols-2 md:gap-x-8 lg:grid-cols-[2fr_3fr] lg:gap-x-12"
    >
      <div className="min-w-0">
        <p className="eyebrow">Visit The Studio</p>
        <h2
          id="visit-us-title"
          className="mt-3 font-display text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl"
        >
          {BUSINESS_NAME}
        </h2>
        <address className="mt-4 text-sm leading-relaxed not-italic">
          <a
            href={MAPS_PLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            {ADDRESS.full}
          </a>
        </address>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Landmark: right {ADDRESS.landmark} — about 3 km from
          Marathahalli, easy reach from Whitefield &amp; ITPL.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <DirectionsCTA location="visit_studio" variant="primary" />
          <CallCTA location="visit_studio" />
          <WhatsAppCTA location="visit_studio" />
        </div>
      </div>

      <div className="min-w-0 md:col-start-2 md:row-span-2 md:row-start-1">
        <LazyMap />
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">Opening Hours</p>
          {status && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                status.open ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
              }`}
            >
              {status.open ? "Open now" : "Closed now"}
            </span>
          )}
        </div>
        <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
          {HOURS_ROWS.map(({ label, days, closed }) => {
            const today = status != null && days.includes(status.day);
            return (
              <li
                key={label}
                className={`flex justify-between gap-4 px-2 py-2.5 ${today ? "bg-card font-semibold" : ""}`}
                aria-current={today ? "date" : undefined}
              >
                <span>{label}</span>
                <span className={closed ? "text-amber-800" : "text-muted-foreground"}>
                  {closed ? "Closed" : OPEN_LABEL}
                </span>
              </li>
            );
          })}
        </ul>

        <AttributeChips className="mt-5" />

        <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="font-semibold">
            {RATING_LABEL}
          </span>
          <span aria-hidden="true">—</span>
          <a
            href={MAPS_PLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-amber-800 underline decoration-amber-800/30 underline-offset-4 hover:decoration-amber-800"
          >
            See us on Google
          </a>
        </p>
      </div>
    </section>
  );
}
