import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        // 16px base prevents iOS from auto-zooming when the field is focused.
        "flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-base sm:text-sm",
        "text-foreground placeholder:text-subtle-foreground",
        "transition-colors duration-[180ms] ease-out-expo",
        "hover:border-border-strong",
        "focus-visible:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--ring)]",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
