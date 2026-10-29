import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

// Every page is prerendered complete, so let the browser paint that HTML first and hydrate
// right after: requestAnimationFrame runs before the next paint, the timeout just after it.
// Without this, on a fast connection the preloaded scripts hydrate before the first paint and
// hold back FCP/LCP by the hydration time. Same as TanStack's default entry otherwise.
function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    );
  });
}

requestAnimationFrame(() => setTimeout(hydrate, 0));
