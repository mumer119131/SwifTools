import Link from "next/link";

import { siteConfig } from "@/config/site";
import { LogoMark } from "@/components/layout/LogoMark";
import { cn } from "@/lib/utils";

/**
 * Mark plus wordmark. Both read from the theme and from `siteConfig.name`, so
 * renaming the app renames this and switching theme re-colours it.
 */
export function Logo({ className, asLink = true }: { className?: string; asLink?: boolean }) {
  const content = (
    <>
      <LogoMark className="size-[1.375rem] shrink-0 text-foreground" />
      <span className="font-display text-[1.0625rem] text-foreground">
        {siteConfig.name}
      </span>
    </>
  );

  const classes = cn(
    "flex items-center gap-2 rounded-sm",
    asLink && "transition-opacity duration-[120ms] hover:opacity-75",
    className,
  );

  if (!asLink) return <span className={classes}>{content}</span>;

  return (
    <Link href="/" className={classes} aria-label={`${siteConfig.name} home`}>
      {content}
    </Link>
  );
}
