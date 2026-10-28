import type { ReactNode } from "react";

import type { QuickAnswer as QuickAnswerData } from "@/data/page-copy";

/**
 * A question-led H2 with a direct, snippet-ready first paragraph (#quick-answer,
 * read by `speakable`) and short follow-up paragraphs. `children` is an optional CTA.
 */
export function QuickAnswer({
  data,
  children,
  className = "mx-auto max-w-3xl px-5 py-12 sm:py-14",
}: {
  data: QuickAnswerData;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby="quick-answer-title" className={className}>
      <h2
        id="quick-answer-title"
        className="font-display text-[1.35rem] leading-tight font-semibold tracking-wide text-balance sm:text-3xl"
      >
        {data.question}
      </h2>
      <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
        {data.paragraphs.map((p, i) => (
          <p key={i} id={i === 0 ? "quick-answer" : undefined} className={i === 0 ? "text-foreground" : ""}>
            {p}
          </p>
        ))}
      </div>
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}
