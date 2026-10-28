import { Link } from "@tanstack/react-router";

import { LOGO_HEIGHT, LOGO_SRC, LOGO_WIDTH } from "@/data/business";

/** The studio logo, linking to the home page. `imgClassName` sets its height. */
export function Logo({
  className = "",
  imgClassName = "h-12 w-auto",
}: {
  className?: string;
  imgClassName?: string;
}) {
  return (
    <Link to="/" className={`flex min-h-11 items-center ${className}`}>
      <img
        src={LOGO_SRC}
        alt="Xing Premium Tattoo Studio — home"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={imgClassName}
      />
    </Link>
  );
}
