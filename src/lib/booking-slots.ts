import { format } from "date-fns";

/** Studio hours: 10:00 AM – 9:00 PM, closed every Tuesday. */
export const OPEN_MINUTES = 10 * 60;
export const CLOSE_MINUTES = 21 * 60;
export const SLOT_COUNT = 8;
/** Each slot lasts 45 or 60 minutes; starts are kept on 15-minute marks. */
const SLOT_LENGTHS = [45, 60];
const TIME_STEP = 15;
/** Today's slots starting sooner than this are no longer bookable. */
const LEAD_TIME_MINUTES = 30;
/** How far ahead the calendar lets people book. */
export const BOOKING_WINDOW_DAYS = 60;

export type SlotStatus = "available" | "busy" | "past";

export interface Slot {
  index: number;
  minutes: number;
  endMinutes: number;
  duration: number;
  label: string;
  status: SlotStatus;
}

export function isClosedDay(date: Date) {
  return date.getDay() === 2;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isBookableDate(date: Date, now = new Date()) {
  const day = startOfDay(date);
  const today = startOfDay(now);
  const last = new Date(today);
  last.setDate(last.getDate() + BOOKING_WINDOW_DAYS);
  return day >= today && day <= last && !isClosedDay(day);
}

export function formatSlotTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** FNV-1a: turns the date key into a stable 32-bit seed. */
function hashString(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32: small seeded PRNG, same seed → same sequence. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The day's schedule, seeded by its YYYY-MM-DD key — every date gets a
 * different pattern, and the same date always gets the same one.
 *
 * 8 slots of 45 or 60 minutes are spread evenly across opening hours with
 * equal breaks between them. 2–3 of them are candidates for "busy" (≈25–40%
 * of the day); getSlotsForDate only applies them to the near-term days.
 */
function scheduleFor(dateKey: string) {
  const rng = mulberry32(hashString(dateKey));
  const durations = Array.from(
    { length: SLOT_COUNT },
    () => SLOT_LENGTHS[Math.floor(rng() * SLOT_LENGTHS.length)]!,
  );
  const worked = durations.reduce((a, b) => a + b, 0);
  // Free time is shared across the 7 breaks, so the first slot opens at
  // 10:00 AM and the last one ends at 9:00 PM.
  const gap = (CLOSE_MINUTES - OPEN_MINUTES - worked) / (SLOT_COUNT - 1);

  const busyTarget = 2 + Math.floor(rng() * 2);
  const busy = new Set<number>();
  while (busy.size < busyTarget) busy.add(Math.floor(rng() * SLOT_COUNT));

  let exactStart = OPEN_MINUTES;
  return durations.map((duration, index) => {
    const minutes = Math.round(exactStart / TIME_STEP) * TIME_STEP;
    exactStart += duration + gap;
    return { index, minutes, endMinutes: minutes + duration, duration, busy: busy.has(index) };
  });
}

/** Busy slots only appear on today and tomorrow; later days are fully open. */
const BUSY_DAYS_AHEAD = 1;

export function getSlotsForDate(
  date: Date,
  now = new Date(),
  { ignorePast = false }: { ignorePast?: boolean } = {},
): Slot[] {
  const daysAhead = Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / 86_400_000,
  );
  const showBusy = daysAhead <= BUSY_DAYS_AHEAD;
  const cutoff = now.getHours() * 60 + now.getMinutes() + LEAD_TIME_MINUTES;

  return scheduleFor(format(date, "yyyy-MM-dd")).map(({ busy, ...slot }) => ({
    ...slot,
    label: `${formatSlotTime(slot.minutes)} – ${formatSlotTime(slot.endMinutes)}`,
    status:
      !ignorePast && daysAhead === 0 && slot.minutes < cutoff
        ? "past"
        : busy && showBusy
          ? "busy"
          : "available",
  }));
}

/** First date (today onwards) that still has at least one open slot. */
export function firstOpenDate(now = new Date()) {
  const d = startOfDay(now);
  for (let i = 0; i <= BOOKING_WINDOW_DAYS; i++) {
    if (!isClosedDay(d) && getSlotsForDate(d, now).some((s) => s.status === "available")) {
      return new Date(d);
    }
    d.setDate(d.getDate() + 1);
  }
  return undefined;
}
