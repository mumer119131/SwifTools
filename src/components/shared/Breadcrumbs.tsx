import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Visual breadcrumbs. The matching `BreadcrumbList` JSON-LD is emitted
 * separately by `@/lib/seo` so structured data and the UI cannot drift apart.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex min-w-0 items-center gap-1">
              {index > 0 ? (
                <ChevronRight
                  className="size-3.5 shrink-0 text-subtle-foreground"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="truncate text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="truncate rounded-sm transition-colors duration-[120ms] hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
