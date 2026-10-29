import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

import { WHATSAPP_URL } from "@/data/navigation";
import type { GalleryItem } from "@/data/gallery";

export function GalleryLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing((c) => {
      if (!c) window.setTimeout(onClose, 220);
      return true;
    });
  }, [onClose]);

  const isOpen = index !== null;
  const total = items.length;

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % total);
  }, [index, onNavigate, total]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + total) % total);
  }, [index, onNavigate, total]);

  useEffect(() => {
    if (!isOpen) return;
    setClosing(false);
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, goNext, goPrev]);

  if (!isOpen || index === null) return null;
  const item = items[index]!;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-8"
    >
      <div
        className={`absolute inset-0 bg-primary/85 backdrop-blur-md transition-opacity duration-300 ${
          closing ? "opacity-0" : "animate-fade-in opacity-100"
        }`}
        onClick={requestClose}
      />

      <button
        ref={closeRef}
        onClick={requestClose}
        aria-label="Close"
        className="absolute top-[max(1rem,var(--sat))] right-[max(1rem,var(--sar))] z-30 flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/20 bg-background/10 text-primary-foreground backdrop-blur transition-transform duration-300 hover:scale-110 hover:bg-background/20 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none sm:top-6 sm:right-6"
      >
        <X className="h-5 w-5" />
      </button>

      {total > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous photo"
            className="absolute left-[max(0.5rem,var(--sal))] z-30 flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/20 bg-background/10 text-primary-foreground backdrop-blur transition-transform duration-300 hover:scale-110 hover:bg-background/20 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next photo"
            className="absolute right-[max(0.5rem,var(--sar))] z-30 flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/20 bg-background/10 text-primary-foreground backdrop-blur transition-transform duration-300 hover:scale-110 hover:bg-background/20 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        // Swipe left / right for the next / previous photo; pinch-zoom stays native
        onTouchStart={(e) => {
          const t = e.touches[0];
          swipe.current = e.touches.length === 1 && t ? { x: t.clientX, y: t.clientY } : null;
        }}
        onTouchEnd={(e) => {
          const start = swipe.current;
          const t = e.changedTouches[0];
          swipe.current = null;
          if (!start || !t || total < 2) return;
          const dx = t.clientX - start.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - start.y) * 1.5)
            (dx < 0 ? goNext : goPrev)();
        }}
        className={`relative z-10 flex max-h-[88vh] w-full max-w-3xl touch-pan-y touch-pinch-zoom flex-col items-center pb-[var(--sab)] transition-all duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          closing ? "scale-95 opacity-0" : "animate-scale-in scale-100 opacity-100"
        }`}
      >
        <img
          key={index}
          src={item.img}
          alt={item.alt}
          className="animate-fade-in max-h-[72vh] w-auto max-w-full rounded-sm object-contain shadow-[var(--shadow-soft)]"
        />
        <div className="mt-4 flex w-full max-w-xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-amber-500 uppercase">
              {item.tag}
            </p>
            <p className="mt-1 text-xs text-primary-foreground/80">{item.alt}</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-amber-600 px-4 font-display text-xs font-bold tracking-[0.14em] text-white uppercase transition-transform duration-300 hover:-translate-y-0.5"
          >
            Want This Style? <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        {total > 1 && (
          <p className="mt-3 text-xs tracking-[0.12em] text-primary-foreground/60 uppercase">
            {index + 1} / {total}
          </p>
        )}
      </div>
    </div>
  );
}
