import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getCategory } from "@/config/categories";
import { toolHref, type Tool } from "@/config/tools";
import { Badge } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  /** Show which category a tool belongs to — off on category pages. */
  showCategory?: boolean;
  className?: string;
}

/**
 * The single card used by the homepage grid, category pages, search results
 * and the related-tools rail. One component, one look, everywhere.
 */
export function ToolCard({ tool, showCategory = true, className }: ToolCardProps) {
  const category = getCategory(tool.category);
  const Icon = tool.icon;
  const isLive = tool.status === "live";

  return (
    <Link
      href={toolHref(tool)}
      aria-label={`${tool.name}${isLive ? "" : " — coming soon"}`}
      className={cn(
        "surface-card surface-card-interactive group relative flex flex-col gap-3 p-5",
        `accent-${tool.category}`,
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
        !isLive && "opacity-75 hover:opacity-100",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="bg-accent-tint grid size-10 shrink-0 place-items-center rounded-md">
          <Icon className="text-accent size-5" strokeWidth={1.75} />
        </span>
        <ArrowUpRight
          className="size-4 shrink-0 text-subtle-foreground opacity-0 transition-opacity duration-[180ms] ease-out-expo group-hover:opacity-100"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>

      <div className="space-y-1.5">
        <h3 className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] text-foreground">
          {tool.name}
          {!isLive ? (
            <Badge className="px-2 py-0 text-[0.625rem] font-normal">Soon</Badge>
          ) : null}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
      </div>

      {showCategory && category ? (
        <span className="mt-auto pt-1 text-xs text-subtle-foreground">{category.label}</span>
      ) : null}
    </Link>
  );
}
