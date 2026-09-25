/** Hand-drawn style tattoo "flash" line art used as background decoration. */
export type FlashName = "compass" | "dagger" | "heart" | "rose" | "moon" | "sparkle";

const paths: Record<FlashName, React.ReactNode> = {
  compass: (
    <>
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="18" strokeDasharray="1 3" />
      <path d="M32 4 36 28 60 32 36 36 32 60 28 36 4 32 28 28Z" />
      <path d="M32 18 34 30 46 32 34 34 32 46 30 34 18 32 30 30Z" transform="rotate(45 32 32)" />
      <circle cx="32" cy="32" r="2" />
    </>
  ),
  dagger: (
    <>
      <path d="M32 4 36 36 32 42 28 36Z" />
      <path d="M32 8v28" />
      <path d="M18 38c3-3 6-3 8 0h12c2-3 5-3 8 0" />
      <path d="M29 42h6v12h-6z" />
      <path d="M29 46h6M29 50h6" />
      <circle cx="32" cy="58" r="3" />
    </>
  ),
  heart: (
    <>
      {/* Classic flash heart with a name banner across it */}
      <path d="M32 56C14 44 7 34 10 23c3-10 16-12 22-3 6-9 19-7 22 3 3 11-4 21-22 33Z" />
      <path d="M17 24c1-4 5-6 8-5" />
      <path d="M8 32h48l-4 4 4 4H8l4-4Z" />
      <path d="M8 32l-4-2M56 32l4-2" />
    </>
  ),
  rose: (
    <>
      <path d="M32 30c-3 0-4-3-2-5 3-3 8-1 8 4 0 6-8 9-13 5-6-5-3-14 5-15 9-1 15 6 13 14" />
      <path d="M18 30c-2 12 6 20 14 20s16-8 14-20" />
      <path d="M32 50v12" />
      <path d="M32 56c4-4 9-4 12-2-4 3-8 3-12 2Z" />
      <path d="M32 58c-4-3-8-3-11-1 4 2 8 2 11 1Z" />
    </>
  ),
  moon: (
    <>
      <path d="M40 8a24 24 0 1 0 16 40A19 19 0 1 1 40 8Z" />
      <path d="M50 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" />
      <circle cx="56" cy="30" r="1" />
    </>
  ),
  sparkle: <path d="M32 8c2 18 6 22 24 24-18 2-22 6-24 24-2-18-6-22-24-24 18-2 22-6 24-24Z" />,
};

export function TattooFlash({
  name,
  className,
  style,
}: {
  name: FlashName;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
