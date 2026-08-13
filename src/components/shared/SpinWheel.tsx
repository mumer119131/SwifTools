"use client";

import * as React from "react";

import { secureInt } from "@/lib/random";
import { cn } from "@/lib/utils";

/** Distinct, readable segment colours that hold up in both themes. */
const SEGMENT_COLORS = [
  "#e05a4a", "#e0913f", "#d9b93c", "#7fae43", "#3fa88a",
  "#3f8fc4", "#5f6fd0", "#8a5fc4", "#c45f9e", "#c4655f",
  "#4a9e7f", "#9e7f4a",
];

interface SpinWheelProps {
  entries: string[];
  onResult: (entry: string, index: number) => void;
  /** Removes the winner from the wheel — for prize draws and elimination. */
  removeOnWin?: boolean;
  onRemove?: (index: number) => void;
}

/**
 * A spinning wheel drawn as SVG.
 *
 * The winner is chosen first, cryptographically, and the rotation is then
 * computed to land on it. Spinning by a random angle and reading off whatever
 * it hits sounds more honest but is not — floating-point rounding at the
 * segment boundaries makes it very slightly unfair, and the animation would
 * decide the outcome.
 */
export function SpinWheel({ entries, onResult, removeOnWin, onRemove }: SpinWheelProps) {
  const [rotation, setRotation] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);

  const segmentAngle = entries.length > 0 ? 360 / entries.length : 360;

  function spin() {
    if (spinning || entries.length === 0) return;

    const winner = secureInt(entries.length);
    setSpinning(true);

    /*
     * The pointer sits at the top (−90°). To bring the winner's centre there,
     * rotate by whatever puts it under the pointer, plus several full turns so
     * the spin reads as a spin rather than a jump.
     */
    const target = 360 - (winner * segmentAngle + segmentAngle / 2);
    const turns = 5 + secureInt(3);
    const next = rotation + turns * 360 + ((target - (rotation % 360)) + 360) % 360;

    setRotation(next);

    window.setTimeout(() => {
      setSpinning(false);
      onResult(entries[winner], winner);
      if (removeOnWin) onRemove?.(winner);
    }, 3600);
  }

  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
        Add at least two entries to spin.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* The pointer, fixed at the top. */}
        <div
          className="absolute left-1/2 top-0 z-10 size-0 -translate-x-1/2 -translate-y-1"
          style={{
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "22px solid var(--foreground)",
          }}
          aria-hidden="true"
        />

        <svg
          viewBox="-105 -105 210 210"
          className="size-72 sm:size-96"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 3.6s cubic-bezier(0.15, 0.85, 0.2, 1)" : "none",
          }}
          role="img"
          aria-label={`Wheel with ${entries.length} entries`}
        >
          {entries.map((entry, index) => {
            const start = (index * segmentAngle - 90) * (Math.PI / 180);
            const end = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
            const radius = 100;

            const x1 = Math.cos(start) * radius;
            const y1 = Math.sin(start) * radius;
            const x2 = Math.cos(end) * radius;
            const y2 = Math.sin(end) * radius;

            // An arc over 180° needs the large-arc flag, or it draws the wrong way.
            const largeArc = segmentAngle > 180 ? 1 : 0;

            const midAngle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
            const labelRadius = radius * 0.62;

            return (
              <g key={index}>
                <path
                  d={
                    entries.length === 1
                      ? `M 0 0 m -${radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`
                      : `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
                  }
                  fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                  stroke="var(--background)"
                  strokeWidth={1}
                />
                <text
                  x={Math.cos(midAngle) * labelRadius}
                  y={Math.sin(midAngle) * labelRadius}
                  fill="#ffffff"
                  fontSize={entries.length > 14 ? 5 : entries.length > 8 ? 7 : 9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${(index + 0.5) * segmentAngle} ${Math.cos(midAngle) * labelRadius} ${Math.sin(midAngle) * labelRadius})`}
                  style={{ pointerEvents: "none", fontWeight: 500 }}
                >
                  {entry.length > 18 ? `${entry.slice(0, 17)}…` : entry}
                </text>
              </g>
            );
          })}
          <circle r={12} fill="var(--surface)" stroke="var(--border-strong)" strokeWidth={2} />
        </svg>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className={cn(
          "inline-flex h-12 cursor-pointer items-center rounded-full px-8 text-base font-medium",
          "bg-foreground text-background transition-opacity duration-[180ms] ease-out-expo",
          "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
        )}
      >
        {spinning ? "Spinning…" : "Spin"}
      </button>
    </div>
  );
}
