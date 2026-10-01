import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CalendarDays, Check, Clock, MessageCircle, X } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WHATSAPP_URL } from "@/data/site";
import {
  BOOKING_WINDOW_DAYS,
  firstOpenDate,
  getSlotsForDate,
  isBookableDate,
  type Slot,
} from "@/lib/booking-slots";
import { sendBookingRequest } from "@/lib/booking-request";
import { onOpenBookingModal } from "@/components/booking/BookingContext";

const TATTOO_STYLES = [
  "Realism",
  "Portrait",
  "Geometric",
  "Traditional",
  "Minimalist & Fine-Line",
  "Black & Grey",
  "Custom Design",
];

/** Service pages pass their short name ("Minimalist"); match it to a dropdown option. */
function matchStyle(prefill: string | undefined) {
  if (!prefill) return "";
  return TATTOO_STYLES.find((s) => s === prefill || s.startsWith(prefill)) ?? "";
}

interface FormState {
  name: string;
  phone: string;
  age: string;
  style: string;
  date: Date | undefined;
  slot: string | undefined;
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  age: "",
  style: "",
  date: undefined,
  slot: undefined,
};

type FormErrors = Partial<Record<keyof FormState, string | undefined>>;

const inputClass =
  "mt-1.5 flex h-11 w-full rounded-sm border border-input bg-transparent px-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none aria-invalid:border-destructive";

function slotClass(slot: Slot, selected: boolean) {
  if (selected) {
    return "border-emerald-600 bg-emerald-600 text-white shadow-[var(--shadow-soft)]";
  }
  switch (slot.status) {
    case "available":
      return "border-emerald-500/50 bg-emerald-50 text-emerald-800 hover:border-emerald-600 hover:bg-emerald-100";
    case "busy":
      return "cursor-not-allowed border-red-300 bg-red-50 text-red-700/80";
    case "past":
      return "cursor-not-allowed border-transparent bg-muted text-muted-foreground/50";
  }
}

