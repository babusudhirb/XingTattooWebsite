import { useEffect, useState } from "react";

import { CLOSE_TIME, HOURS, OPEN_LABEL, OPEN_TIME } from "@/data/business";

const hour12 = (hhmm: string) => {
  const h = Number(hhmm.slice(0, 2));
  return `${h % 12 || 12}:${hhmm.slice(3, 5)} ${h < 12 ? "AM" : "PM"}`;
};
const OPENS = hour12(OPEN_TIME);
const CLOSES = hour12(CLOSE_TIME);

/** Weekday (0 = Sunday) and HH:MM right now in the studio's time zone. */
function studioClock(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, time: `${get("hour")}:${get("minute")}` };
}

const isClosedDay = (day: number) => HOURS.some((h) => h.day === day && h.closed);
const dayName = (day: number) => HOURS.find((h) => h.day === day)!.long;

export interface TodayHours {
  open: boolean;
  /** Drawer line: "Open now · closes 9:00 PM", "Closed today (Tuesday)", … */
  status: string;
  /** Header line: "Open today <OPEN_LABEL>" or "Closed today". */
  today: string;
}

export function todayHours(now = new Date()): TodayHours {
  const { day, time } = studioClock(now);
  if (isClosedDay(day))
    return { open: false, status: `Closed today (${dayName(day)})`, today: "Closed today" };
  const today = `Open today ${OPEN_LABEL}`;
  if (time < OPEN_TIME) return { open: false, status: `Closed now · opens ${OPENS}`, today };
  if (time < CLOSE_TIME) return { open: true, status: `Open now · closes ${CLOSES}`, today };
  const next = (day + 1) % 7;
  const when = isClosedDay(next) ? `${dayName((next + 1) % 7)} ${OPENS}` : `${OPENS} tomorrow`;
  return { open: false, status: `Closed now · opens ${when}`, today };
}

/**
 * Today's hours, computed in the browser (India time). Pages are prerendered, so the
 * server HTML shows `null` and the line fills in after hydration.
 */
export function useTodayHours() {
  const [hours, setHours] = useState<TodayHours | null>(null);
  useEffect(() => {
    const update = () => setHours(todayHours());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return hours;
}
