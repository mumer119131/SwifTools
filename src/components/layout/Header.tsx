"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { categories } from "@/config/categories";
import { Logo } from "@/components/layout/Logo";
import { SearchTrigger } from "@/components/layout/SearchCommand";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Categories are the primary navigation; the rest live in the ⌘K palette. */
const primaryNav = categories.slice(0, 5);

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

        <nav aria-label="Categories" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((category) => {
              const isActive = pathname.startsWith(`/${category.slug}`);
              return (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-md px-3 text-sm",
                      "transition-colors duration-[180ms] ease-out-expo hover:bg-surface-hover hover:text-foreground",
                      isActive ? "bg-surface-hover text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {category.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

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
          className="animate-reveal border-t border-border bg-background lg:hidden"
        >
          <div className="mx-auto max-w-6xl space-y-4 px-5 py-4 sm:px-6">
            <SearchTrigger className="md:hidden" />
            <nav aria-label="All categories">
              <ul className="grid grid-cols-2 gap-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = pathname.startsWith(`/${category.slug}`);
                  return (
                    <li key={category.slug} className={`accent-${category.slug}`}>
                      <Link
                        href={`/${category.slug}`}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 items-center gap-2.5 rounded-md px-3 text-sm",
                          "transition-colors duration-[120ms] hover:bg-surface-hover",
                          isActive ? "bg-surface-hover text-foreground" : "text-muted-foreground",
                        )}
                      >
                        <Icon className="text-accent size-4" strokeWidth={1.75} />
                        {category.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
