/**
 * The one CTA button system. Every booking, WhatsApp, call and directions button on
 * the site is one of the four components in this folder, so labels, links and events
 * never drift. Pages may restyle colours through `className` (merged with tailwind-merge);
 * size, focus ring, pressed state and hover-only-on-hover come from BASE.
 */
export const BASE =
  "inline-flex min-h-12 md:min-h-13 items-center justify-center gap-2 rounded-full px-6 font-display text-xs font-bold tracking-[0.14em] whitespace-nowrap uppercase transition-[opacity,background-color,color,transform] duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";

export const VARIANTS = {
  /** Solid — the one primary action. */
  primary: "bg-primary text-primary-foreground [@media(hover:hover)]:hover:opacity-90",
  /** Outline — every secondary action. */
  secondary:
    "border border-current bg-transparent text-foreground [@media(hover:hover)]:hover:bg-foreground/5",
  /** Size and states only; the caller supplies colours. */
  plain: "",
} as const;

export type CtaVariant = keyof typeof VARIANTS;

/** Icon-only buttons (the mobile sticky bar): 48px round. */
export const ICON_ONLY =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 motion-reduce:active:scale-100";
