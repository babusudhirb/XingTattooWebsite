import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Long copy on phones: the first `lines` lines, then "Read more". The full text is always in
 * the HTML and shown in full from md up — the same DOM at every breakpoint, so mobile-first
 * indexing sees everything. The button only shows when the text is actually cut off.
 */
export function ReadMore({
  children,
  lines = 3,
  className,
}: {
  children: ReactNode;
  lines?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  return (
    <div className={className}>
      <div
        ref={ref}
        id={id}
        className={open ? undefined : "read-more-clamp"}
        style={{ "--lines": lines } as CSSProperties}
      >
        {children}
      </div>
      {(clamped || open) && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-amber-800 underline underline-offset-4 md:hidden"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
