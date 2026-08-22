"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { G, GRAVITIES, calculate, optimalAngle } from "./logic";

export default function ProjectileMotionCalculatorTool() {
  const [speed, setSpeed] = React.useState("20");
  const [angle, setAngle] = React.useState(45);
  const [height, setHeight] = React.useState("0");
  const [gravity, setGravity] = React.useState(G);

  const result = calculate({
    speed: Number(speed),
    angle,
    height: Number(height),
    gravity,
  });

  const best = Number(speed) > 0 ? optimalAngle(Number(speed), Number(height), gravity) : 45;
  const round = (n: number, places = 2) => Number(n.toFixed(places));

  // The path, scaled into an SVG viewBox.
  const chart = React.useMemo(() => {
    if (!result) return null;
    const maxX = Math.max(...result.path.map((p) => p.x), 1);
    const maxY = Math.max(...result.path.map((p) => p.y), 1);
    const points = result.path
      .map((p) => `${(p.x / maxX) * 100},${100 - (p.y / maxY) * 92}`)
      .join(" ");
    return { points, maxX, maxY };
  }, [result]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="speed">Launch speed (m/s)</Label>
          <Input id="speed" inputMode="decimal" value={speed}
            onChange={(e) => setSpeed(e.target.value)} className="font-mono"
            aria-invalid={result === null} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="height">Launch height (m)</Label>
          <Input id="height" inputMode="decimal" value={height}
            onChange={(e) => setHeight(e.target.value)} className="font-mono" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="angle">Angle — {angle}°</Label>
          <Slider id="angle" min={0} max={90} step={1} value={[angle]}
            onValueChange={([v]) => setAngle(v)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {GRAVITIES.map((entry) => (
          <button
            key={entry.name}
            type="button"
            onClick={() => setGravity(entry.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              Math.abs(gravity - entry.value) < 0.001
                ? "border-border-strong text-foreground"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {entry.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAngle(Math.round(best))}
          className="ml-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Set to the best angle ({round(best, 1)}°)
        </button>
      </div>

      {result && chart ? (
        <>
          <figure className="surface-card overflow-hidden p-5">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-48 w-full">
              <line x1="0" y1="100" x2="100" y2="100" stroke="var(--border)" strokeWidth="0.5" />
              <polyline
                points={chart.points}
                fill="none"
                stroke="var(--accent-science, var(--foreground))"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <figcaption className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
              <span data-numeric>0 m</span>
              <span data-numeric>peak {round(result.maxHeight)} m</span>
              <span data-numeric>{round(chart.maxX)} m</span>
            </figcaption>
          </figure>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Range", `${round(result.range)} m`, true],
              ["Max height", `${round(result.maxHeight)} m`, true],
              ["Time in the air", `${round(result.flightTime)} s`, false],
              ["Time to apex", `${round(result.timeToApex)} s`, false],
              ["Horizontal speed", `${round(result.vx)} m/s`, false],
              ["Vertical speed", `${round(result.vy)} m/s`, false],
              ["Impact speed", `${round(result.impactSpeed)} m/s`, false],
              ["Impact angle", `${round(result.impactAngle, 1)}°`, false],
            ].map(([label, value, highlight]) => (
              <div key={label as string} className={cn("surface-card px-4 py-3", highlight && "border-border-strong")}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className={cn("mt-0.5 font-mono text-lg", highlight ? "text-[var(--accent-science,var(--foreground))]" : "text-foreground")} data-numeric>
                  {value}
                </dd>
              </div>
            ))}
          </div>

          {Number(height) > 0 ? (
            <p className="text-sm text-muted-foreground">
              From {height} m up, the best angle for range is{" "}
              <span className="font-mono text-foreground">{round(best, 1)}°</span> rather than 45.
              The extra fall time rewards a flatter, faster horizontal
              component — which is why a shot putter releases below 45 degrees.
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Enter a launch speed above zero and a height of zero or more.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
        <span>
          Air resistance is ignored, and that is not a small omission. In a
          vacuum the path is a perfect parabola and 45 degrees always maximises
          range from ground level; in air a real projectile falls well short and
          the optimal angle drops — for a golf ball or a bullet, considerably.
          These are the textbook formulas and they describe a vacuum.
        </span>
      </p>
    </div>
  );
}
