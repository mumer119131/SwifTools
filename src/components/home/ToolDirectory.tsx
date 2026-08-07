"use client";

import * as React from "react";
import { SearchX } from "lucide-react";

import type { ToolCategory } from "@/config/categories";
import { browsableTools, populatedCategories, tools } from "@/config/tools";
import { ToolCard } from "@/components/shared/ToolCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchTools } from "@/lib/search";
import { cn } from "@/lib/utils";

type Filter = ToolCategory | "all";

/**
 * The full, filterable directory at the bottom of the homepage.
 *
 * Filtering happens over the in-memory registry, so it is instant and needs no
 * network round trip. The ⌘K palette is the fast path; this is the browsable
 * one, and it keeps every tool in the server-rendered HTML for crawlers.
 */
export function ToolDirectory() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");

  // Ranked by the same scorer the ⌘K palette uses, so a query behaves
  // identically in both places. Without a query the registry order stands,
  // which groups tools by category the way the page reads.
  const visible = React.useMemo(() => {
    const inCategory = (tool: (typeof tools)[number]) =>
      filter === "all" || tool.category === filter;

    // Browsing shows the browsable set; searching reaches everything, so a
    // query like "lb to kg" still finds its dedicated page.
    if (!query.trim()) return browsableTools.filter(inCategory);

    return searchTools(query, tools)
      .map((result) => result.tool)
      .filter(inCategory);
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <label htmlFor="directory-search" className="sr-only">
          Filter tools
        </label>
        <Input
          id="directory-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter tools by name or keyword…"
          className="max-w-md"
        />

        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All
            <span className="ml-1 text-subtle-foreground" data-numeric>
              {browsableTools.length}
            </span>
          </FilterChip>
          {populatedCategories.map((category) => {
            const count = browsableTools.filter((tool) => tool.category === category.slug).length;
            const Icon = category.icon;
            return (
              <FilterChip
                key={category.slug}
                active={filter === category.slug}
                onClick={() => setFilter(category.slug)}
                className={`accent-${category.slug}`}
              >
                <Icon className="text-accent size-3.5" strokeWidth={1.75} aria-hidden="true" />
                {category.label}
                <span className="ml-0.5 text-subtle-foreground" data-numeric>
                  {count}
                </span>
              </FilterChip>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} tools shown
      </p>

      {visible.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((tool) => (
            <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No tools match that filter"
          description="Try a broader term, or clear the filters to browse everything."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm",
        "transition-[background-color,border-color,color] duration-[180ms] ease-out-expo",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
        active
          ? "border-border-strong bg-surface-hover text-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
