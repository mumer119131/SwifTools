"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { categories } from "@/config/categories";
import { toolHref, tools } from "@/config/tools";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/misc";
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

export function SearchCommandProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

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
      router.push(href);
    },
    [router],
  );

  const value = React.useMemo(() => ({ open, setOpen }), [open]);

  return (
    <SearchCommandContext.Provider value={value}>
      {children}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search tools"
        description="Search every tool by name, description or keyword."
      >
        <CommandInput placeholder="Search tools…" />
        <CommandList>
          <CommandEmpty>
            No tool matches that. Try a file type — &ldquo;pdf&rdquo;, &ldquo;webp&rdquo;,
            &ldquo;json&rdquo;.
          </CommandEmpty>

          {categories.map((category) => {
            const categoryTools = tools.filter((tool) => tool.category === category.slug);
            if (categoryTools.length === 0) return null;

            return (
              <CommandGroup key={category.slug} heading={category.label}>
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <CommandItem
                      key={`${tool.category}/${tool.slug}`}
                      // cmdk matches on this string, so keywords ride along.
                      value={`${tool.name} ${category.label} ${tool.keywords.join(" ")}`}
                      onSelect={() => navigate(toolHref(tool))}
                      className={`accent-${tool.category}`}
                    >
                      <span className="bg-accent-tint grid size-7 shrink-0 place-items-center rounded">
                        <Icon className="text-accent size-4" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{tool.name}</span>
                      {tool.status === "soon" ? (
                        <span className="shrink-0 text-xs text-subtle-foreground">Soon</span>
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </SearchCommandContext.Provider>
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
        Search {tools.length} tools…
      </span>
      <span className="hidden shrink-0 items-center gap-1 sm:flex">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}