export function BookingModal() {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const selectOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [prefillStyle, setPrefillStyle] = useState<string | undefined>(undefined);
  const [closing, setClosing] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  /** Whether the studio was emailed; if not, WhatsApp is the only way the request arrives. */
  const [emailSent, setEmailSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [busyNotice, setBusyNotice] = useState<string | undefined>(undefined);

  const requestClose = useCallback(() => {
    setClosing((c) => {
      if (!c) window.setTimeout(() => setIsOpen(false), 220);
      return true;
    });
  }, []);

  useEffect(() => {
    return onOpenBookingModal(({ prefillStyle: style }) => {
      setPrefillStyle(style);
      setIsOpen(true);
    });
  }, []);

  // Fresh form every time the modal is opened, with the next open day
  // preselected so slots are visible straight away.
  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      setForm({ ...EMPTY_FORM, style: matchStyle(prefillStyle), date: firstOpenDate() });
      setErrors({});
      setSubmitting(false);
      setSubmitted(false);
      setEmailSent(false);
      setHoneypot("");
      setBusyNotice(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      // The style dropdown handles its own Escape/Tab while it is open.
      if (selectOpenRef.current) return;
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes).filter((n) => n.offsetParent !== null);
      if (list.length === 0) return;
      const first = list[0]!;
      const last = list[list.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, requestClose]);

  const slots = useMemo(() => (form.date ? getSlotsForDate(form.date) : []), [form.date]);
  const openCount = slots.filter((s) => s.status === "available").length;
  const busyCount = slots.filter((s) => s.status === "busy").length;

  if (!isOpen) return null;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pickDate = (date: Date | undefined) => {
    if (!date) return;
    setForm((f) => ({ ...f, date, slot: undefined }));
    setErrors((e) => ({ ...e, date: undefined, slot: undefined }));
    setBusyNotice(undefined);
  };

  const pickSlot = (slot: Slot) => {
    if (slot.status === "busy") {
      setBusyNotice(`${slot.label} is taken — the artist is occupied then. Pick a green slot.`);
      return;
    }
    if (slot.status === "past") return;
    setBusyNotice(undefined);
    setField("slot", slot.label);
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (form.name.trim().length < 2) {
      next.name = "Enter your full name";
    }
    if (!/^[+]?[0-9]{10,13}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      next.phone = "Enter a valid phone / WhatsApp number";
    }
    const ageNum = Number(form.age);
    if (!form.age || !Number.isInteger(ageNum) || ageNum < 18 || ageNum > 100) {
      next.age = "You must be 18 or older";
    }
    if (!form.style) {
      next.style = "Choose a tattoo style";
    }
    if (!form.date || !isBookableDate(form.date)) {
      next.date = "Pick an available date";
    }
    const chosen = slots.find((s) => s.label === form.slot);
    if (!chosen || chosen.status !== "available") {
      next.slot = "Pick a green (available) time slot";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError || !form.date || !form.slot) {
      panelRef.current
        ?.querySelector<HTMLElement>(`[data-field="${firstError}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      await sendBookingRequest({
        data: {
          name: form.name,
          phone: form.phone,
          age: Number(form.age),
          style: form.style,
          date: format(form.date, "yyyy-MM-dd"),
          slot: form.slot,
          company: honeypot,
        },
      });
      setEmailSent(true);
    } catch (err) {
      // Still show the confirmation — the WhatsApp button carries the booking.
      console.error("Booking email failed", err);
      setEmailSent(false);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const dateLabel = form.date ? format(form.date, "EEEE, d MMM yyyy") : "";
  const whatsappMessage = encodeURIComponent(
    `Hi XING Tattoo Studio! I'd like to book a free consultation.\n\nName: ${form.name}\nPhone: ${form.phone}\nAge: ${form.age}\nStyle: ${form.style}\nDate: ${dateLabel}\nTime: ${form.slot}`,
  );

  const today = new Date();
  const lastDay = new Date();
  lastDay.setDate(lastDay.getDate() + BOOKING_WINDOW_DAYS);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="fixed inset-0 z-[70] flex items-center justify-center sm:p-6"
    >
      <div
        className={`absolute inset-0 bg-primary/70 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? "opacity-0" : "animate-fade-in opacity-100"
        }`}
        onClick={requestClose}
      />

      <div
        ref={panelRef}
        className={`relative z-10 h-[100dvh] w-full max-w-4xl overflow-y-auto overscroll-contain bg-background [-webkit-overflow-scrolling:touch] sm:h-auto sm:max-h-[94vh] sm:rounded-sm sm:border sm:border-border shadow-[var(--shadow-soft)] transition-all duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          closing ? "scale-95 opacity-0" : "animate-scale-in scale-100 opacity-100"
        }`}
      >
        <button
          ref={closeRef}
          onClick={requestClose}
          aria-label="Close booking form"
          className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 shadow-[var(--shadow-card)] transition-transform duration-300 hover:scale-110 hover:bg-accent focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10">
            <span className="animate-scale-in flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </span>
            <h2
              id="booking-title"
              className="mt-6 font-display text-2xl font-semibold tracking-wide uppercase"
            >
              {emailSent ? "Request Sent!" : "One Last Step"}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {emailSent
                ? `Thanks, ${form.name.trim().split(" ")[0]}! Your booking details have been sent to the studio. Send them on WhatsApp too — it's the fastest way to get your slot confirmed.`
                : `Thanks, ${form.name.trim().split(" ")[0]}! Send your request to us on WhatsApp to lock in this slot, and we'll confirm personally within the day.`}
            </p>

            <dl className="mt-6 grid w-full max-w-md grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border text-left text-sm">
              {[
                ["Date", form.date ? format(form.date, "EEE, d MMM") : ""],
                ["Time", form.slot ?? ""],
                ["Style", form.style],
                ["Name", form.name],
              ].map(([k, v]) => (
                <div key={k} className="bg-card px-4 py-3">
                  <dt className="text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                    {k}
                  </dt>
                  <dd className="mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              <a
                href={`${WHATSAPP_URL}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-emerald-600 px-6 py-4 font-display text-xs font-semibold tracking-[0.14em] text-white uppercase transition-transform duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" /> Send Booking On WhatsApp
              </a>
              {/* Once emailed, editing would send a duplicate — offer Done instead. */}
              <button
                onClick={emailSent ? requestClose : () => setSubmitted(false)}
                className="inline-flex items-center justify-center rounded-sm border border-border px-6 py-3.5 font-display text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
              >
                {emailSent ? "Done" : "Change Details"}
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-5 pt-[calc(3.75rem+env(safe-area-inset-top))] sm:p-8 sm:pt-10"
          >
            <p className="eyebrow text-amber-700">Free Consultation</p>
            <h2
              id="booking-title"
              className="mt-2 font-display text-2xl leading-tight font-medium tracking-tight sm:text-3xl"
            >
              Book Your Consultation
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              XING Tattoo Studio, AECS Layout, Brookefield · Open 10 AM – 9 PM · Closed Tuesdays
            </p>

            {/* Spam trap: hidden from people, but bots filling every field will fill it. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />

            {/* Details */}
            <fieldset className="mt-7">
              <legend className="font-display text-xs font-semibold tracking-[0.14em] uppercase">
                1 · Your Details
              </legend>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div data-field="name">
                  <label htmlFor="bk-name" className="text-xs font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="bk-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Your name"
                    className={inputClass}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "bk-name-err" : undefined}
                  />
                  {errors.name && (
                    <p id="bk-name-err" className="mt-1 text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div data-field="phone">
                  <label htmlFor="bk-phone" className="text-xs font-medium">
                    Phone / WhatsApp <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="bk-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "bk-phone-err" : undefined}
                  />
                  {errors.phone && (
                    <p id="bk-phone-err" className="mt-1 text-xs text-destructive">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div data-field="age">
                  <label htmlFor="bk-age" className="text-xs font-medium">
                    Age <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="bk-age"
                    type="number"
                    inputMode="numeric"
                    min={18}
                    max={100}
                    value={form.age}
                    onChange={(e) => setField("age", e.target.value)}
                    placeholder="18+"
                    className={inputClass}
                    aria-invalid={!!errors.age}
                    aria-describedby="bk-age-hint"
                  />
                  <p
                    id="bk-age-hint"
                    className={`mt-1 text-xs ${errors.age ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {errors.age ?? "You must be 18+ to get tattooed."}
                  </p>
                </div>

                <div data-field="style">
                  <label htmlFor="bk-style" className="text-xs font-medium">
                    Tattoo Style <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={form.style}
                    // Radix fires onValueChange("") from its hidden native <select> on
                    // mount, which would wipe the style prefilled from a service page.
                    onValueChange={(v) => v && setField("style", v)}
                    onOpenChange={(open) => {
                      selectOpenRef.current = open;
                    }}
                  >
                    <SelectTrigger
                      id="bk-style"
                      className="mt-1.5 h-11 w-full rounded-sm text-sm focus-visible:ring-2 focus-visible:ring-amber-700"
                      aria-invalid={!!errors.style}
                    >
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    {/* z-[80]: must sit above the modal (z-[70]) — the default z-50 renders behind it */}
                    <SelectContent className="z-[80]" position="popper">
                      {TATTOO_STYLES.map((s) => (
                        <SelectItem key={s} value={s} className="py-2.5">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.style && <p className="mt-1 text-xs text-destructive">{errors.style}</p>}
                </div>
              </div>
            </fieldset>

            {/* Date & time */}
            <fieldset className="mt-8">
              <legend className="font-display text-xs font-semibold tracking-[0.14em] uppercase">
                2 · Pick A Date &amp; Time
              </legend>
              <div className="mt-3 grid gap-6 md:grid-cols-[auto_1fr]">
                <div data-field="date">
                  <div className="mx-auto w-fit rounded-sm border border-border md:mx-0">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={pickDate}
                      defaultMonth={form.date ?? today}
                      disabled={(d) => !isBookableDate(d)}
                      startMonth={today}
                      endMonth={lastDay}
                      className="p-1 [--cell-size:2.75rem] sm:p-3"
                    />
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-amber-700" />
                    Tuesdays closed — studio rest day
                  </p>
                  {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date}</p>}
                </div>

                <div data-field="slot" className="min-w-0">
                  {form.date ? (
                    <>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold">{format(form.date, "EEEE, d MMM")}</p>
                        <p className="text-xs text-muted-foreground" aria-live="polite">
                          <span className="font-semibold text-emerald-700">{openCount} open</span>
                          {busyCount > 0 && (
                            <>
                              {" · "}
                              <span className="font-semibold text-red-600">{busyCount} booked</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" /> Available
                        </span>
                        {busyCount > 0 && (
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" /> Studio
                            occupied
                          </span>
                        )}
                      </div>

                      {openCount === 0 ? (
                        <p className="mt-4 rounded-sm border border-dashed border-input px-3 py-4 text-xs text-muted-foreground">
                          No open slots left on this day — please pick another date.
                        </p>
                      ) : (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-2">
                          {/* Phones: compact 3-column grid of start times; from sm the full range */}
                          {slots.map((slot) => {
                            const selected = form.slot === slot.label;
                            return (
                              <button
                                key={slot.index}
                                type="button"
                                onClick={() => pickSlot(slot)}
                                aria-pressed={selected}
                                aria-disabled={slot.status !== "available"}
                                aria-label={`${slot.label}, ${slot.duration} minutes, ${
                                  slot.status === "available"
                                    ? "available"
                                    : slot.status === "busy"
                                      ? "studio occupied"
                                      : "no longer available"
                                }`}
                                title={slot.status === "busy" ? "Studio occupied" : undefined}
                                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm border px-1.5 py-2 text-center text-sm tabular-nums transition-colors sm:min-h-12 sm:flex-row sm:justify-between sm:gap-2 sm:px-3 sm:py-2.5 sm:text-left focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none ${slotClass(slot, selected)}`}
                              >
                                <span
                                  className={`flex items-center gap-2 font-medium ${slot.status === "busy" ? "line-through decoration-red-400/70" : ""}`}
                                >
                                  <Clock className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
                                  <span className="sm:hidden">{slot.label.split(" – ")[0]}</span>
                                  <span className="hidden sm:inline">{slot.label}</span>
                                </span>
                                <span className="shrink-0 text-[0.7rem] opacity-80">
                                  {slot.status === "busy"
                                    ? "Occupied"
                                    : slot.status === "past"
                                      ? "Passed"
                                      : `${slot.duration} min`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {busyNotice && (
                        <p
                          role="status"
                          className="mt-3 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                        >
                          {busyNotice}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="rounded-sm border border-dashed border-input px-3 py-4 text-xs text-muted-foreground">
                      Pick a date to see available slots.
                    </p>
                  )}
                  {errors.slot && <p className="mt-2 text-xs text-destructive">{errors.slot}</p>}
                </div>
              </div>
            </fieldset>

            <div className="sticky bottom-0 -mx-5 mt-8 border-t border-border bg-background/95 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-8 sm:px-8 sm:pb-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-7 py-4 font-display text-xs font-semibold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {submitting
                  ? "Sending…"
                  : form.slot && form.date
                    ? `Book ${format(form.date, "EEE d MMM")} · ${form.slot}`
                    : "Confirm Appointment"}
              </button>
              <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">
                Free consultation · No payment required now
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
