import { Fragment, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Crosshair, Feather, MapPin } from "lucide-react";

import type { BenefitCard, BenefitIcon, ProcessStep } from "@/data/services";
import { openBookingModal } from "@/components/booking/BookingContext";

const benefitIcons: Record<BenefitIcon, typeof Feather> = {
  heal: Feather,
  placement: MapPin,
  precision: Crosshair,
};

/** Arrow-key / Home / End navigation for a WAI-ARIA tablist. */
function useTabKeys(count: number, active: number, setActive: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent) => {
    const next: Record<string, number> = {
      ArrowRight: (active + 1) % count,
      ArrowDown: (active + 1) % count,
      ArrowLeft: (active - 1 + count) % count,
      ArrowUp: (active - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const target = next[e.key];
    if (target === undefined) return;
    e.preventDefault();
    setActive(target);
    refs.current[target]?.focus();
  };
  return { refs, onKeyDown };
}

/** Disclosure cards: on phones the details open directly under the tapped card;
 *  from `sm` up the open panel moves below the row and spans all columns. */
export function BenefitCards({ cards, styleName }: { cards: BenefitCard[]; styleName: string }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = benefitIcons[card.icon];
        const selected = i === active;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <Fragment key={card.title}>
            <div
              className={`group relative flex flex-col items-start rounded-sm border bg-card p-6 text-left shadow-[var(--shadow-card)] transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-700 hover:-translate-y-1 hover:border-amber-700/60 hover:shadow-[var(--shadow-soft)] ${
                selected
                  ? "-translate-y-1 border-amber-700 shadow-[var(--shadow-soft)]"
                  : "border-border"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 ${
                  selected
                    ? "bg-amber-700 text-white"
                    : "bg-accent text-amber-700 group-hover:bg-amber-700 group-hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 font-display text-xs font-semibold tracking-[0.12em] text-amber-700 uppercase">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
              {/* after:inset-0 stretches the hit area so the whole card is clickable */}
              <button
                aria-expanded={selected}
                aria-controls={panelId}
                onClick={() => setActive(i)}
                className="mt-4 inline-flex items-center gap-1.5 font-display text-xs font-semibold tracking-[0.14em] uppercase after:absolute after:inset-0 focus-visible:outline-none"
              >
                {selected ? "Showing details" : "See details"}
                <span className="sr-only"> for {card.title}</span>
                <ArrowRight
                  className={`h-3 w-3 transition-transform duration-300 ${selected ? "rotate-90" : "group-hover:translate-x-1"}`}
                />
              </button>
            </div>

            <div
              id={panelId}
              hidden={!selected}
              className="animate-fade-in rounded-sm border border-amber-700/30 bg-card p-6 shadow-[var(--shadow-card)] sm:order-last sm:col-span-3"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="eyebrow text-amber-700">{card.detailTitle}</p>
                  <ul
                    className={`mt-3 ${card.icon === "placement" ? "flex flex-wrap gap-2" : "space-y-2"}`}
                  >
                    {card.detail.map((d) =>
                      card.icon === "placement" ? (
                        <li
                          key={d}
                          className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
                        >
                          {d}
                        </li>
                      ) : (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                            strokeWidth={2}
                          />
                          {d}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <button
                  onClick={() => openBookingModal(styleName)}
                  className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 font-display text-xs font-bold tracking-[0.14em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
                >
                  Sounds Like Me <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export function AftercareSteps({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const { refs, onKeyDown } = useTabKeys(steps.length, active, setActive);
  const baseId = useId();
  const progress = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 100;

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="relative">
        {/* Progress rail sits behind the step dots */}
        <div
          className="absolute top-5 right-[12.5%] left-[12.5%] h-px bg-border"
          aria-hidden="true"
        >
          <div
            className="h-full bg-amber-700 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol
          role="tablist"
          aria-label="Aftercare steps"
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, i) => {
            const selected = i === active;
            const done = i < active;
            return (
              <li key={step.title} className="flex justify-center" role="presentation">
                <button
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  id={`${baseId}-tab-${i}`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${i}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKeyDown}
                  className="group flex flex-col items-center gap-2 px-1 focus-visible:outline-none"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-sm font-bold transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-amber-700 group-focus-visible:ring-offset-2 ${
                      selected
                        ? "scale-110 border-amber-700 bg-amber-700 text-white"
                        : done
                          ? "border-amber-700 bg-background text-amber-700"
                          : "border-border bg-background text-muted-foreground group-hover:border-amber-700 group-hover:text-amber-700"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span
                    className={`text-center font-display text-xs font-semibold tracking-[0.1em] uppercase sm:text-xs ${
                      selected ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {steps.map((step, i) => (
        <div
          key={step.title}
          id={`${baseId}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
          className="animate-fade-in mt-8 rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
        >
          <p className="eyebrow text-amber-700">
            Step {i + 1} of {steps.length}
          </p>
          <h3 className="mt-2 font-display text-lg font-semibold tracking-[0.06em] uppercase">
            {step.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {step.text}
          </p>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setActive(i - 1)}
              disabled={i === 0}
              className="inline-flex min-h-11 items-center gap-2 font-display text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:text-amber-700 disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            {i < steps.length - 1 ? (
              <button
                onClick={() => setActive(i + 1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary px-5 py-2.5 font-display text-xs font-bold tracking-[0.14em] uppercase transition-colors hover:bg-accent"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase">
                <Check className="h-4 w-4" /> You're all set
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
