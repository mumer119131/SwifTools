"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        // py-2.5 grows the hit area to 44px without changing the visual track.
        "relative flex w-full cursor-pointer touch-none select-none items-center py-2.5",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-border">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block size-4 rounded-full border-2 border-primary bg-background",
          "transition-transform duration-[120ms] ease-out-expo hover:scale-110 active:scale-95",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
          "disabled:pointer-events-none disabled:opacity-45",
        )}
      />
    </SliderPrimitive.Root>
  );
}

export { Slider };
