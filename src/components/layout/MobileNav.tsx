"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Newspaper } from "lucide-react";

import {
  getToolsByCategory,
  populatedCategories,
  toolCountByCategory,
  toolHref,
} from "@/config/tools";
import { cn } from "@/lib/utils";

/**
 * The mobile counterpart to the desktop mega menu.
 *
 * Hover doesn't exist on touch, so the same two-level structure becomes a set
 * of disclosures: tap a category to expand its tools, tap its name to go to the
 * category page. Only one section is open at a time, which keeps the list
 * short enough to scan without a lot of scrolling.
 */
export function MobileNav({ pathname }: { pathname: string }) {
  const openByDefault = populatedCategories.find((category) =>
    pathname.startsWith(`/${category.slug}`),
  )?.slug;

  const [expanded, setExpanded] = React.useState<string | null>(openByDefault ?? null);

  return (
    <nav aria-label="All tools">
      {/* Guides sit above the categories rather than inside them: they are not
          a category of tool, and on a phone the list below is long enough that
          anything after it goes unseen. */}
      <Link
        href="/guides"
        aria-current={pathname.startsWith("/guides") ? "page" : undefined}
        className={cn(
          "mb-2 flex min-h-11 items-center gap-2.5 rounded-md px-3 text-sm",
          "transition-colors duration-[120ms] hover:bg-surface-hover",
          pathname.startsWith("/guides") ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <BookOpen className="size-4 shrink-0" strokeWidth={1.75} />
        Guides
      </Link>

      <Link
        href="/blog"
        aria-current={pathname.startsWith("/blog") ? "page" : undefined}
        className={cn(
          "mb-2 flex min-h-11 items-center gap-2.5 rounded-md px-3 text-sm",
          "transition-colors duration-[120ms] hover:bg-surface-hover",
          pathname.startsWith("/blog") ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Newspaper className="size-4 shrink-0" strokeWidth={1.75} />
        Blog
      </Link>

      <ul className="space-y-0.5">
        {populatedCategories.map((category) => {
          const Icon = category.icon;
          const isOpen = expanded === category.slug;
          const isActive = pathname.startsWith(`/${category.slug}`);
          const categoryTools = getToolsByCategory(category.slug);
          const panelId = `mobile-nav-${category.slug}`;

          return (
            <li key={category.slug} className={`accent-${category.slug}`}>
              <div className="flex items-center gap-1">
                <Link
                  href={`/${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 flex-1 items-center gap-2.5 rounded-md px-3 text-sm",
                    "transition-colors duration-[120ms] hover:bg-surface-hover",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="text-accent size-4 shrink-0" strokeWidth={1.75} />
                  <span className="min-w-0 flex-1 truncate">{category.label}</span>
                  <span className="font-mono text-xs text-subtle-foreground" data-numeric>
                    {toolCountByCategory[category.slug]}
                  </span>
                </Link>

                {/* Separate control so tapping the name still navigates. */}
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : category.slug)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={`${isOpen ? "Hide" : "Show"} ${category.label} tools`}
                  className={cn(
                    "grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground",
                    "transition-colors duration-[120ms] hover:bg-surface-hover hover:text-foreground",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-[180ms] ease-out-expo",
                      isOpen && "rotate-180",
                    )}
                    strokeWidth={2}
                  />
                </button>
              </div>

              {isOpen ? (
                <ul id={panelId} className="animate-reveal mb-1 ml-3 border-l border-border pl-3">
                  {categoryTools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={toolHref(tool)}
                        className={cn(
                          "flex min-h-10 items-center rounded-md px-3 text-sm text-muted-foreground",
                          "transition-colors duration-[120ms] hover:bg-surface-hover hover:text-foreground",
                        )}
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
