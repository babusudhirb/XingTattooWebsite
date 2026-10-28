/**
 * Analytics events. Pushes to the GTM / gtag `dataLayer` that GoogleTag sets up in
 * production; a no-op when no tag is configured (dev, or no ID in the env).
 *
 * Events (all carry `location`): click_call, click_whatsapp, click_directions,
 * click_book_consultation, click_email, click_offer, and generate_lead (booking form
 * success only). Never sends form text or personal details.
 */
export type TrackEvent =
  | "click_call"
  | "click_whatsapp"
  | "click_directions"
  | "click_book_consultation"
  | "click_email"
  | "click_offer"
  | "generate_lead"
  | (string & {});

type Win = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export function track(name: TrackEvent, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  if (!w.dataLayer) return;
  // gtag.js reads `arguments`-style entries; GTM reads plain objects with `event`
  if (typeof w.gtag === "function") w.gtag("event", name, params);
  else w.dataLayer.push({ event: name, ...params });
}

/**
 * One delegated listener for every element with `data-track="<event>"` (and
 * `data-location`), so CTAs and links need only the attributes, not their own handlers.
 */
export function initClickTracking() {
  if (typeof document === "undefined") return () => {};
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-track]");
    if (!el) return;
    track(el.dataset["track"]!, { location: el.dataset["location"] || "page" });
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
