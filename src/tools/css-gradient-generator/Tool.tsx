"use client";

import * as React from "react";
import { Info, Plus, Shuffle, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { secureRange } from "@/lib/random";
import { PRESETS, toCss, toTailwind, type Gradient, type GradientType, type Stop } from "./logic";

export default function CssGradientTool() {
  const [gradient, setGradient] = React.useState<Gradient>({
    type: "linear",
    angle: 135,
    stops: [
      { id: "a", color: "#4f46e5", position: 0 },
      { id: "b", color: "#db2777", position: 100 },
    ],
    centerX: 50,
    centerY: 50,
    shape: "circle",
    repeating: false,
  });

  const css = toCss(gradient);

  function patch(next: Partial<Gradient>) {
    setGradient((current) => ({ ...current, ...next }));
  }

  function updateStop(id: string, next: Partial<Stop>) {
    patch({ stops: gradient.stops.map((stop) => (stop.id === id ? { ...stop, ...next } : stop)) });
  }

  return (
    <div className="space-y-5">
      <div
        className="h-64 rounded-lg border border-border shadow-card sm:h-80"
        style={{ backgroundImage: css }}
        role="img"
        aria-label="Gradient preview"
      />

      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Type</span>
          <Tabs value={gradient.type} onValueChange={(value) => patch({ type: value as GradientType })}>
            <TabsList>
              <TabsTrigger value="linear">Linear</TabsTrigger>
              <TabsTrigger value="radial">Radial</TabsTrigger>
              <TabsTrigger value="conic">Conic</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {gradient.type !== "radial" ? (
          <div className="min-w-48 flex-1 space-y-2">
            <Label htmlFor="grad-angle">Angle — {gradient.angle}°</Label>
            <Slider
              id="grad-angle"
              min={0}
              max={360}
              step={1}
              value={[gradient.angle]}
              onValueChange={([value]) => patch({ angle: value })}
            />
            <FieldHint>0° points up, 90° points right.</FieldHint>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Shape</span>
            <Tabs
              value={gradient.shape}
              onValueChange={(value) => patch({ shape: value as "circle" | "ellipse" })}
            >
              <TabsList>
                <TabsTrigger value="circle">Circle</TabsTrigger>
                <TabsTrigger value="ellipse">Ellipse</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {gradient.type !== "linear" ? (
          <>
            <div className="min-w-32 flex-1 space-y-2">
              <Label htmlFor="grad-x">Centre X — {gradient.centerX}%</Label>
              <Slider
                id="grad-x"
                min={0}
                max={100}
                value={[gradient.centerX]}
                onValueChange={([value]) => patch({ centerX: value })}
              />
            </div>
            <div className="min-w-32 flex-1 space-y-2">
              <Label htmlFor="grad-y">Centre Y — {gradient.centerY}%</Label>
              <Slider
                id="grad-y"
                min={0}
                max={100}
                value={[gradient.centerY]}
                onValueChange={([value]) => patch({ centerY: value })}
              />
            </div>
          </>
        ) : null}

        <div className="flex items-center gap-3 pb-2">
          <Switch
            id="grad-repeat"
            checked={gradient.repeating}
            onCheckedChange={(value) => patch({ repeating: value })}
          />
          <Label htmlFor="grad-repeat">Repeating</Label>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            patch({
              stops: gradient.stops.map((stop) => ({
                ...stop,
                color: `#${secureRange(0, 0xffffff).toString(16).padStart(6, "0")}`,
              })),
            })
          }
        >
          <Shuffle className="size-4" strokeWidth={1.75} />
          Random colours
        </Button>
      </div>

      <section className="surface-card space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Colour stops</h2>
          <Button
            variant="outline"
            size="sm"
            disabled={gradient.stops.length >= 8}
            onClick={() =>
              patch({
                stops: [
                  ...gradient.stops,
                  { id: `stop-${Date.now()}`, color: "#ffffff", position: 50 },
                ],
              })
            }
          >
            <Plus className="size-4" strokeWidth={1.75} />
            Add stop
          </Button>
        </div>

        {gradient.stops.map((stop) => (
          <div key={stop.id} className="flex flex-wrap items-center gap-3">
            <Input
              type="color"
              value={stop.color}
              onChange={(event) => updateStop(stop.id, { color: event.target.value })}
              aria-label="Stop colour"
              className="h-9 w-14 shrink-0 p-1"
            />
            <Input
              value={stop.color}
              onChange={(event) => updateStop(stop.id, { color: event.target.value })}
              aria-label="Stop colour hex"
              className="h-9 w-28 font-mono text-sm"
            />
            <div className="min-w-40 flex-1">
              <Slider
                min={0}
                max={100}
                value={[stop.position]}
                onValueChange={([value]) => updateStop(stop.id, { position: value })}
                aria-label={`Position of the ${stop.color} stop`}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-sm text-muted-foreground">
              {stop.position}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove this stop"
              disabled={gradient.stops.length <= 2}
              onClick={() => patch({ stops: gradient.stops.filter((entry) => entry.id !== stop.id) })}
            >
              <X className="size-3.5" strokeWidth={1.75} />
            </Button>
          </div>
        ))}
        <FieldHint>Two stops at the same position give a hard edge instead of a fade.</FieldHint>
      </section>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => patch({ ...preset.gradient })}
          >
            <span
              className="size-4 rounded-full border border-border"
              style={{ backgroundImage: toCss({ ...gradient, ...preset.gradient } as Gradient) }}
            />
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { label: "CSS", value: `background-image: ${css};` },
          { label: "Tailwind", value: toTailwind(gradient) },
        ].map((entry) => (
          <section key={entry.label} className="surface-card overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium text-foreground">{entry.label}</h2>
              <CopyButton value={entry.value} label="Copy" />
            </header>
            <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground">
              {entry.value}
            </pre>
          </section>
        ))}
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Stops are sorted by position before the CSS is written, because an
          out-of-order stop is silently clamped to the previous one — producing
          a hard band where you meant a fade, and looking like a browser bug
          rather than a typo. Gradient angles run clockwise from 0° pointing up,
          which is the opposite of the CSS transform convention.
        </span>
      </p>
    </div>
  );
}
