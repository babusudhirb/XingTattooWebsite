import { Accessibility, CreditCard, Rainbow, Toilet, Wifi } from "lucide-react";

/** GBP attributes as chips: accessibility, amenities, crowd and payments. */
const CHIPS = [
  { icon: Accessibility, label: "Wheelchair accessible" },
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Toilet, label: "Gender-neutral restroom" },
  { icon: Rainbow, label: "LGBTQ+ friendly" },
  { icon: CreditCard, label: "Cards & Google Pay" },
];

export function StudioAttributes({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Studio amenities">
      {CHIPS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
        >
          <Icon className="h-3.5 w-3.5 shrink-0 text-foreground" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}
