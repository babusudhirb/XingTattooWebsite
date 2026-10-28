import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Link to="/" className={`flex min-h-11 items-center gap-2 ${className}`}>
      {logoFailed ? (
        <span className="font-display text-3xl font-extrabold leading-none tracking-tighter">
          X
        </span>
      ) : (
        <img
          src="/xing-logo.webp"
          alt="Xing Premium Tattoo Studio logo"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
          onError={() => setLogoFailed(true)}
        />
      )}
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-wide">XING</span>
        <span className="block text-xs tracking-[0.06em] whitespace-nowrap text-muted-foreground">
          PREMIUM TATTOO STUDIO
        </span>
      </span>
    </Link>
  );
}
