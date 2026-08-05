"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      strokeWidth={2}
      className={cn("size-4 animate-spin text-muted-foreground", className)}
      {...props}
    />
  );
}

interface ProgressBarProps {
  /** 0–100. Pass `undefined` for work whose length is unknown. */
  value?: number;
  label?: string;
  className?: string;
}

/**
 * Unified processing feedback. Announces progress politely so screen-reader
 * users hear the state change without focus being stolen.
 */
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const isIndeterminate = value === undefined;
  const clamped = isIndeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          {!isIndeterminate ? <span data-numeric>{Math.round(clamped)}%</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isIndeterminate ? undefined : Math.round(clamped)}
        aria-label={label ?? "Processing"}
        className="h-1.5 w-full overflow-hidden rounded-full bg-border"
      >
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-[width] duration-[260ms] ease-out-expo",
            isIndeterminate && "w-1/3 animate-[indeterminate_1.2s_ease-in-out_infinite]",
          )}
          style={isIndeterminate ? undefined : { width: `${clamped}%` }}
        />
      </div>
      <style>{`@keyframes indeterminate{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}
