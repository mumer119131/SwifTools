"use client";

import * as React from "react";
import { Check, Info, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  COMMON_SIZES, RESOLUTIONS, dimensions, distances, resolutionVerdict, sizeForDistance,
  type Resolution,
} from "./logic";

export default function ViewingDistanceCalculatorTool() {
  const [diagonal, setDiagonal] = React.useState("55");
  const [resolution, setResolution] = React.useState<Resolution>("4k");
  const [seating, setSeating] = React.useState("9");
  const [metric, setMetric] = React.useState(false);

  const screen = dimensions(Number(diagonal));
  const advice = screen ? distances(screen, resolution) : null;
  const seatFeet = Number(seating);
  const verdict = advice && seatFeet > 0 ? resolutionVerdict(seatFeet, advice) : null;
  const recommended = seatFeet > 0 ? sizeForDistance(seatFeet, 40) : null;

  const dist = (feet: number) =>
    metric ? `${(feet * 0.3048).toFixed(2)} m` : `${feet.toFixed(1)} ft`;
  const len = (inches: number) =>
    metric ? `${(inches * 2.54).toFixed(1)} cm` : `${inches.toFixed(1)}"`;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="diagonal">Screen size (inches, diagonal)</Label>
          <Input id="diagonal" inputMode="decimal" value={diagonal}
            onChange={(e) => setDiagonal(e.target.value)} className="font-mono"
            aria-invalid={screen === null} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="resolution">Resolution</Label>
          <Select value={resolution} onValueChange={(v) => setResolution(v as Resolution)}>
            <SelectTrigger id="resolution">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(RESOLUTIONS) as Resolution[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {RESOLUTIONS[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seating">Where you sit (feet)</Label>
          <Input id="seating" inputMode="decimal" value={seating}
            onChange={(e) => setSeating(e.target.value)} className="font-mono" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {COMMON_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setDiagonal(String(size))}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              Number(diagonal) === size
                ? "border-border-strong text-foreground"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {size}&quot;
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMetric((v) => !v)}
          className="ml-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {metric ? "Imperial" : "Metric"}
        </button>
      </div>

      {screen && advice ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Screen width", len(screen.widthInches)],
              ["Screen height", len(screen.heightInches)],
              ["Diagonal", `${screen.diagonalInches}"`],
            ].map(([label, value]) => (
              <div key={label} className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 font-mono text-lg text-foreground" data-numeric>{value}</dd>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            A {diagonal}-inch 16:9 screen is only {len(screen.widthInches)} wide —
            screens are sold by diagonal, which is why comparing a television with
            an ultrawide monitor by that number alone is misleading.
          </p>

          <section className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Recommended distances</h2>
            <ul className="divide-y divide-border rounded-md border border-border">
              {[
                ["THX (40° — cinematic)", advice.thxFeet],
                ["SMPTE (30° — comfortable)", advice.smpteFeet],
                [`Pixels resolvable up to (${RESOLUTIONS[resolution].label})`, advice.pixelLimitFeet],
              ].map(([label, feet]) => (
                <li key={label as string} className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-foreground" data-numeric>{dist(feet as number)}</span>
                </li>
              ))}
            </ul>
          </section>

          {verdict ? (
            <p
              className={cn(
                "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
                verdict.worthwhile
                  ? "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] text-foreground"
                  : "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] text-foreground",
              )}
            >
              {verdict.worthwhile ? (
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--success)]" strokeWidth={2} />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={2} />
              )}
              <span>
                At {dist(seatFeet)}, {RESOLUTIONS[resolution].label} is{" "}
                {verdict.worthwhile ? "doing visible work" : "not earning its keep"}.{" "}
                {verdict.detail}
              </span>
            </p>
          ) : null}

          {recommended ? (
            <p className="text-sm text-muted-foreground">
              For a cinematic 40° field of view from {dist(seatFeet)}, the screen
              would need to be about{" "}
              <span className="font-mono text-foreground" data-numeric>
                {Math.round(recommended)} inches
              </span>{" "}
              — which is usually larger than people expect, and is why almost
              everyone buys too small.
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Enter a screen size above zero.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The angle figures are about immersion — how much of your field of view
          the picture fills. The pixel limit is about detail, and answers a
          different question: beyond it, individual pixels stop being resolvable
          and a higher resolution adds nothing you can see. Conflating the two is
          how people conclude 4K is pointless, which only holds if you sit where
          1080p would have been fine anyway.
        </span>
      </p>
    </div>
  );
}
