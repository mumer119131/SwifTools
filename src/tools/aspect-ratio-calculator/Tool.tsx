"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  PRESETS,
  completeHeight,
  decimalRatio,
  fitInside,
  formatRatio,
  nearestPreset,
  simplify,
} from "./logic";

export default function AspectRatioCalculatorTool() {
  const [mode, setMode] = React.useState<"ratio" | "resize" | "fit">("ratio");

  const [width, setWidth] = React.useState("1920");
  const [height, setHeight] = React.useState("1080");
  const [newWidth, setNewWidth] = React.useState("1280");
  const [boxWidth, setBoxWidth] = React.useState("1080");
  const [boxHeight, setBoxHeight] = React.useState("1080");

  const w = Number(width);
  const h = Number(height);
  const valid = Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0;

  const ratio = valid ? simplify(w, h) : null;
  const nearest = valid ? nearestPreset(w, h) : null;

  const contain = valid ? fitInside(w, h, Number(boxWidth), Number(boxHeight), "contain") : null;
  const cover = valid ? fitInside(w, h, Number(boxWidth), Number(boxHeight), "cover") : null;

  const round = (value: number) => Math.round(value * 10) / 10;

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
        <TabsList>
          <TabsTrigger value="ratio">Find the ratio</TabsTrigger>
          <TabsTrigger value="resize">Resize</TabsTrigger>
          <TabsTrigger value="fit">Fit inside</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="w">Width</Label>
          <Input
            id="w"
            inputMode="numeric"
            value={width}
            onChange={(event) => setWidth(event.target.value)}
            className="w-28 font-mono"
          />
        </div>
        <span className="pb-2.5 text-muted-foreground">×</span>
        <div className="space-y-1.5">
          <Label htmlFor="h">Height</Label>
          <Input
            id="h"
            inputMode="numeric"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            className="w-28 font-mono"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            title={preset.note}
            onClick={() => {
              // Keep the width and derive a height that matches the preset.
              const current = Number(width) || 1920;
              setHeight(String(Math.round(completeHeight(current, preset.ratio))));
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              ratio && formatRatio(ratio) === preset.label
                ? "border-border-strong text-foreground"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {!valid ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Enter a width and height greater than zero.
        </p>
      ) : mode === "ratio" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Ratio", ratio ? formatRatio(ratio) : "—"],
              ["Decimal", decimalRatio(w, h).toFixed(4)],
              ["Cinema style", `${decimalRatio(w, h).toFixed(2)}:1`],
            ].map(([label, value]) => (
              <div key={label} className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 flex items-center gap-2 font-mono text-lg text-foreground" data-numeric>
                  {value}
                  <CopyButton value={value} iconOnly />
                </dd>
              </div>
            ))}
          </div>

          {nearest && !nearest.exact ? (
            <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <span>
                {formatRatio(ratio!)} is exact but unwieldy. This is very close
                to <span className="text-foreground">{nearest.label}</span> — if
                the size came from a camera or a crop, that is almost certainly
                what was intended.
              </span>
            </p>
          ) : null}
        </>
      ) : mode === "resize" ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nw">New width</Label>
            <Input
              id="nw"
              inputMode="numeric"
              value={newWidth}
              onChange={(event) => setNewWidth(event.target.value)}
              className="w-32 font-mono"
            />
          </div>
          {ratio && Number(newWidth) > 0 ? (
            <div className="surface-card px-5 py-4">
              <div className="text-xs text-muted-foreground">
                Keeping {formatRatio(ratio)}
              </div>
              <div className="mt-1 flex items-center gap-2 font-mono text-2xl text-foreground" data-numeric>
                {Math.round(Number(newWidth))} × {Math.round(completeHeight(Number(newWidth), ratio))}
                <CopyButton
                  value={`${Math.round(Number(newWidth))}x${Math.round(completeHeight(Number(newWidth), ratio))}`}
                  iconOnly
                />
              </div>
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground">
            Enter a width and the height follows. To go the other way, swap the
            two boxes above — the ratio is symmetric.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bw">Box width</Label>
              <Input
                id="bw"
                inputMode="numeric"
                value={boxWidth}
                onChange={(event) => setBoxWidth(event.target.value)}
                className="w-28 font-mono"
              />
            </div>
            <span className="pb-2.5 text-muted-foreground">×</span>
            <div className="space-y-1.5">
              <Label htmlFor="bh">Box height</Label>
              <Input
                id="bh"
                inputMode="numeric"
                value={boxHeight}
                onChange={(event) => setBoxHeight(event.target.value)}
                className="w-28 font-mono"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card p-5">
              <h2 className="text-sm font-medium text-foreground">Contain — show all of it</h2>
              {contain ? (
                <>
                  <p className="mt-2 font-mono text-lg text-foreground" data-numeric>
                    {round(contain.width)} × {round(contain.height)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {contain.letterbox.x > 0.5
                      ? `Bars of ${round(contain.letterbox.x)}px down each side.`
                      : contain.letterbox.y > 0.5
                        ? `Bars of ${round(contain.letterbox.y)}px top and bottom.`
                        : "Fits exactly — no bars."}
                  </p>
                </>
              ) : null}
            </div>

            <div className="surface-card p-5">
              <h2 className="text-sm font-medium text-foreground">Cover — fill the box</h2>
              {cover ? (
                <>
                  <p className="mt-2 font-mono text-lg text-foreground" data-numeric>
                    {round(cover.width)} × {round(cover.height)}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      cover.cropped > 0.3 ? "text-[var(--warning)]" : "text-muted-foreground",
                    )}
                  >
                    {cover.cropped < 0.001
                      ? "Fits exactly — nothing cropped."
                      : `${Math.round(cover.cropped * 100)}% of the image is cropped away.`}
                  </p>
                </>
              ) : null}
            </div>
          </div>

          <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              Contain shows the whole image and may leave bars. Cover fills the
              space and may crop. Confusing the two is the commonest thumbnail
              and video mistake — and neither ever stretches, because stretching
              is always wrong.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
