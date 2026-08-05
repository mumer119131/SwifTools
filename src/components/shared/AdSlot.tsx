import { cn } from "@/lib/utils";

/**
 * Reserved advertising region (§10 of the brief).
 *
 * Ads are deliberately NOT implemented. These containers exist so slots can be
 * dropped in later without touching layout: the space is already accounted for
 * in the grid and the surrounding rhythm. They render nothing, make no network
 * calls, and are removed from the accessibility tree.
 *
 * To activate later: render the ad unit as this component's child. Nothing
 * around it needs to change.
 */
const placements = {
  "tool-rail": "hidden xl:block w-[300px] min-h-[600px]",
  "between-steps": "w-full min-h-[90px]",
  "below-results": "w-full min-h-[90px]",
} as const;

export type AdPlacement = keyof typeof placements;

export function AdSlot({
  placement,
  className,
  children,
}: {
  placement: AdPlacement;
  className?: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;

  return (
    <div
      aria-hidden="true"
      data-ad-slot={placement}
      className={cn(placements[placement], className)}
    >
      {children}
    </div>
  );
}

/**
 * Layout-only spacer that holds a slot's footprint open. Used where collapsing
 * to zero height would change the page rhythm once ads are switched on.
 */
export function AdSlotReservation({ placement }: { placement: AdPlacement }) {
  return <div aria-hidden="true" data-ad-reservation={placement} className={placements[placement]} />;
}
