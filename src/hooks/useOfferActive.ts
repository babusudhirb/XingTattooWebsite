import { useEffect, useState } from "react";

import { isOfferActive } from "@/data/business";

/**
 * Whether the GBP offer is running. The first render uses the build date (so it
 * matches the prerendered HTML); the browser then re-checks today's date in
 * India time, so banners disappear on their own after the offer ends.
 */
export function useOfferActive() {
  const [active, setActive] = useState(() => isOfferActive());
  useEffect(() => setActive(isOfferActive()), []);
  return active;
}
