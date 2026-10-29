export function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={id}
        className="mt-2 text-[1.35rem] leading-tight font-semibold tracking-wide text-balance uppercase sm:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-3 flex items-center justify-center gap-2 text-muted-foreground">
        <span className="h-px w-8 bg-border" />
        <span className="h-1 w-1 rounded-full bg-amber-700" />
        <span className="h-px w-8 bg-border" />
      </div>
    </div>
  );
}
