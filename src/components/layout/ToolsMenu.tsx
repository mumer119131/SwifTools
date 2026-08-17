"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import type { ToolCategory } from "@/config/categories";
import {
  browsableTools,
  getToolsByCategory,
  populatedCategories,
  toolCountByCategory,
  toolHref,
} from "@/config/tools";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

/**
 * The header's "Tools" mega menu.
 *
 * Two columns rather than a nested flyout: hovering a category on the left
 * swaps the tool list on the right. Nested submenus are fragile to hit with a
 * mouse and awkward to operate with a keyboard, whereas a single panel keeps
 * every tool one pointer-move away and every row in one tab sequence.
 *
 * The active category follows both hover and focus, so keyboard users see the
 * same reveal that pointer users do.
 */
export function ToolsMenu({ pathname }: { pathname: string }) {
  const [activeCategory, setActiveCategory] = React.useState<ToolCategory>(populatedCategories[0].slug);

  // Opening the menu on a category page should start on that category.
  const categoryInPath = populatedCategories.find((category) =>
    pathname.startsWith(`/${category.slug}`),
  )?.slug;

  const [trackedPath, setTrackedPath] = React.useState(pathname);
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    if (categoryInPath) setActiveCategory(categoryInPath);
  }

  const active =
    populatedCategories.find((category) => category.slug === activeCategory) ?? populatedCategories[0];
  const activeTools = getToolsByCategory(active.slug);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(categoryInPath && "bg-surface-hover text-foreground")}
          >
            Tools
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="grid w-[46rem] grid-cols-[13.5rem_minmax(0,1fr)]">
              {/* Left: categories */}
              <div className="border-r border-border p-2">
                <p className="px-3 pb-1.5 pt-2 text-xs font-medium tracking-[0.02em] text-subtle-foreground">
                  Categories
                </p>
                <ul>
                  {populatedCategories.map((category) => {
                    const Icon = category.icon;
                    const isActive = category.slug === active.slug;
                    return (
                      <li key={category.slug} className={`accent-${category.slug}`}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${category.slug}`}
                            onPointerEnter={() => setActiveCategory(category.slug)}
                            onFocus={() => setActiveCategory(category.slug)}
                            aria-current={
                              pathname.startsWith(`/${category.slug}`) ? "page" : undefined
                            }
                            className={cn(
                              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm",
                              "transition-colors duration-[120ms] ease-out-expo",
                              "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ring)]",
                              isActive
                                ? "bg-surface-hover text-foreground"
                                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                            )}
                          >
                            <Icon className="text-accent size-4 shrink-0" strokeWidth={1.75} />
                            <span className="min-w-0 flex-1 truncate">{category.label}</span>
                            <span
                              className="shrink-0 font-mono text-xs text-subtle-foreground"
                              data-numeric
                            >
                              {toolCountByCategory[category.slug]}
                            </span>
                            <ChevronRight
                              className={cn(
                                "size-3.5 shrink-0 text-subtle-foreground transition-opacity duration-[120ms]",
                                isActive ? "opacity-100" : "opacity-0",
                              )}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right: the active category's tools */}
              <div className={cn("flex flex-col p-2", `accent-${active.slug}`)}>
                <div className="flex items-baseline justify-between gap-3 px-3 pb-1.5 pt-2">
                  <p className="text-xs font-medium tracking-[0.02em] text-foreground">
                    {active.label}
                  </p>
                  <p className="text-xs text-subtle-foreground">{active.description}</p>
                </div>

                <ul className="grid grid-cols-2 gap-0.5">
                  {activeTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <li key={tool.slug}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={toolHref(tool)}
                            className={cn(
                              "flex items-start gap-2.5 rounded-md px-3 py-2",
                              "transition-colors duration-[120ms] ease-out-expo hover:bg-surface-hover",
                              "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ring)]",
                            )}
                          >
                            <Icon
                              className="text-accent mt-0.5 size-4 shrink-0"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm text-foreground">
                                {tool.name}
                              </span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">
                                {tool.description}
                              </span>
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-auto border-t border-border px-3 pb-1 pt-2.5">
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/${active.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
                    >
                      View all {activeTools.length} {active.label} tools
                      <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* A direct route to the full searchable directory, for people who
            would rather filter than browse the menu. */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/tools"
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground",
                "transition-colors duration-[180ms] ease-out-expo hover:bg-surface-hover hover:text-foreground",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              )}
            >
              All tools
              <span className="font-mono text-xs text-subtle-foreground" data-numeric>
                {browsableTools.length}
              </span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
