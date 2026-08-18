"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchTrigger } from "@/components/layout/SearchCommand";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ToolsMenu } from "@/components/layout/ToolsMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [lastPathname, setLastPathname] = React.useState(pathname);

  // A route change always closes the mobile sheet. Adjusting during render
  // rather than in an effect avoids a frame where the new page is shown with
  // the old menu still open over it.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-6 lg:px-8">
        <Logo />

        {/* One entry point instead of five flat links — the mega menu carries
            the full catalogue without crowding the bar. */}
        <div className="hidden items-center gap-1 lg:flex">
          <ToolsMenu pathname={pathname} />
          {/* A flat link rather than a second menu: there are three guides, and
              hiding them behind a dropdown would be hiding them. */}
          <Link
            href="/blog"
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              pathname.startsWith("/blog")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Blog
          </Link>
          <Link
            href="/guides"
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              pathname.startsWith("/guides")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Guides
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger className="hidden md:flex" />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X strokeWidth={1.75} /> : <Menu strokeWidth={1.75} />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="animate-reveal max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-border bg-background lg:hidden"
        >
          <div className="mx-auto max-w-6xl space-y-4 px-5 py-4 sm:px-6">
            <SearchTrigger className="md:hidden" />
            <MobileNav pathname={pathname} />
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
