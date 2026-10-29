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

// After a new deploy (or a dev-server dependency re-optimise), a tab that was already open asks
// for script files that no longer exist and the page fails to load. Reload once to pick up the
// new build; the session flag stops a reload loop if the files really are missing.
window.addEventListener("vite:preloadError", (event) => {
  try {
    if (sessionStorage.getItem("xing:reloaded-for-new-build")) return;
    sessionStorage.setItem("xing:reloaded-for-new-build", "1");
  } catch {
    // storage blocked: still reload once (no flag means no loop guard, but the page is broken anyway)
  }
  event.preventDefault();
  window.location.reload();
});

requestAnimationFrame(() => setTimeout(hydrate, 0));
// Loaded fine: allow the one-time reload again for the next deploy
window.setTimeout(() => {
  try {
    sessionStorage.removeItem("xing:reloaded-for-new-build");
  } catch {
    // storage blocked
  }
}, 10_000);
