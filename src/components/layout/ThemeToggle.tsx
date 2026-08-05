"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

/**
 * Three-state segmented control. System is a first-class choice, not a hidden
 * default — and the selection persists via next-themes.
 *
 * Rendering is deferred until mount because the resolved theme is unknown
 * during SSR; showing the wrong state briefly is worse than showing none.
 */
/** Never resubscribes — the store is "have we hydrated yet", which flips once. */
const noopSubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Reads `false` during SSR and `true` on the client, without the extra render
  // pass a mounted-flag effect would cost.
  const mounted = React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className="h-9 w-[7.5rem] rounded-md border border-border bg-surface" aria-hidden="true" />;
  }

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="inline-flex h-9 items-center gap-0.5 rounded-md border border-border bg-surface p-0.5"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
            onClick={() => setTheme(value)}
            className={cn(
              "grid size-8 cursor-pointer place-items-center rounded",
              "transition-[background-color,color] duration-[180ms] ease-out-expo",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              isActive
                ? "bg-surface-hover text-foreground"
                : "text-subtle-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
