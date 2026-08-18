"use client";

import * as React from "react";
import Link from "next/link";
import { History, X } from "lucide-react";

import { useRecentTools } from "@/lib/recent-tools";
import { toolHref, tools, type Tool } from "@/config/tools";
import { cn } from "@/lib/utils";

/**
 * The tools this browser opened recently, shown above everything else.
 *
 * Renders nothing at all until there is something to show, so a first-time
 * visitor sees the page exactly as it was designed. `useLocalStorage` returns
 * the server snapshot during SSR and the stored one immediately after
 * hydration, so this appears in one pass rather than flashing in.
 */
export function RecentTools() {
  const [slugs, , clear] = useRecentTools();

  const recent = React.useMemo(() => {
    const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));
    return slugs
      .map((slug) => bySlug.get(slug))
      // A slug can outlive its tool if one is renamed or removed; drop it
      // rather than rendering a link to a 404.
      .filter((tool): tool is Tool => Boolean(tool) && tool!.status === "live");
  }, [slugs]);

  if (recent.length === 0) return null;

  return (
    <section className="border-b border-border bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <History className="size-4 text-muted-foreground" strokeWidth={1.75} />
            Pick up where you left off
          </h2>

          <button
            type="button"
            onClick={clear}
            className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3" strokeWidth={2} />
            Clear
          </button>
        </div>

        <ul className="mt-3 flex flex-wrap gap-2">
          {recent.map((tool) => {
            const Icon = tool.icon;
            return (
              <li key={`${tool.category}/${tool.slug}`}>
                <Link
                  href={toolHref(tool)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3.5 text-sm text-muted-foreground",
                    "transition-[color,border-color,transform] duration-[180ms] ease-out-expo",
                    "hover:-translate-y-px hover:border-border-strong hover:text-foreground",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                    `accent-${tool.category}`,
                  )}
                >
                  <Icon className="text-accent size-3.5" strokeWidth={2} />
                  {tool.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-xs text-subtle-foreground">
          Kept in this browser only. Never sent anywhere, and cleared with your
          browser data.
        </p>
      </div>
    </section>
  );
}
