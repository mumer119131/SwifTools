import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base sm:text-sm",
        "text-foreground placeholder:text-subtle-foreground",
        "transition-colors duration-[180ms] ease-out-expo",
        "hover:border-border-strong",
        "focus-visible:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--ring)]",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "resize-y",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
