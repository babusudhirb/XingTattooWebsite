// Deliberately not React Context: this app's router code-splits each route's
// component into its own chunk, which can give SSR two disconnected instances
// of a Context created in a shared module. A window CustomEvent is immune to
// that — it's dispatched/received through the one real global object instead
// of a module-scoped reference, so it works no matter which chunk calls it.
const BOOKING_EVENT = "xing:open-booking";

export interface OpenBookingDetail {
  prefillStyle: string | undefined;
}

export function openBookingModal(prefillStyle?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OpenBookingDetail>(BOOKING_EVENT, { detail: { prefillStyle } }),
  );
}

export function onOpenBookingModal(handler: (detail: OpenBookingDetail) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => handler((e as CustomEvent<OpenBookingDetail>).detail ?? {});
  window.addEventListener(BOOKING_EVENT, listener);
  return () => window.removeEventListener(BOOKING_EVENT, listener);
}
