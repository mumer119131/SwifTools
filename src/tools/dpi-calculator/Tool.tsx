"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DPI_PRESETS, PAPER_SIZES, UNIT_LABELS, assess, effectiveDpi, pixelsNeeded, printSize,
  type Unit,
} from "./logic";

type Mode = "toSize" | "toPixels" | "check";

export default function DpiCalculatorTool() {
  const [mode, setMode] = React.useState<Mode>("toSize");
  const [unit, setUnit] = React.useState<Unit>("mm");
  const [dpi, setDpi] = React.useState("300");
  const [pixelWidth, setPixelWidth] = React.useState("3000");
  const [pixelHeight, setPixelHeight] = React.useState("2000");
  const [physWidth, setPhysWidth] = React.useState("210");
  const [physHeight, setPhysHeight] = React.useState("297");

  const dpiValue = Number(dpi);
  const size = printSize(Number(pixelWidth), Number(pixelHeight), dpiValue, unit);
  const needed = pixelsNeeded(Number(physWidth), Number(physHeight), unit, dpiValue);
  const effective = effectiveDpi(
    Number(pixelWidth), Number(pixelHeight), Number(physWidth), Number(physHeight), unit,
  );

  const verdict = mode === "check" && effective ? assess(effective.lowest) : null;
  const round = (n: number) => Math.round(n * 10) / 10;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList>
            <TabsTrigger value="toSize">How big will it print</TabsTrigger>
            <TabsTrigger value="toPixels">How many pixels do I need</TabsTrigger>
            <TabsTrigger value="check">Is this good enough</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(UNIT_LABELS) as Unit[]).map((key) => (
              <SelectItem key={key} value={key}>
                {UNIT_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(mode === "toSize" || mode === "check") ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Image width (px)</Label>
              <Input id="pw" inputMode="numeric" value={pixelWidth}
                onChange={(e) => setPixelWidth(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ph">Image height (px)</Label>
              <Input id="ph" inputMode="numeric" value={pixelHeight}
                onChange={(e) => setPixelHeight(e.target.value)} className="font-mono" />
            </div>
          </>
        ) : null}

        {(mode === "toPixels" || mode === "check") ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="fw">Print width ({unit})</Label>
              <Input id="fw" inputMode="decimal" value={physWidth}
                onChange={(e) => setPhysWidth(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fh">Print height ({unit})</Label>
              <Input id="fh" inputMode="decimal" value={physHeight}
                onChange={(e) => setPhysHeight(e.target.value)} className="font-mono" />
            </div>
          </>
        ) : null}

        {mode !== "check" ? (
          <div className="space-y-1.5">
            <Label htmlFor="dpi">DPI</Label>
            <Input id="dpi" inputMode="numeric" value={dpi}
              onChange={(e) => setDpi(e.target.value)} className="font-mono" />
          </div>
        ) : null}
      </div>

      {mode !== "check" ? (
        <div className="flex flex-wrap gap-2">
          {DPI_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setDpi(String(preset.value))}
              title={preset.note}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                dpiValue === preset.value
                  ? "border-border-strong text-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {preset.label} DPI
            </button>
          ))}
        </div>
      ) : null}

      {mode === "toSize" && size ? (
        <div className="surface-card px-6 py-5">
          <div className="text-xs text-muted-foreground">At {dpi} DPI it prints</div>
          <div className="mt-1 font-mono text-3xl text-foreground" data-numeric>
            {round(size.width)} × {round(size.height)} {unit}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {round(size.widthInches)} × {round(size.heightInches)} inches
          </p>
        </div>
      ) : null}

      {mode === "toPixels" && needed ? (
        <>
          <div className="surface-card px-6 py-5">
            <div className="text-xs text-muted-foreground">
              To print {physWidth} × {physHeight} {unit} at {dpi} DPI you need
            </div>
            <div className="mt-1 font-mono text-3xl text-foreground" data-numeric>
              {needed.width.toLocaleString()} × {needed.height.toLocaleString()} px
            </div>
            <p className="mt-1 text-sm text-muted-foreground" data-numeric>
              {needed.megapixels} megapixels
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PAPER_SIZES.map((paper) => (
              <button
                key={paper.label}
                type="button"
                onClick={() => {
                  setUnit("mm");
                  setPhysWidth(String(paper.width));
                  setPhysHeight(String(paper.height));
                }}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                {paper.label}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {mode === "check" && effective && verdict ? (
        <>
          <div className="surface-card px-6 py-5">
            <div className="text-xs text-muted-foreground">
              {pixelWidth} × {pixelHeight} px at {physWidth} × {physHeight} {unit} is
            </div>
            <div
              className={cn(
                "mt-1 font-mono text-3xl",
                verdict.tone === "good" ? "text-[var(--success)]"
                  : verdict.tone === "acceptable" ? "text-[var(--warning)]" : "text-destructive",
              )}
              data-numeric
            >
              {effective.lowest} DPI
            </div>
            <p className="mt-1 text-sm text-foreground">{verdict.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{verdict.detail}</p>
          </div>
          {effective.horizontal !== effective.vertical ? (
            <p className="text-sm text-muted-foreground">
              The two axes differ — {effective.horizontal} across and{" "}
              {effective.vertical} down — which means the aspect ratio of the
              image does not match the print size. The lower figure is what
              limits quality.
            </p>
          ) : null}
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          DPI is not a property an image carries in any meaningful sense — it is
          the ratio you choose when deciding how large to print. A &ldquo;300 DPI
          image&rdquo; is only 300 DPI at one particular size, and changing the
          DPI field in an editor without resampling changes nothing about the
          pixels at all.
        </span>
      </p>
    </div>
  );
}
