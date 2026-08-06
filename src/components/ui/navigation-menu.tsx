"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Navigation menu built on Radix, styled to this project's tokens.
 *
 * Radix handles what makes a hover menu actually usable rather than merely
 * pretty: an open delay so passing the cursor over the trigger doesn't fire it,
 * a "safe triangle" so diagonal travel toward the panel doesn't close it, and
 * full keyboard operation — the trigger opens on Enter or Space and arrow keys
 * move through the content. Hover is an accelerator here, never the only way in.
 */
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean }) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      // Long enough not to trigger on a cursor passing through, short enough
      // to feel immediate when it was deliberate.
      delayDuration={120}
      skipDelayDuration={300}
      className={cn("relative flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
      {viewport ? <NavigationMenuViewport /> : null}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  );
}

const NavigationMenuItem = NavigationMenuPrimitive.Item;

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        "group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground",
        "transition-colors duration-[180ms] ease-out-expo",
        "hover:bg-surface-hover hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
        "data-[state=open]:bg-surface-hover data-[state=open]:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="size-3.5 shrink-0 transition-transform duration-[180ms] ease-out-expo group-data-[state=open]:rotate-180"
        strokeWidth={2}
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "left-0 top-0 w-full p-2 md:absolute md:w-auto",
        // Direction-aware: the panel slides in from the side the previous item
        // was on, so switching between triggers reads as lateral movement.
        "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in",
        "data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out",
        "data-[motion=from-end]:slide-in-from-right-8 data-[motion=from-start]:slide-in-from-left-8",
        "data-[motion=to-end]:slide-out-to-right-8 data-[motion=to-start]:slide-out-to-left-8",
        "duration-[180ms] ease-out-expo",
        className,
      )}
      {...props}
    />
  );
}

const NavigationMenuLink = NavigationMenuPrimitive.Link;

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className={cn("absolute left-0 top-full isolate z-50 flex justify-center")}>
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "relative mt-2 w-full origin-top overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-overlay",
          // Radix measures the active content and exposes it as a CSS variable,
          // which is what lets the panel resize smoothly between sections.
          "h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)]",
          "transition-[width,height] duration-[260ms] ease-out-expo",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
