import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The mark is a folded-blade glyph drawn from the current text colour, so it
 * inverts with the theme automatically and carries no hardcoded colour.
 *
 * The wordmark reads from `siteConfig.name` — renaming the app renames this.
 */
export function Logo({ className, asLink = true }: { className?: string; asLink?: boolean }) {
  const content = (
    <>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="size-[1.375rem] shrink-0 text-foreground"
      >
        <path
          d="M4 19.5 19.5 4v6.4a4 4 0 0 1-1.17 2.83l-5.1 5.1A4 4 0 0 1 10.4 19.5H4Z"
          fill="currentColor"
        />
        <path
          d="M4 19.5 19.5 4"
          stroke="var(--background)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-foreground">
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
