import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { guideHref, type Guide } from "@/config/guides";
import { cn } from "@/lib/utils";

interface GuideCardProps {
  guide: Guide;
  /**
   * The heading level for the card's title.
   *
   * The guides index puts these directly under its h1, so h2 is right there.
   * On the homepage they sit inside a section that already has an h2, so they
   * need to be h3 — passing it in keeps the document outline correct in both
   * places rather than picking one and being wrong in the other.
   */
  as?: "h2" | "h3";
}

/** One guide, as it appears on the guides index and the homepage. */
export function GuideCard({ guide, as: Heading = "h2" }: GuideCardProps) {
  const Icon = guide.icon;

  return (
    <Link
      href={guideHref(guide)}
      className={cn(
        "surface-card surface-card-interactive group flex h-full flex-col gap-3 p-6",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
      )}
    >
      <span className="grid size-10 place-items-center rounded-md border border-border bg-background">
        <Icon className="size-5 text-foreground" strokeWidth={1.75} />
      </span>
      <Heading className="text-[0.9375rem] font-medium text-foreground">{guide.title}</Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
      <span className="mt-auto flex items-center gap-3 pt-2 text-xs text-subtle-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" strokeWidth={1.75} />
          {guide.minutes} min
        </span>
        <ArrowRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
          strokeWidth={1.75}
        />
      </span>
    </Link>
  );
}
