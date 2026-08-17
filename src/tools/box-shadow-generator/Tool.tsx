"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Info, Plus, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PRESETS, toCss, toTailwind, type Shadow } from "./logic";

export default function BoxShadowTool() {
  const [shadows, setShadows] = React.useState<Shadow[]>([
    { id: "a", x: 0, y: 4, blur: 6, spread: -1, color: "#000000", alpha: 0.1, inset: false },
    { id: "b", x: 0, y: 2, blur: 4, spread: -2, color: "#000000", alpha: 0.1, inset: false },
  ]);
  const [surface, setSurface] = React.useState("#f1f5f9");
  const [box, setBox] = React.useState("#ffffff");
  const [radius, setRadius] = React.useState(16);

  const css = toCss(shadows);

  function update(id: string, patch: Partial<Shadow>) {
    setShadows((current) => current.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function move(index: number, direction: -1 | 1) {
    setShadows((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const controls: { key: keyof Shadow; label: string; min: number; max: number }[] = [
    { key: "x", label: "X offset", min: -50, max: 50 },
    { key: "y", label: "Y offset", min: -50, max: 50 },
    { key: "blur", label: "Blur", min: 0, max: 100 },
    { key: "spread", label: "Spread", min: -50, max: 50 },
  ];

  return (
    <div className="space-y-5">
      <div
        className="grid h-80 place-items-center rounded-lg border border-border"
        style={{ backgroundColor: surface }}
      >
        <div
          className="size-40 sm:size-48"
          style={{ backgroundColor: box, borderRadius: radius, boxShadow: css }}
          role="img"
          aria-label="Shadow preview"
        />
      </div>

      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="bs-box">Element</Label>
          <Input
            id="bs-box"
            type="color"
            value={box}
            onChange={(event) => setBox(event.target.value)}
            className="h-10 w-20 p-1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bs-surface">Backdrop</Label>
          <Input
            id="bs-surface"
            type="color"
            value={surface}
            onChange={(event) => setSurface(event.target.value)}
            className="h-10 w-20 p-1"
          />
          <FieldHint>A shadow only reads against the surface it falls on.</FieldHint>
        </div>
        <div className="min-w-48 flex-1 space-y-2">
          <Label htmlFor="bs-radius">Corner radius — {radius}px</Label>
          <Slider
            id="bs-radius"
            min={0}
            max={96}
            value={[radius]}
            onValueChange={([value]) => setRadius(value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() =>
              setShadows(preset.shadows.map((s, index) => ({ ...s, id: `preset-${index}-${Date.now()}` })))
            }
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {shadows.map((shadow, index) => (
          <section key={shadow.id} className="surface-card space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-foreground">
                Layer {index + 1}
                {index === 0 && shadows.length > 1 ? (
                  <span className="ml-2 text-xs text-subtle-foreground">paints on top</span>
                ) : null}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`${shadow.id}-inset`}
                    checked={shadow.inset}
                    onCheckedChange={(value) => update(shadow.id, { inset: value })}
                  />
                  <Label htmlFor={`${shadow.id}-inset`}>Inset</Label>
                </div>
                <Button variant="ghost" size="icon" aria-label="Move layer up" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ArrowUp className="size-4" strokeWidth={1.75} />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Move layer down" disabled={index === shadows.length - 1} onClick={() => move(index, 1)}>
                  <ArrowDown className="size-4" strokeWidth={1.75} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove layer"
                  disabled={shadows.length <= 1}
                  onClick={() => setShadows((current) => current.filter((s) => s.id !== shadow.id))}
                >
                  <X className="size-4" strokeWidth={1.75} />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {controls.map((control) => (
                <div key={control.key} className="space-y-2">
                  <Label htmlFor={`${shadow.id}-${control.key}`}>
                    {control.label} — {shadow[control.key] as number}px
                  </Label>
                  <Slider
                    id={`${shadow.id}-${control.key}`}
                    min={control.min}
                    max={control.max}
                    value={[shadow[control.key] as number]}
                    onValueChange={([value]) => update(shadow.id, { [control.key]: value })}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${shadow.id}-color`}>Colour</Label>
                <Input
                  id={`${shadow.id}-color`}
                  type="color"
                  value={shadow.color}
                  onChange={(event) => update(shadow.id, { color: event.target.value })}
                  className="h-10 w-20 p-1"
                />
              </div>
              <div className="min-w-40 flex-1 space-y-2">
                <Label htmlFor={`${shadow.id}-alpha`}>
                  Opacity — {Math.round(shadow.alpha * 100)}%
                </Label>
                <Slider
                  id={`${shadow.id}-alpha`}
                  min={0}
                  max={100}
                  value={[Math.round(shadow.alpha * 100)]}
                  onValueChange={([value]) => update(shadow.id, { alpha: value / 100 })}
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      <Button
        variant="outline"
        disabled={shadows.length >= 6}
        onClick={() =>
          setShadows((current) => [
            ...current,
            { id: `s-${Date.now()}`, x: 0, y: 10, blur: 20, spread: 0, color: "#000000", alpha: 0.1, inset: false },
          ])
        }
      >
        <Plus className="size-4" strokeWidth={1.75} />
        Add a layer
      </Button>

      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { label: "CSS", value: `box-shadow: ${css};` },
          { label: "Tailwind", value: toTailwind(shadows) },
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
          Layer order runs top to bottom: the first shadow paints over the ones
          after it, which is the reverse of what most people expect and the usual
          reason a tight dark shadow seems to vanish. A convincing shadow is
          almost always two — a tight contact shadow plus a wide ambient one.
          One layer on its own reads as a sticker.
        </span>
      </p>
    </div>
  );
}
