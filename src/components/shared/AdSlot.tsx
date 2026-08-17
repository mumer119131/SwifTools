"use client";

import * as React from "react";

import { adsConfig } from "@/config/ads";
import { cn } from "@/lib/utils";

/**
 * Advertising regions.
 *
 * The sizes are fixed and reserved whether or not an ad fills them, because a
 * slot that collapses to zero and then expands when the ad arrives shifts the
 * page under the reader's cursor. That is a Cumulative Layout Shift penalty
 * and, more to the point, it is infuriating to use.
 */
const placements = {
  "tool-rail": "hidden xl:block w-[300px] min-h-[600px]",
  "between-steps": "w-full min-h-[90px]",
  "below-results": "w-full min-h-[90px]",
} as const;

export type AdPlacement = keyof typeof placements;

/**
 * One AdSense unit.
 *
 * Renders nothing at all when no publisher ID is configured, or when this
 * particular placement has no unit ID — no markup, no script, no third-party
 * request. That is what lets the privacy policy tell the truth by default.
 */
export function AdSlot({ placement, className }: { placement: AdPlacement; className?: string }) {
  const unitId = adsConfig.units[placement];
  const active = adsConfig.enabled && unitId !== "";

  const ref = React.useRef<HTMLModElement>(null);
  const pushed = React.useRef(false);

  React.useEffect(() => {
    if (!active || pushed.current) return;

    /*
     * AdSense fills a unit when it is pushed onto the global queue. Pushing the
     * same element twice throws "All ins elements already have ads", so the
     * ref guards against React's development double-invoke and any re-render.
     */
    try {
      const queue = ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= []);
      queue.push({});
      pushed.current = true;
    } catch {
      // A blocked or failed script must not take the page down with it.
    }
  }, [active]);

  if (!active) return null;

  return (
    <aside
      className={cn(placements[placement], className)}
      // Labelled rather than hidden: AdSense requires ads to be
      // distinguishable from site content, and a screen reader user is
      // entitled to know what the region is before entering it.
      aria-label="Advertisement"
    >
      <span className="mb-1 block text-[10px] uppercase tracking-wide text-subtle-foreground">
        Advertisement
      </span>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={adsConfig.clientId}
        data-ad-slot={unitId}
        data-ad-format={placement === "tool-rail" ? "vertical" : "horizontal"}
        data-full-width-responsive={placement === "tool-rail" ? "false" : "true"}
      />
    </aside>
  );
}

/**
 * Holds a slot's footprint open.
 *
 * With ads off this reserves the space so the layout is identical either way,
 * which means switching ads on cannot reflow anything that was already
 * designed and reviewed against the empty state.
 */
export function AdSlotReservation({ placement }: { placement: AdPlacement }) {
  const unitId = adsConfig.units[placement];

  if (adsConfig.enabled && unitId !== "") return <AdSlot placement={placement} />;

  return (
    <div aria-hidden="true" data-ad-reservation={placement} className={placements[placement]} />
  );
}
