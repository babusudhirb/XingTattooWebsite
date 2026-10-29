import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

import type { Crumb } from "@/lib/blog";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {items.map((c, i) => (
          <Fragment key={c.label}>
            {i > 0 && (
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
            )}
            <li>
              {c.href ? (
                <a
                  href={c.href}
                  className="inline-flex min-h-11 min-w-11 items-center hover:text-foreground hover:underline"
                >
                  {c.label}
                </a>
              ) : (
                <span aria-current="page" className="text-foreground/80">
                  {c.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
