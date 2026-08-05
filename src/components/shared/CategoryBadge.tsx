import Link from "next/link";

import { getCategory, type ToolCategory } from "@/config/categories";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: ToolCategory;
  /** Links through to the category page. Off inside cards that already link. */
  asLink?: boolean;
  className?: string;
}

/**
 * Category accents are the only place colour carries category identity — and
 * the hue is always paired with an icon and the label, never colour alone.
 */
export function CategoryBadge({ category, asLink = true, className }: CategoryBadgeProps) {
  const meta = getCategory(category);
  if (!meta) return null;

  const Icon = meta.icon;
  const content = (
    <>
      <Icon className="text-accent size-3.5" strokeWidth={1.75} aria-hidden="true" />
      <span>{meta.label}</span>
    </>
  );

  const classes = cn(
    `accent-${category}`,
    "border-accent bg-accent-tint text-accent",
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
    asLink && "transition-opacity duration-[120ms] hover:opacity-80",
    className,
  );

  if (!asLink) return <span className={classes}>{content}</span>;

  return (
    <Link href={`/${meta.slug}`} className={classes}>
      {content}
    </Link>
  );
}
