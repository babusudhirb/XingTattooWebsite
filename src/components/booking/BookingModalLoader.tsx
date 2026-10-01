import { lazy, Suspense, useEffect, useState } from "react";

import {
  onOpenBookingModal,
  openBookingModal,
  type OpenBookingDetail,
} from "@/components/booking/BookingContext";

const BookingModal = lazy(() =>
  import("@/components/booking/BookingModal").then((m) => ({ default: m.BookingModal })),
);

/** Re-sends the click that triggered the download, once the modal is listening. */
function Replay({ detail }: { detail: OpenBookingDetail }) {
  useEffect(() => {
    openBookingModal(detail.prefillStyle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/**
 * The booking modal (calendar, date and form code) is the heaviest part of the
 * site and no page needs it to render, so it is kept out of the first download:
 * it loads on the first "Book" click, or quietly once the page has settled.
 */
export function BookingModalLoader() {
  const [first, setFirst] = useState<OpenBookingDetail | undefined>(undefined);

  useEffect(() => {
    if (first) return;
    const warm = window.setTimeout(() => void import("@/components/booking/BookingModal"), 4000);
    const off = onOpenBookingModal(setFirst);
    return () => {
      window.clearTimeout(warm);
      off();
    };
  }, [first]);

  if (!first) return null;
  return (
    <Suspense fallback={null}>
      <BookingModal />
      <Replay detail={first} />
    </Suspense>
  );
}
