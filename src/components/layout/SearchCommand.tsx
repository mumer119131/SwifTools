"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { categories } from "@/config/categories";
import {
  browsableTools,
  populatedCategories,
  popularTools,
  toolHref,
  tools,
  type Tool,
} from "@/config/tools";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/misc";
import { searchTools, type SearchResult } from "@/lib/search";
import { cn } from "@/lib/utils";

interface SearchCommandContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchCommandContext = React.createContext<SearchCommandContextValue | null>(null);

/** Lets any component (header button, hero search bar) open the palette. */
export function useSearchCommand() {
  const context = React.useContext(SearchCommandContext);
  if (!context) throw new Error("useSearchCommand must be used inside <SearchCommandProvider>");
  return context;
}

/**
 * The value cmdk keys selection off.
 *
 * Defined once because two places need it — the rows themselves and the
 * calculation of which row should be selected after a query changes. If those
 * two ever disagreed, selection would silently stop working and the list would
 * quietly go back to scrolling to the wrong place.
 */
function rowValue(tool: Tool, valuePrefix?: string): string {
  return `${valuePrefix ? `${valuePrefix}:` : ""}${tool.category}/${tool.slug}`;
}

export function SearchCommandProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isPaletteChord = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      // "/" is a convention on content sites, but must not hijack typing.
      const isSlashShortcut =
        event.key === "/" &&
        !(event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)));

      if (isPaletteChord || isSlashShortcut) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = React.useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  const results = React.useMemo(() => searchTools(query, tools), [query]);
  const searching = query.trim().length > 0;

  /*
   * Keep the result list pinned to the top as the query changes.
   *
   * Two things scroll it away, and both had to be fixed. The list is the whole
   * catalogue when nothing is typed, so scrolling down to browse and then
   * typing leaves the container's scrollTop where it was. And cmdk scrolls its
   * *selected* item into view — so a selection left over from the previous set
   * of results drags the viewport down to wherever that item now sits.
   *
   * Driving the selection to the first row fixes the second, and cmdk then
   * scrolls the top item into view of its own accord. The explicit scroll reset
   * covers the first, and the case where the list is empty and there is nothing
   * for cmdk to select at all.
   */
  const listRef = React.useRef<HTMLDivElement>(null);

  const firstRow = searching ? results[0]?.tool : popularTools[0];
  const firstValue = firstRow ? rowValue(firstRow, searching ? undefined : "popular") : "";

  /*
   * The selection is remembered against the query it belongs to, and derived
   * during render rather than reset from an effect.
   *
   * Pinning `value` to the first row unconditionally would fix the scroll and
   * break the arrow keys — every re-render would snap the highlight back to the
   * top. Storing which query a selection came from means arrowing works
   * normally, and the moment the query changes the stored selection stops
   * matching and the first row takes over.
   */
  const [selection, setSelection] = React.useState({ query: "", value: "" });
  const selected = selection.query === query ? selection.value : firstValue;

  React.useEffect(() => {
    // After paint, so it lands after cmdk has done its own scroll-into-view
    // rather than being immediately undone by it.
    const frame = requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [query, open]);

  const value = React.useMemo(() => ({ open, setOpen }), [open]);

  return (
    <SearchCommandContext.Provider value={value}>
      {children}

      <CommandDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
        title="Search tools"
        description="Search every tool by name, description or keyword."
        // Filtering and ranking are ours — cmdk's fuzzy matcher is far too
        // permissive for a catalogue this size. See src/lib/search.ts.
        shouldFilter={false}
        // Controlled, so a selection from the previous query cannot survive
        // into the next one and drag the list down with it.
        value={selected}
        onValueChange={(next) => setSelection({ query, value: next })}
      >
        <CommandInput
          placeholder="Search tools…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList ref={listRef}>
          <CommandEmpty>
            No tool matches that. Try a file type — &ldquo;pdf&rdquo;, &ldquo;webp&rdquo;,
            &ldquo;json&rdquo;.
          </CommandEmpty>

          {searching ? (
            // One ranked list, not per-category groups: grouping by category
            // forced results into registry order, which is what put Merge PDF
            // above BMI Calculator regardless of score.
            results.length > 0 ? (
              <CommandGroup
                heading={`${results.length} ${results.length === 1 ? "result" : "results"}`}
              >
                {results.map((result) => (
                  <ToolRow
                    key={`${result.tool.category}/${result.tool.slug}`}
                    result={result}
                    onSelect={navigate}
                  />
                ))}
              </CommandGroup>
            ) : null
          ) : (
            <>
              <CommandGroup heading="Popular">
                {popularTools.slice(0, 6).map((tool) => (
                  <ToolRow
                    key={`popular-${tool.slug}`}
                    result={{ tool, score: 0, reason: null }}
                    onSelect={navigate}
                    // These tools also appear in their category group below;
                    // cmdk keys selection off `value`, so it must stay unique.
                    valuePrefix="popular"
                  />
                ))}
              </CommandGroup>

              {populatedCategories.map((category) => {
                const categoryTools = browsableTools.filter((tool) => tool.category === category.slug);
                if (categoryTools.length === 0) return null;

                return (
                  <CommandGroup key={category.slug} heading={category.label}>
                    {categoryTools.map((tool) => (
                      <ToolRow
                        key={`${tool.category}/${tool.slug}`}
                        result={{ tool, score: 0, reason: null }}
                        onSelect={navigate}
                      />
                    ))}
                  </CommandGroup>
                );
              })}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </SearchCommandContext.Provider>
  );
}

function ToolRow({
  result,
  onSelect,
  valuePrefix,
}: {
  result: SearchResult;
  onSelect: (href: string) => void;
  valuePrefix?: string;
}) {
  const { tool, reason } = result;
  const Icon = tool.icon;
  const categoryLabel = categories.find((entry) => entry.slug === tool.category)?.label;

  return (
    <CommandItem
      // Unique per row. Ranking is ours, so this only has to identify it.
      value={rowValue(tool, valuePrefix)}
      onSelect={() => onSelect(toolHref(tool))}
      className={cn("accent-" + tool.category)}
    >
      <span className="bg-accent-tint grid size-7 shrink-0 place-items-center rounded">
        <Icon className="text-accent size-4" strokeWidth={1.75} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate">{tool.name}</span>
        {/* When the match came from a keyword rather than the name, say so —
            otherwise a result looks arbitrary. */}
        {reason ? (
          <span className="block truncate text-xs text-subtle-foreground">{reason}</span>
        ) : null}
      </span>

      <span className="shrink-0 text-xs text-subtle-foreground">{categoryLabel}</span>
      {tool.status === "soon" ? (
        <span className="shrink-0 text-xs text-subtle-foreground">Soon</span>
      ) : null}
    </CommandItem>
  );
}

/**
 * The header's search affordance. Looks like an input, behaves like a button —
 * the real input lives inside the palette.
 */
export function SearchTrigger({
  className,
  variant = "compact",
}: {
  className?: string;
  variant?: "compact" | "hero";
}) {
  const { setOpen } = useSearchCommand();
  const isHero = variant === "hero";

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Search tools"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-md border border-border bg-surface text-left",
        "transition-[border-color,background-color] duration-[180ms] ease-out-expo",
        "hover:border-border-strong hover:bg-surface-hover",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
        isHero ? "h-13 w-full px-4 sm:h-14 sm:px-5" : "h-9 w-full px-3 sm:w-64",
        className,
      )}
    >
      <Search
        className={cn("shrink-0 text-subtle-foreground", isHero ? "size-5" : "size-4")}
        strokeWidth={1.75}
      />
      <span
        className={cn(
          "flex-1 truncate text-subtle-foreground",
          isHero ? "text-base sm:text-lg" : "text-sm",
        )}
      >
        Search {browsableTools.length} tools…
      </span>
      <span className="hidden shrink-0 items-center gap-1 sm:flex">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}
